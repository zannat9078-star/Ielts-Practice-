import React, { useEffect, useState, useRef } from 'react';
import { audioEngine, AudioPlaybackState } from '../../services/audioEngine';
import { ListeningPart } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AudioPlayerProps {
  testId: string;
  testTitle: string;
  parts: ListeningPart[];
  activePartIndex: number;
  onPartChange?: (index: number) => void;
  className?: string;
  audioUrl?: string;
  audioScript?: string;
  sectionNumber?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  testId,
  testTitle,
  parts,
  activePartIndex,
  onPartChange,
  className = '',
}) => {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioEngine.getState());
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [playbackMode, setPlaybackMode] = useState<'part' | 'continuous'>('continuous');
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [scrubValue, setScrubValue] = useState<number>(0);
  const lastLoadedKeyRef = useRef<string>('');

  // Format mm:ss helper
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Load test into engine only when parts definition changes
  useEffect(() => {
    const key = `${testId}_${parts.length}_${parts.map((p) => p.durationSeconds || p.durationMinutes).join('-')}`;
    if (lastLoadedKeyRef.current !== key && parts.length > 0) {
      lastLoadedKeyRef.current = key;
      audioEngine.loadMultiPartTest(parts, activePartIndex, playbackMode);
    }
  }, [testId, parts, activePartIndex, playbackMode]);

  // Subscribe to engine state
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setPlaybackState(state);
      if (onPartChange && state.activePartIndex !== activePartIndex) {
        onPartChange(state.activePartIndex);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [activePartIndex, onPartChange]);

  const handleTogglePlay = () => {
    if (playbackState.isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setScrubValue(newTime);
    if (!isScrubbing) {
      if (playbackMode === 'continuous') {
        audioEngine.seekOverall(newTime);
      } else {
        audioEngine.seek(newTime);
      }
    }
  };

  const handleSeekCommit = () => {
    setIsScrubbing(false);
    if (playbackMode === 'continuous') {
      audioEngine.seekOverall(scrubValue);
    } else {
      audioEngine.seek(scrubValue);
    }
  };

  const handleSkip = (seconds: number) => {
    audioEngine.skip(seconds);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleToggleMute = () => {
    audioEngine.toggleMute();
    setIsMuted(!isMuted);
  };

  const handleSelectPart = (idx: number) => {
    audioEngine.switchPart(idx);
    if (onPartChange) onPartChange(idx);
  };

  const togglePlaybackMode = (mode: 'part' | 'continuous') => {
    setPlaybackMode(mode);
    audioEngine.setPlaybackMode(mode);
  };

  const currentPart = parts[playbackState.activePartIndex] || parts[0];

  // Calculated values based on mode
  const displayedCurrentTime =
    playbackMode === 'continuous' ? playbackState.overallCurrentTime : playbackState.currentTime;
  const displayedDuration =
    playbackMode === 'continuous'
      ? Math.max(playbackState.overallDuration, 600)
      : Math.max(playbackState.duration, 120);

  const progressPercent =
    displayedDuration > 0
      ? Math.min(100, Math.max(0, (displayedCurrentTime / displayedDuration) * 100))
      : 0;

  return (
    <div
      className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm transition-colors ${className}`}
      data-testid="listening-audio-player"
    >
      {/* Player Header with Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm shadow-xs border border-red-100 dark:border-red-900/40">
            🎧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                Official Audio System
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ~10 Min Complete Test
              </span>
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate max-w-md">
              {testTitle} — Part {playbackState.activePartNumber}: {currentPart?.title || 'Section'}
            </h4>
          </div>
        </div>

        {/* Mode Switcher: Full Continuous Test vs Individual Part */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => togglePlaybackMode('continuous')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              playbackMode === 'continuous'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
            title="Simulates real IELTS exam audio from Part 1 to 4 continuously (~10 mins)"
          >
            Continuous Full Test (~10m)
          </button>
          <button
            type="button"
            onClick={() => togglePlaybackMode('part')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              playbackMode === 'part'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
            title="Practice current part audio only"
          >
            Part by Part
          </button>
        </div>
      </div>

      {/* Part Navigation Pills */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {parts.map((p, idx) => {
          const isCurrent = playbackState.activePartIndex === idx;
          return (
            <button
              key={p.id || idx}
              type="button"
              onClick={() => handleSelectPart(idx)}
              className={`text-left p-2 rounded-lg border transition-all text-xs ${
                isCurrent
                  ? 'border-red-600 bg-red-50/70 dark:bg-red-950/30 dark:border-red-500 text-red-900 dark:text-red-200 font-semibold shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Part {p.partNumber || idx + 1}</span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">
                  {formatTime(p.durationSeconds || Math.round(p.durationMinutes * 60) || 150)}
                </span>
              </div>
              <div className="text-[11px] truncate text-stone-500 dark:text-stone-400 font-normal">
                {p.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Progress Bar & Time */}
      <div className="space-y-1.5 mb-4">
        <div className="relative w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden cursor-pointer group">
          {/* Visual multi-part split markers if continuous */}
          {playbackMode === 'continuous' && (
            <div className="absolute inset-0 flex pointer-events-none z-10">
              <div className="w-1/4 border-r border-stone-300/40 dark:border-stone-700/60 h-full" />
              <div className="w-1/4 border-r border-stone-300/40 dark:border-stone-700/60 h-full" />
              <div className="w-1/4 border-r border-stone-300/40 dark:border-stone-700/60 h-full" />
              <div className="w-1/4 h-full" />
            </div>
          )}

          {/* Active Progress Fill */}
          <div
            className="h-full bg-red-600 dark:bg-red-500 rounded-full transition-[width] duration-150"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Invisible Range Input for precision scrubbing */}
          <input
            type="range"
            min={0}
            max={displayedDuration}
            step={1}
            value={isScrubbing ? scrubValue : displayedCurrentTime}
            onMouseDown={() => setIsScrubbing(true)}
            onTouchStart={() => setIsScrubbing(true)}
            onChange={handleSeek}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="Seek listening audio progress"
          />
        </div>

        {/* Time stamps and status text */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {formatTime(isScrubbing ? scrubValue : displayedCurrentTime)}
          </span>
          <div className="text-[11px] font-sans text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
            {playbackState.isPlaying ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Audio Playing &bull; {playbackState.statusText || 'Active IELTS Session'}</span>
              </>
            ) : (
              <span>Ready for playback &bull; ~10:00 Duration</span>
            )}
          </div>
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {formatTime(displayedDuration)}
          </span>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Skip Back 10s */}
          <button
            type="button"
            onClick={() => handleSkip(-10)}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Big Play / Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            aria-label={playbackState.isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {playbackState.isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Skip Forward 10s */}
          <button
            type="button"
            onClick={() => handleSkip(10)}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Forward 10 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Volume Slider */}
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            aria-label="Volume slider"
          />
        </div>

        {/* Right: Transcript Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showTranscript
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs'
                : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Transcript Panel - Completely independent so opening/closing won't collapse audio or questions */}
      {showTranscript && (
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Audio Script — Part {playbackState.activePartNumber}
            </span>
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              {currentPart?.title}
            </span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-line font-mono">
            {currentPart?.transcript || currentPart?.audioScript || 'No transcript available for this part.'}
          </div>
        </div>
      )}
    </div>
  );
};
