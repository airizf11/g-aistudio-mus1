
import React from 'react';
import type { Song } from '../types';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, ShuffleIcon, RepeatIcon, VolumeUpIcon, VolumeOffIcon, HeartIcon, HeartSolidIcon } from './icons/Icons';

interface PlayerControlsProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  isCurrentSongLiked: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMuteToggle: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onToggleLike: (id: number) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isShuffle,
  isRepeat,
  isCurrentSongLiked,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onShuffle,
  onRepeat,
  onToggleLike,
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-[90px] bg-neutral-900 border-t border-neutral-800 p-4 flex items-center justify-between text-white flex-shrink-0">
      <div className="w-1/4 flex items-center gap-4 min-w-0">
        {currentSong ? (
          <>
            <img src={currentSong.coverArtUrl} alt={currentSong.title} className="w-14 h-14 rounded-md" />
            <div className="min-w-0">
              <p className="font-semibold truncate">{currentSong.title}</p>
              <p className="text-sm text-neutral-400 truncate">{currentSong.artist}</p>
            </div>
            <button 
              onClick={() => onToggleLike(currentSong.id)}
              className="ml-4 text-neutral-400 hover:text-white"
              aria-label={isCurrentSongLiked ? "Unlike" : "Like"}
            >
              {isCurrentSongLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-green-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-md bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
             </div>
             <div>
                <p className="font-semibold">No Song Playing</p>
                <p className="text-sm text-neutral-400">Select a song to start</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="flex items-center gap-5">
          <button onClick={onShuffle} title="Shuffle" className={`transition-colors ${isShuffle ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}>
            <ShuffleIcon className="w-5 h-5" />
          </button>
          <button onClick={onPrev} title="Previous" className="text-neutral-400 hover:text-white transition-colors">
            <PrevIcon className="w-6 h-6" />
          </button>
          <button onClick={onPlayPause} title={isPlaying ? 'Pause' : 'Play'} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform">
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button onClick={onNext} title="Next" className="text-neutral-400 hover:text-white transition-colors">
            <NextIcon className="w-6 h-6" />
          </button>
          <button onClick={onRepeat} title="Repeat" className={`transition-colors ${isRepeat ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}>
            <RepeatIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full max-w-xl flex items-center gap-2 mt-2">
          <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(currentTime)}</span>
          <div className="w-full group relative flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={onSeek}
              className="w-full"
              aria-label="Song progress"
            />
             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[4px] bg-neutral-600 rounded-full pointer-events-none">
                <div className="h-full bg-white group-hover:bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
             </div>
          </div>
          <span className="text-xs text-neutral-400 w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-1/4 flex items-center justify-end gap-3">
        <button onClick={onMuteToggle} title={volume > 0 ? "Mute" : "Unmute"} className="text-neutral-400 hover:text-white">
            {volume === 0 ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeUpIcon className="w-5 h-5" />}
        </button>
        <div className="w-24 group relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              className="w-full"
              aria-label="Volume control"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[4px] bg-neutral-600 rounded-full pointer-events-none">
                <div className="h-full bg-white group-hover:bg-green-500 rounded-full" style={{ width: `${volume * 100}%` }}></div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
