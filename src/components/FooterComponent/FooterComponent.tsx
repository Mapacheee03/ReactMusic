// src/components/FooterComponent/FooterComponent.tsx
import { usePlayer } from '../../context/PlayerContext';
import { Link } from 'react-router-dom';
import './FooterComponent.css';

const BASE_URL = 'https://reactmusic-back.onrender.com/';

function buildImageUrl(path?: string) {
  if (!path || path.trim() === '') return '';
  const safePath = path.startsWith('/') ? path.slice(1) : path;
  const encodedPath = safePath
    .split('/')
    .map(segment => encodeURIComponent(segment).replace(/'/g, '%27'))
    .join('/');
  return `${BASE_URL}${encodedPath}`;
}

function FooterComponent() {
  const {
    cancionActual,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    togglePlay,
    setCurrentTime,
    setVolume,
    toggleMute,
    onNext,
    onPrev,
  } = usePlayer();

  const parseDuration = (duracion?: string) => {
    if (!duracion) return 0;
    const [min, sec] = duracion.split(':').map(Number);
    return (min || 0) * 60 + (sec || 0);
  };

  const totalSeconds = parseDuration(cancionActual?.duracion);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (totalSeconds === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.floor((clickX / width) * totalSeconds);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      toggleMute();
    } else if (isMuted) {
      toggleMute();
    }
  };

  return (
    <footer className="player-bar">
      <div className="now-playing">
        <Link to={cancionActual ? `/cancion/${cancionActual.id}` : '#'} style={{ textDecoration: 'none' }}>
          <div
            className="now-playing-cover"
            style={{
              backgroundImage: `url(${buildImageUrl(cancionActual?.album.portada)})`,
              backgroundSize: 'cover',
              width: '60px',
              height: '60px',
              borderRadius: '6px',
              marginRight: '15px',
              cursor: 'pointer',
            }}
          />
        </Link>
        <div className="now-playing-info">
          <h4>{cancionActual?.titulo || 'Nada reproduciendo'}</h4>
          <p>{cancionActual?.artista.nombre || ''}</p>
        </div>
        <button className="control-btn" id="heart">
          <span className="material-symbols-rounded">heart_plus</span>
        </button>
      </div>

      <div className="player-controls">
        <button className="control-btn" onClick={onPrev}>
          <span className="material-symbols-rounded">skip_previous</span>
        </button>
        <button className="control-btn" onClick={togglePlay}>
          <span className="material-symbols-rounded">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <button className="control-btn" onClick={onNext}>
          <span className="material-symbols-rounded">skip_next</span>
        </button>
      </div>

      <div className="volume-controls">
        <button className="control-btn" onClick={toggleMute}>
          <span className="material-symbols-rounded">
            {isMuted ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
          </span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      <div className="song-progress-bar">
        <span className="time current-time">{formatTime(currentTime)}</span>
        <div
          className="progress-container"
          onClick={handleProgressClick}
        >
          <div
            className="song-progress"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="progress-thumb"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
        <span className="time total-time">{cancionActual?.duracion || '0:00'}</span>
      </div>
    </footer>
  );
}

export default FooterComponent;