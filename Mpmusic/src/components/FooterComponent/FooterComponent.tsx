import './FooterComponent.css';
import type { Cancion } from '../../services/api';

interface FooterProps {
    cancionActual?: Cancion;
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    isPlaying: boolean;
}

function FooterComponent({ cancionActual, onPlay, onPause, onNext, onPrev, isPlaying }: FooterProps) {
    return (
        <footer className="player-bar">
            <div className="now-playing">
                <div
                    className="now-playing-cover"
                    style={{
                        backgroundImage: `url(${cancionActual?.albumCompleto.portada || ''})`,
                        backgroundSize: 'cover',
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        marginRight: '15px',
                    }}
                ></div>
                <div className="now-playing-info">
                    <h4>{cancionActual?.titulo || 'Nada reproduciendo'}</h4>
                    <p>{cancionActual?.artistaCompleto.nombre || ''}</p>
                </div>
                <button className="control-btn" id="heart">
                    <span className="material-symbols-rounded">heart_plus</span>
                </button>
            </div>

            <div className="player-controls">
                <button className="control-btn" onClick={onPrev}>
                    <span className="material-symbols-rounded">skip_previous</span>
                </button>
                <button className="control-btn" onClick={isPlaying ? onPause : onPlay}>
                    <span className="material-symbols-rounded">
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </button>
                <button className="control-btn" onClick={onNext}>
                    <span className="material-symbols-rounded">skip_next</span>
                </button>
            </div>
            <div className="volume-controls">
                <button className="control-btn">
                    <span className="material-symbols-rounded">volume_up</span>
                </button>
                <div className="volume-slider">
                    <div className="volume-progress"></div>
                </div>
            </div>
            <div className="song-progress-bar">
                <span className="time current-time">0:00</span>
                <div className="progress-container">
                    <div className="song-progress"></div>
                </div>
                <span className="time total-time">{cancionActual?.duracion || '0:00'}</span>
            </div>


        </footer>
    );
}

export default FooterComponent;
