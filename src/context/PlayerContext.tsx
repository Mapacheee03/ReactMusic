import { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cancion } from '../services/api';

interface PlayerContextType {
  cancionActual: Cancion | undefined;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  playlist: Cancion[];
  currentIndex: number;
  play: (cancion: Cancion, playlist?: Cancion[], index?: number) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [cancionActual, setCancionActual] = useState<Cancion | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState<Cancion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !cancionActual) return;

    audioRef.current.src = cancionActual.audioUrl || '';
    audioRef.current.currentTime = currentTime;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.error("Error al reproducir:", e));
      }
    }
  }, [cancionActual]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.error("Error al reproducir:", e));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const play = (cancion: Cancion, newPlaylist: Cancion[] = [], index?: number) => {
    setCancionActual(cancion);
    setIsPlaying(true);
    setCurrentTime(0);
    
    if (newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
      setCurrentIndex(index ?? newPlaylist.findIndex(c => c.id === cancion.id));
    } else if (playlist.length === 0) {
      setPlaylist([cancion]);
      setCurrentIndex(0);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleMute = () => setIsMuted(!isMuted);

  const onNext = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCancionActual(playlist[nextIndex]);
    setCurrentTime(0);
    
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const onPrev = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCancionActual(playlist[prevIndex]);
    setCurrentTime(0);
    
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <PlayerContext.Provider value={{
      cancionActual,
      isPlaying,
      currentTime,
      volume,
      isMuted,
      playlist,
      currentIndex,
      play,
      togglePlay,
      setCurrentTime: handleSeek,
      setVolume,
      toggleMute,
      onNext,
      onPrev,
    }}>
      {children}
      <audio
        ref={el => {
          if (el && audioRef.current === null) {
            audioRef.current = el;
          }
        }}
        onEnded={onNext}
        hidden
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  return context;
}