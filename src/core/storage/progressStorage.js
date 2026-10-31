// AlgoArena Local Progress Storage Manager
const STORAGE_KEY = 'algoarena_progress_v1';

const defaultState = {
  version: 1,
  recentAlgorithms: ['Merge Sort', 'Binary Search', 'Dijkstra'],
  bookmarked: [],
  completedModules: [],
  quizHistory: [],
  theme: 'paper',
  speedPref: 650,
};

export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
    return defaultState;
  }
}

export function saveProgress(updater) {
  try {
    const current = getProgress();
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
    return defaultState;
  }
}

export function recordAlgorithmVisit(name) {
  return saveProgress(prev => {
    const filtered = (prev.recentAlgorithms || []).filter(item => item !== name);
    return {
      ...prev,
      recentAlgorithms: [name, ...filtered].slice(0, 10),
    };
  });
}

export function toggleBookmark(name) {
  return saveProgress(prev => {
    const bookmarked = new Set(prev.bookmarked || []);
    if (bookmarked.has(name)) {
      bookmarked.delete(name);
    } else {
      bookmarked.add(name);
    }
    return {
      ...prev,
      bookmarked: Array.from(bookmarked),
    };
  });
}

export function recordQuizScore(topic, score, total) {
  return saveProgress(prev => ({
    ...prev,
    quizHistory: [
      {
        topic,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        timestamp: new Date().toISOString(),
      },
      ...(prev.quizHistory || []),
    ].slice(0, 25),
  }));
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear localStorage:', e);
  }
  return defaultState;
}
