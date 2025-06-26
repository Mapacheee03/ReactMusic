import { useEffect, useRef, useState } from 'react';
import styles from './PrincipalPage.module.css';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { ApiMusica } from '../../services/api';
import { Link } from 'react-router-dom';
import type { Cancion, AlbumResumen } from '../../services/api';
import SearchComponent from '../../components/SearchComponent/SearchComponent';

function PrincipalPage() {
    const [canciones, setCanciones] = useState<Cancion[]>([]);
    const [albumes, setAlbumes] = useState<AlbumResumen[]>([]);
    const [cancionActual, setCancionActual] = useState<Cancion | undefined>(undefined);
    const [indiceActual, setIndiceActual] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        ApiMusica.getCanciones()
            .then(data => {
                const cancionesConAudio = data.map(c => ({
                    ...c,
                    audioUrl: '' // reemplaza con URL real cuando tengas
                }));
                setCanciones(cancionesConAudio);
            })
            .catch(console.error);

        ApiMusica.getAlbumesResumen()
            .then(setAlbumes)
            .catch(console.error);
    }, []);

    // Reproducir canción por índice
    const reproducirCancion = (index: number) => {
        const cancion = canciones[index];
        if (!cancion) return;
        setCancionActual(cancion);
        setIndiceActual(index);
        setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
        }, 100);
    };

    const onPlay = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const onPause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const onNext = () => {
        if (canciones.length === 0) return;
        const nextIndex = (indiceActual + 1) % canciones.length;
        reproducirCancion(nextIndex);
    };

    const onPrev = () => {
        if (canciones.length === 0) return;
        const prevIndex = (indiceActual - 1 + canciones.length) % canciones.length;
        reproducirCancion(prevIndex);
    };

    // Mantener isPlaying sincronizado con el audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => onNext();

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onNext]);

    return (
        <div className={styles.container}>
            <SideBarComponent />
            <div className={styles.mainContent}>
                <SearchComponent />
                <div className={styles.heroSection}>
                    <div className={styles.newRelease}>
                        <div className={styles.newReleaseLabel}>New Releases!</div>
                        <div className={styles.heroContainer}>
                            <div className={styles.heroText}>
                                <h2>Light Downs Low MAX</h2>
                                <button className={styles.playButton}>Play Now!</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Albums Recientes</h3>
                        <div className={styles.albumsGrid}>
                            {albumes.map(album => (
                                <Link key={album.id} to={`/album/${album.id}`} className={styles.albumCard}>
                                    <div
                                        className={styles.albumCover}
                                        style={{ backgroundImage: `url(${album.portada})` }}
                                    ></div>
                                    <div className={styles.albumInfo}>
                                        <h3>{album.titulo}</h3>
                                        <p>{album.artista} · {album.añoLanzamiento}</p>
                                        <p>{album.numeroCanciones} canciones</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>MUSIC</h3>
                        <ul className={styles.trackList}>
                            {canciones.map((cancion, index) => (
                                <li
                                    key={cancion.id}
                                    className={styles.trackItem}
                                    onClick={() => reproducirCancion(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className={styles.trackNumber}>{cancion.id}</span>
                                    <div
                                        className={styles.trackCover}
                                        style={{ backgroundImage: `url(${cancion.albumCompleto.portada})` }}
                                    ></div>
                                    <div className={styles.trackInfo}>
                                        <div className={styles.trackName}>{cancion.titulo}</div>
                                        <div className={styles.trackArtist}>{cancion.artistaCompleto.nombre}</div>
                                    </div>
                                    <div className={styles.trackActions}>
                                        <i className="fas fa-play"></i>
                                        <span className={styles.trackDuration}>{cancion.duracion}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <FooterComponent
                cancionActual={cancionActual}
                onPlay={onPlay}
                onPause={onPause}
                onNext={onNext}
                onPrev={onPrev}
                isPlaying={isPlaying}
            />

            <audio ref={audioRef} src={cancionActual?.audioUrl} />
        </div>
    );
}

export default PrincipalPage;
