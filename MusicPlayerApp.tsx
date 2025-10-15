import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Song } from './types';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import PlayerControls from './components/PlayerControls';
import Toast from './components/Toast';
import type { View } from './App';

interface MusicPlayerAppProps {
  songs: Song[];
  navigate: (view: View) => void;
}

const MusicPlayerApp: React.FC<MusicPlayerAppProps> = ({ songs, navigate }) => {
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [playContext, setPlayContext] = useState<Song[]>(songs);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0.75);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [activeView, setActiveView] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [likedSongs, setLikedSongs] = useState(new Set<number>());

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = songs.find(song => song.id === currentSongId) ?? null;

  useEffect(() => {
    setPlayContext(songs);
  }, [songs]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(songId)) {
            newSet.delete(songId);
        } else {
            newSet.add(songId);
        }
        return newSet;
    });
  };

  const playSong = useCallback((songId: number, context?: Song[]) => {
    const songToPlay = songs.find(s => s.id === songId);
    if (!songToPlay) return;
    
    setCurrentSongId(songId);
    setIsPlaying(true);
    showToast(`Now Playing: ${songToPlay.title}`);
    
    if (context) {
      setPlayContext(context);
    } else {
      // Determine context if not explicitly provided
      const currentLikedSongs = songs.filter(song => likedSongs.has(song.id));
      const currentFilteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (searchQuery) {
        setPlayContext(currentFilteredSongs);
      } else if (activeView === 'Liked Songs') {
        setPlayContext(currentLikedSongs);
      } else {
        setPlayContext(songs);
      }
    }
  }, [songs, searchQuery, activeView, likedSongs]);
  
  const handlePlayPause = useCallback(() => {
    if (currentSongId === null && songs.length > 0) {
      playSong(songs[0].id, songs);
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    }
  }, [isPlaying, currentSongId, songs, playSong]);
  
  const handleNext = useCallback(() => {
    if (!currentSongId || playContext.length === 0) return;
    
    const currentIndex = playContext.findIndex(s => s.id === currentSongId);
    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playContext.length);
      // Avoid playing the same song twice in a row in shuffle
      if (playContext.length > 1 && nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % playContext.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % playContext.length;
    }
    
    if (playContext[nextIndex]) {
        playSong(playContext[nextIndex].id, playContext);
    }
  }, [currentSongId, playContext, isShuffle, playSong]);

  const handlePrev = () => {
    if (!currentSongId || playContext.length === 0) return;
    
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
       const currentIndex = playContext.findIndex(s => s.id === currentSongId);
       const prevIndex = (currentIndex - 1 + playContext.length) % playContext.length;
       if (playContext[prevIndex]) {
           playSong(playContext[prevIndex].id, playContext);
       }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
     if (newVolume > 0) {
      setVolumeBeforeMute(newVolume);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      setVolumeBeforeMute(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    } else {
      const newVolume = volumeBeforeMute > 0 ? volumeBeforeMute : 0.5;
      setVolume(newVolume);
      if (audioRef.current) audioRef.current.volume = newVolume;
    }
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handleSongEnd = () => {
      if(isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [handleNext, isRepeat]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Only reset src if it's different to prevent re-fetching
      if (audioRef.current.src !== currentSong.audioUrl) {
         audioRef.current.src = currentSong.audioUrl;
      }
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.load(); // Load new src
        audioRef.current.play().catch(e => console.error("Error playing audio on song change:", e));
      }
    }
  }, [currentSong, isPlaying, volume]);


  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const likedSongsList = songs.filter(song => likedSongs.has(song.id));

  const getContentSongs = () => {
    if (searchQuery) return filteredSongs;
    if (activeView === 'Liked Songs') return likedSongsList;
    return songs;
  }

  return (
    <div className="h-screen w-screen bg-black text-neutral-300 flex flex-col overflow-hidden">
      <div className="flex flex-grow" style={{ height: 'calc(100vh - 90px)' }}>
        <Sidebar activeView={activeView} setActiveView={setActiveView} onNavigateToAdmin={() => navigate('adminLogin')} />
        <MainView 
            songs={getContentSongs()} 
            playSong={playSong} 
            activeView={activeView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleLike={toggleLike}
            likedSongs={likedSongs}
        />
      </div>
      <PlayerControls
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        isCurrentSongLiked={currentSong ? likedSongs.has(currentSong.id) : false}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onShuffle={() => setIsShuffle(s => !s)}
        onRepeat={() => setIsRepeat(r => !r)}
        onToggleLike={toggleLike}
      />
      <audio ref={audioRef} />
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
};

export default MusicPlayerApp;