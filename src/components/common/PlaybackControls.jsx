import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward, Timer } from 'lucide-react';

export function PlaybackControls({
  playing,
  onTogglePlay,
  currentIndex,
  totalSteps,
  onStepChange,
  speed,
  onSpeedChange,
  onReset
}) {
  const maxIdx = Math.max(0, totalSteps - 1);
  const percent = totalSteps > 0 ? Math.round(((currentIndex + 1) / totalSteps) * 100) : 0;

  return (
    <div className="playback">
      <div className="play-buttons">
        <button
          title="Jump to Start"
          onClick={() => { onTogglePlay(false); onStepChange(0); }}
          disabled={currentIndex <= 0}
        >
          <Rewind size={14} />
        </button>
        <button
          title="Previous Step"
          onClick={() => { onTogglePlay(false); onStepChange(Math.max(0, currentIndex - 1)); }}
          disabled={currentIndex <= 0}
        >
          <SkipBack size={14} />
        </button>
        <button
          className="play-main"
          title={playing ? 'Pause' : 'Play'}
          onClick={() => onTogglePlay(!playing)}
          disabled={totalSteps === 0}
        >
          {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </button>
        <button
          title="Next Step"
          onClick={() => { onTogglePlay(false); onStepChange(Math.min(maxIdx, currentIndex + 1)); }}
          disabled={currentIndex >= maxIdx}
        >
          <SkipForward size={14} />
        </button>
        <button
          title="Jump to End"
          onClick={() => { onTogglePlay(false); onStepChange(maxIdx); }}
          disabled={currentIndex >= maxIdx}
        >
          <FastForward size={14} />
        </button>
      </div>

      <div className="progress-area">
        <div className="progress-label">
          <span>Execution Step <b>{totalSteps ? currentIndex + 1 : 0}</b> / {totalSteps}</span>
          <b>{percent}%</b>
        </div>
        <input
          type="range"
          min="0"
          max={maxIdx}
          value={Math.min(currentIndex, maxIdx)}
          onChange={e => {
            onTogglePlay(false);
            onStepChange(Number(e.target.value));
          }}
          disabled={totalSteps <= 1}
        />
        <div className="progress-ends">
          <span>START</span>
          <span>FINISH</span>
        </div>
      </div>

      <div className="speed-select" title="Playback speed">
        <Timer size={14} />
        <select value={speed} onChange={e => onSpeedChange(Number(e.target.value))}>
          <option value="1200">0.25×</option>
          <option value="800">0.5×</option>
          <option value="500">1×</option>
          <option value="250">2×</option>
          <option value="100">4×</option>
        </select>
      </div>
    </div>
  );
}
