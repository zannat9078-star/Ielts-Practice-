import React, { useEffect, useState } from 'react';
import { audioEngine, AudioPlaybackState } from '../../services/audioEngine';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  FileText,
  ChevronDown,
  ChevronUp,
  Activity,
  Headphones,
} from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  audioScript: string;
  testTitle: string;
  sectionNumber: number;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioScript,
  testTitle,
  sectionNumber,
  className = '',
}) => {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioEngine.getState());
  const [showTranscript, setShowTranscript] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Load track in audio engine
    audioEngine.loadTrack(audioUrl, audioScript);
    const unsubscribe = audioEngine.subscribe((state) => {
      setPlaybackState(state);
    });

    return () => {
      unsubscribe();
      audioEngine.stop();
    };
  }, [audioUrl, audioScript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    audioEngine.seek(target);
  };

  const speeds = [0.8, 1.0, 1.2, 1.5];

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f131c] shadow-md overflow-hidden transition-all ${className}`}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
            S{sectionNumber}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[220px] sm:max-w-md">
              {testTitle}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Headphones className="w-3 h-3 text-red-500" />
              IELTS High-Fidelity Audio Feed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
              showTranscript
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-300 dark:border-red-800'
                : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle Script View"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Transcript</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Collapse player"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Player Controls (Keeps playing even when player UI is folded) */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Animated Waveform Visualizer */}
          <div className="flex items-center justify-center gap-1 h-8 px-2 bg-slate-100 dark:bg-slate-900/60 rounded-lg overflow-hidden">
            {Array.from({ length: 36 }).map((_, i) => {
              const active = playbackState.isPlaying;
              const height = active ? 20 + Math.sin(i * 0.6 + Date.now() * 0.002) * 16 : 8;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    active ? 'bg-red-600 dark:bg-red-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  style={{ height: `${Math.max(6, Math.min(32, height))}px` }}
                />
              );
            })}
          </div>

          {/* Scrub Bar & Timers */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max={playbackState.duration}
              step="0.5"
              value={playbackState.currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>{formatTime(playbackState.currentTime)}</span>
              <span className="flex items-center gap-1 text-[11px] font-sans text-red-600 dark:text-red-400 font-bold">
                {playbackState.isPlaying ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> Playing Audio
                  </>
                ) : (
                  'Ready to Play'
                )}
              </span>
              <span>{formatTime(playbackState.duration)}</span>
            </div>
          </div>

          {/* Control Buttons Grid */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Play / Skip Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => audioEngine.skip(-5)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Rewind 5 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (playbackState.isPlaying) {
                    audioEngine.pause();
                  } else {
                    audioEngine.play();
                  }
                }}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-transform active:scale-95"
                aria-label={playbackState.isPlaying ? 'Pause' : 'Play'}
              >
                {playbackState.isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 translate-x-0.5" />
                )}
              </button>

              <button
                onClick={() => audioEngine.skip(5)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Forward 5 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed selection */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => audioEngine.setPlaybackRate(s)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                    playbackState.playbackRate === s
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Volume & Mute */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => audioEngine.toggleMute()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Mute"
              >
                {playbackState.isMuted || playbackState.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={playbackState.isMuted ? 0 : playbackState.volume}
                onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transcript Drawer if opened */}
      {showTranscript && (
        <div className="p-4 bg-amber-50/60 dark:bg-slate-900/90 border-t border-amber-200 dark:border-slate-800 max-h-56 overflow-y-auto text-xs sm:text-sm font-passage leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-slate-800 font-sans font-bold text-xs text-amber-900 dark:text-amber-400 mb-2">
            <span>OFFICIAL AUDIO TRANSCRIPT</span>
            <span className="text-[10px] text-slate-500">IELTS Audio Script</span>
          </div>
          {audioScript}
        </div>
      )}
    </div>
  );
};
