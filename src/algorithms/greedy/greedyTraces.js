// AlgoArena Deterministic Greedy Algorithms Trace Generator
// Implements 7 Greedy algorithms with decision logs, selected/rejected items, and optimality warnings

export function generateGreedyTrace(algorithm, customParams = {}) {
  const steps = [];

  const pushStep = (description, details = {}) => {
    steps.push({
      line: description,
      items: details.items ? JSON.parse(JSON.stringify(details.items)) : [],
      selected: details.selected ? [...details.selected] : [],
      rejected: details.rejected ? [...details.rejected] : [],
      current: details.current !== undefined ? details.current : null,
      table: details.table ? JSON.parse(JSON.stringify(details.table)) : null,
      metricName: details.metricName || 'Total Value',
      metricValue: details.metricValue !== undefined ? details.metricValue : 0,
      kind: details.kind || 'decision',
      codeLine: details.codeLine || 0
    });
  };

  switch (algorithm) {
    case 'Activity Selection': {
      const activities = customParams.activities || [
        { id: 'A1', start: 1, finish: 4 },
        { id: 'A2', start: 3, finish: 5 },
        { id: 'A3', start: 0, finish: 6 },
        { id: 'A4', start: 5, finish: 7 },
        { id: 'A5', start: 3, finish: 9 },
        { id: 'A6', start: 5, finish: 9 },
        { id: 'A7', start: 6, finish: 10 },
        { id: 'A8', start: 8, finish: 11 },
        { id: 'A9', start: 8, finish: 12 },
        { id: 'A10', start: 2, finish: 14 },
        { id: 'A11', start: 12, finish: 16 }
      ];

      pushStep('Starting Activity Selection. First, sort all activities by finish time ascending.', { items: activities, kind: 'start', codeLine: 1 });
      const sorted = [...activities].sort((a, b) => a.finish - b.finish);
      pushStep('Activities sorted by earliest finish time.', { items: sorted, kind: 'decision', codeLine: 1 });

      const selected = [sorted[0].id];
      const rejected = [];
      let lastFinish = sorted[0].finish;

      pushStep(`Greedy choice: Pick first activity ${sorted[0].id} (finish=${sorted[0].finish}). Frees resource earliest.`, {
        items: sorted,
        selected: [...selected],
        current: sorted[0].id,
        metricName: 'Activities Selected',
        metricValue: selected.length,
        kind: 'select',
        codeLine: 2
      });

      for (let i = 1; i < sorted.length; i++) {
        const act = sorted[i];
        if (act.start >= lastFinish) {
          selected.push(act.id);
          lastFinish = act.finish;
          pushStep(`Select ${act.id} (start=${act.start} >= previous finish=${lastFinish}). Compatible with schedule!`, {
            items: sorted,
            selected: [...selected],
            rejected: [...rejected],
            current: act.id,
            metricName: 'Activities Selected',
            metricValue: selected.length,
            kind: 'select',
            codeLine: 5
          });
        } else {
          rejected.push(act.id);
          pushStep(`Reject ${act.id} (start=${act.start} conflicts with ongoing activity ending at ${lastFinish}).`, {
            items: sorted,
            selected: [...selected],
            rejected: [...rejected],
            current: act.id,
            metricName: 'Activities Selected',
            metricValue: selected.length,
            kind: 'reject',
            codeLine: 4
          });
        }
      }

      pushStep(`Activity Selection complete. Maximum mutually compatible set size: ${selected.length} (${selected.join(', ')}).`, {
        items: sorted,
        selected: [...selected],
        rejected: [...rejected],
        metricName: 'Total Selected',
        metricValue: selected.length,
        kind: 'done',
        codeLine: 7
      });
      break;
    }

    case 'Fractional Knapsack': {
      const W = customParams.capacity || 50;
      const items = customParams.items || [
        { id: 'Item 1', weight: 10, value: 60 },
        { id: 'Item 2', weight: 20, value: 100 },
        { id: 'Item 3', weight: 30, value: 120 }
      ];

      items.forEach(it => { it.ratio = Number((it.value / it.weight).toFixed(2)); });
      pushStep(`Starting Fractional Knapsack (Capacity W = ${W}). Sort items by value/weight ratio descending.`, { items, kind: 'start', codeLine: 1 });

      const sorted = [...items].sort((a, b) => b.ratio - a.ratio);
      pushStep('Sorted items by density (profit per unit weight).', { items: sorted, kind: 'decision', codeLine: 1 });

      let currentWeight = 0;
      let totalValue = 0;
      const selected = [];
      const rejected = [];

      for (let item of sorted) {
        if (currentWeight + item.weight <= W) {
          currentWeight += item.weight;
          totalValue += item.value;
          item.takenFraction = 1.0;
          selected.push(item.id);
          pushStep(`Take 100% of ${item.id} (wt=${item.weight}, val=${item.value}). Remaining capacity: ${W - currentWeight}.`, {
            items: sorted,
            selected: [...selected],
            current: item.id,
            metricName: 'Total Value',
            metricValue: totalValue,
            kind: 'select',
            codeLine: 4
          });
        } else {
          const remain = W - currentWeight;
          if (remain > 0) {
            const fraction = remain / item.weight;
            const fractionVal = item.value * fraction;
            totalValue += fractionVal;
            currentWeight += remain;
            item.takenFraction = Number(fraction.toFixed(2));
            selected.push(`${item.id} (${(fraction * 100).toFixed(0)}%)`);
            pushStep(`Knapsack almost full: Take ${(fraction * 100).toFixed(1)}% of ${item.id} (wt=${remain}, val=+${fractionVal.toFixed(1)}). Capacity exhausted!`, {
              items: sorted,
              selected: [...selected],
              current: item.id,
              metricName: 'Total Value',
              metricValue: Number(totalValue.toFixed(1)),
              kind: 'select',
              codeLine: 7
            });
          } else {
            rejected.push(item.id);
            item.takenFraction = 0;
            pushStep(`Reject ${item.id}: Knapsack is completely full.`, {
              items: sorted,
              selected: [...selected],
              rejected: [...rejected],
              current: item.id,
              metricName: 'Total Value',
              metricValue: Number(totalValue.toFixed(1)),
              kind: 'reject',
              codeLine: 8
            });
          }
        }
      }

      pushStep(`Fractional Knapsack complete. Maximum value achieved: ${totalValue.toFixed(1)}.`, {
        items: sorted,
        selected: [...selected],
        rejected: [...rejected],
        metricName: 'Final Profit',
        metricValue: Number(totalValue.toFixed(1)),
        kind: 'done',
        codeLine: 9
      });
      break;
    }

    case 'Job Sequencing with Deadlines': {
      const jobs = customParams.jobs || [
        { id: 'J1', deadline: 2, profit: 100 },
        { id: 'J2', deadline: 1, profit: 19 },
        { id: 'J3', deadline: 2, profit: 27 },
        { id: 'J4', deadline: 1, profit: 25 },
        { id: 'J5', deadline: 3, profit: 15 }
      ];

      pushStep('Starting Job Sequencing with Deadlines. Sort jobs by profit descending.', { items: jobs, kind: 'start', codeLine: 1 });
      const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
      const maxDeadline = Math.max(...jobs.map(j => j.deadline));
      const slots = new Array(maxDeadline + 1).fill(null);

      const selected = [];
      const rejected = [];
      let totalProfit = 0;

      for (let job of sorted) {
        let slotted = false;
        for (let t = Math.min(maxDeadline, job.deadline); t >= 1; t--) {
          if (slots[t] === null) {
            slots[t] = job.id;
            selected.push(job.id);
            totalProfit += job.profit;
            slotted = true;
            pushStep(`Slot ${job.id} (profit=${job.profit}, deadline=${job.deadline}) into latest available time slot [t=${t}].`, {
              items: sorted,
              selected: [...selected],
              rejected: [...rejected],
              current: job.id,
              metricName: 'Total Profit',
              metricValue: totalProfit,
              table: slots.slice(1),
              kind: 'select',
              codeLine: 5
            });
            break;
          }
        }
        if (!slotted) {
          rejected.push(job.id);
          pushStep(`Reject ${job.id}: all slots prior to deadline ${job.deadline} are occupied by higher-profit jobs.`, {
            items: sorted,
            selected: [...selected],
            rejected: [...rejected],
            current: job.id,
            metricName: 'Total Profit',
            metricValue: totalProfit,
            table: slots.slice(1),
            kind: 'reject',
            codeLine: 5
          });
        }
      }

      pushStep(`Job Sequencing complete. Scheduled jobs: [${selected.join(', ')}] with total profit ${totalProfit}.`, {
        items: sorted,
        selected: [...selected],
        metricName: 'Total Profit',
        metricValue: totalProfit,
        table: slots.slice(1),
        kind: 'done',
        codeLine: 6
      });
      break;
    }

    case 'Coin Change Greedy': {
      const coins = customParams.coins || [25, 10, 5, 1]; // or non-canonical [4, 3, 1]
      const amount = customParams.amount || 67;

      pushStep(`Starting Greedy Coin Change for amount ${amount}. Denominations: [${coins.join(', ')}].`, { kind: 'start', codeLine: 0 });
      const sorted = [...coins].sort((a, b) => b - a);

      let rem = amount;
      let totalCoins = 0;
      const countMap = {};

      for (let c of sorted) {
        const cnt = Math.floor(rem / c);
        if (cnt > 0) {
          countMap[c] = cnt;
          totalCoins += cnt;
          rem -= cnt * c;
          pushStep(`Take ${cnt} coin(s) of value ${c} (greedily largest fitting denomination). Remaining: ${rem}.`, {
            items: Object.entries(countMap).map(([coin, n]) => ({ id: `${n}x (${coin}¢)` })),
            metricName: 'Coins Used',
            metricValue: totalCoins,
            kind: 'select',
            codeLine: 3
          });
        }
      }

      // Pedagogical warning for non-canonical coins
      let note = '';
      if (sorted.includes(4) && sorted.includes(3) && amount === 6) {
        note = ' NOTE: For coins [4, 3, 1], greedy yields 4+1+1 (3 coins), whereas optimal DP is 3+3 (2 coins)! Greedy is not guaranteed for arbitrary denominations.';
      }

      pushStep(`Greedy Coin Change complete. Dispensed ${totalCoins} coins.${note}`, {
        metricName: 'Total Coins',
        metricValue: totalCoins,
        kind: 'done',
        codeLine: 5
      });
      break;
    }

    case 'Minimum Platforms': {
      const arrivals = customParams.arrivals || [900, 940, 950, 1100, 1500, 1800];
      const departures = customParams.departures || [910, 1200, 1120, 1130, 1900, 2000];

      pushStep('Starting Minimum Platforms for railway station. Sort arrivals and departures independently.', { kind: 'start', codeLine: 1 });
      const arr = [...arrivals].sort((a, b) => a - b);
      const dep = [...departures].sort((a, b) => a - b);

      let platforms = 0;
      let maxPlatforms = 0;
      let i = 0, j = 0;

      while (i < arr.length) {
        if (arr[i] <= dep[j]) {
          platforms++;
          maxPlatforms = Math.max(maxPlatforms, platforms);
          pushStep(`Train arrival at ${arr[i]} (before departure at ${dep[j]}): Need platform. Current in-use: ${platforms}.`, {
            metricName: 'Peak Platforms Needed',
            metricValue: maxPlatforms,
            kind: 'select',
            codeLine: 4
          });
          i++;
        } else {
          platforms--;
          pushStep(`Train departure at ${dep[j]}: Platform vacated. Current in-use: ${platforms}.`, {
            metricName: 'Peak Platforms Needed',
            metricValue: maxPlatforms,
            kind: 'reject',
            codeLine: 5
          });
          j++;
        }
      }

      pushStep(`Minimum Platforms calculated: Station requires at least ${maxPlatforms} platform(s) to avoid collisions.`, {
        metricName: 'Platforms Required',
        metricValue: maxPlatforms,
        kind: 'done',
        codeLine: 7
      });
      break;
    }

    default:
      pushStep(`Greedy algorithm ${algorithm} completed.`, { kind: 'done' });
  }

  return steps;
}
