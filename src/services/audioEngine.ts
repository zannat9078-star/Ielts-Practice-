/**
 * Audio Engine for IELTS Listening Practice
 * Supports HTML5 Audio with fallback to Web SpeechSynthesis for IELTS spoken test dialogue
 */

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
}

export type PlaybackListener = (state: AudioPlaybackState) => void;

class ListeningAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isUsingSpeechSynthesis: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentScriptText: string = '';
  private durationSeconds: number = 180; // default estimated
  private currentTimeSeconds: number = 0;
  private isPlaying: boolean = false;
  private playbackRate: number = 1.0;
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private timerInterval: any = null;
  private listeners: Set<PlaybackListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.addEventListener('timeupdate', () => {
        if (!this.isUsingSpeechSynthesis && this.audioElement) {
          this.currentTimeSeconds = this.audioElement.currentTime;
          this.durationSeconds = this.audioElement.duration || this.durationSeconds;
          this.notify();
        }
      });
      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTimeSeconds = 0;
        this.notify();
      });
      this.audioElement.addEventListener('error', () => {
        // Fallback to SpeechSynthesis if audio element fails to load external URL
        this.fallbackToSpeech();
      });
    }
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  public getState(): AudioPlaybackState {
    return {
      isPlaying: this.isPlaying,
      currentTime: Math.min(this.currentTimeSeconds, this.durationSeconds),
      duration: Math.max(this.durationSeconds, 1),
      playbackRate: this.playbackRate,
      volume: this.volume,
      isMuted: this.isMuted,
    };
  }

  public loadTrack(audioUrl: string | undefined, scriptText: string, estimatedDurationSec: number = 180) {
    this.stop();
    this.currentScriptText = scriptText;
    this.durationSeconds = Math.max(estimatedDurationSec, 30);
    this.currentTimeSeconds = 0;

    if (audioUrl && audioUrl.startsWith('http')) {
      this.isUsingSpeechSynthesis = false;
      if (this.audioElement) {
        this.audioElement.src = audioUrl;
        this.audioElement.load();
      }
    } else {
      this.isUsingSpeechSynthesis = true;
      // Estimate duration based on word count (avg IELTS speech is ~140 words per minute)
      const words = scriptText.trim().split(/\s+/).length;
      this.durationSeconds = Math.max(Math.round((words / 135) * 60), 45);
    }
    this.notify();
  }

  private playTone(freq: number, durationMs: number = 200) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  public play() {
    if (this.isPlaying) return;

    if (!this.isUsingSpeechSynthesis && this.audioElement && this.audioElement.src) {
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          this.fallbackToSpeech();
          this.startSpeechSynthesis();
        });
    } else {
      this.startSpeechSynthesis();
    }
  }

  private fallbackToSpeech() {
    this.isUsingSpeechSynthesis = true;
    const words = this.currentScriptText.trim().split(/\s+/).length;
    this.durationSeconds = Math.max(Math.round((words / 135) * 60), 45);
  }

  private startSpeechSynthesis() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.startSimulatedTimer();
      return;
    }

    window.speechSynthesis.cancel();

    // Play exam intro chime
    this.playTone(880, 250);

    const utterance = new SpeechSynthesisUtterance(this.currentScriptText || 'This is the IELTS listening test.');
    utterance.rate = Math.max(0.7, Math.min(1.4, this.playbackRate * 0.95)); // natural pace
    utterance.volume = this.isMuted ? 0 : this.volume;

    // Pick a British or Commonwealth voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) =>
        v.lang.includes('en-GB') ||
        v.name.includes('UK') ||
        v.name.includes('British') ||
        v.lang.includes('en-AU') ||
        v.lang.includes('en-US')
    );
    if (enVoice) utterance.voice = enVoice;

    utterance.onstart = () => {
      this.isPlaying = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.currentTimeSeconds = this.durationSeconds;
      this.stopTimer();
      this.notify();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.stopTimer();
      this.notify();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    this.isPlaying = true;
    this.startSimulatedTimer();
    this.notify();
  }

  private startSimulatedTimer() {
    this.stopTimer();
    const intervalMs = 250;
    this.timerInterval = setInterval(() => {
      if (this.isPlaying) {
        this.currentTimeSeconds += (intervalMs / 1000) * this.playbackRate;
        if (this.currentTimeSeconds >= this.durationSeconds) {
          this.currentTimeSeconds = this.durationSeconds;
          this.pause();
        }
        this.notify();
      }
    }, intervalMs);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopTimer();

    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.currentTimeSeconds = 0;
    this.stopTimer();

    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify();
  }

  public seek(targetSeconds: number) {
    const clamped = Math.max(0, Math.min(targetSeconds, this.durationSeconds));
    this.currentTimeSeconds = clamped;

    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.currentTime = clamped;
    }
    this.notify();
  }

  public skip(secondsDelta: number) {
    this.seek(this.currentTimeSeconds + secondsDelta);
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.playbackRate = rate;
    } else if (this.isPlaying) {
      // restart with updated rate
      this.pause();
      this.play();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.isMuted = this.volume === 0;
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    this.notify();
  }
}

export const audioEngine = new ListeningAudioEngine();
