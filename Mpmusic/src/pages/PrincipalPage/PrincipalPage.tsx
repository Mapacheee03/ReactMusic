import { useEffect, useRef, useState } from 'react';
import styles from './PrincipalPage.module.css';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { ApiMusica } from '../../services/api';
import { Link } from 'react-router-dom';
import type { Cancion, AlbumCompleto } from '../../services/api';

const BASE_URL = 'https://api-musica.netlify.app/';

function buildImageUrl(path?: string) {
    if (!path || path.trim() === '') return '';
    const safePath = path.startsWith('/') ? path.slice(1) : path;
    const encodedPath = safePath
        .split('/')
        .map(segment => encodeURIComponent(segment).replace(/'/g, '%27'))
        .join('/');
    return `${BASE_URL}${encodedPath}`;
}

function PrincipalPage() {
    const [canciones, setCanciones] = useState<Cancion[]>([]);
    const [albumes, setAlbumes] = useState<AlbumCompleto[]>([]);
    const [cancionActual, setCancionActual] = useState<Cancion | undefined>(undefined);
    const [indiceActual, setIndiceActual] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [indiceHero, setIndiceHero] = useState<number>(0);
    const [fade, setFade] = useState<boolean>(true);

    useEffect(() => {
        ApiMusica.getCanciones()
            .then(data => {
                const cancionesConAudio = data.map(c => ({
                    ...c,
                    audioUrl: '', // Pon aquí la URL real si la tienes
                }));
                setCanciones(cancionesConAudio);
            })
            .catch(console.error);

        ApiMusica.getAlbumes()
            .then(setAlbumes)
            .catch(console.error);
    }, []);

    // Manejo del carrusel con fade in/out cada 5s
    useEffect(() => {
        if (albumes.length === 0) return;

        const intervalo = setInterval(() => {
            setFade(false); // inicia fade out

            setTimeout(() => {
                setIndiceHero(prev => (prev + 1) % albumes.length);
                setFade(true); // fade in
            }, 600); // duración del fade out (un poco más que el CSS 0.6s)
        }, 5000);

        return () => clearInterval(intervalo);
    }, [albumes]);

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
    }, [indiceActual, canciones]);

    const albumHero = albumes[indiceHero];

    return (
        <div className={styles.container}>
            <SideBarComponent />
            <div
                className={styles.mainContent}
             
            >
                <div className={styles.heroSection}>
                    {albumHero ? (
                        <div
                            className={styles.newRelease}
                            style={{
                                minHeight: '300px',
                                borderRadius: '8px',
                                opacity: fade ? 1 : 0,
                                transition: 'opacity 0.6s ease-in-out',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={buildImageUrl(albumHero.portada)}
                                alt={albumHero.titulo}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 0,
                                    opacity: fade ? 1 : 0,
                                    transition: 'opacity 0.6s ease-in-out',
                                }}
                            />

                            <div
                                className={styles.newReleaseLabel}
                                style={{ position: 'relative', zIndex: 1 }}
                            >
                                New Releases!
                            </div>
                            <div
                                className={styles.heroContainer}
                                style={{ position: 'relative', zIndex: 1 }}
                            >
                                <div
                                    className={styles.heroText}
                                    style={{
                                        opacity: fade ? 1 : 0,
                                        transition: 'opacity 0.6s ease-in-out',
                                    }}
                                >
                                    <h2>{albumHero.titulo}</h2>
                                    <button
                                        className={styles.playButton}
                                        onClick={() => {
                                            const indiceCancion = canciones.findIndex(
                                                c => c.albumCompleto?.id === albumHero.id
                                            );
                                            if (indiceCancion !== -1) reproducirCancion(indiceCancion);
                                        }}
                                    >
                                        Play Now!
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>Cargando álbumes...</div>
                    )}

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Albums Recientes</h3>
                        <div className={styles.albumsGrid}>
                            {albumes.map(album => (
                                <Link
                                    key={album.id}
                                    to={`/album/${album.id}`}
                                    className={styles.albumCard}
                                >
                                    <img
                                        src={buildImageUrl(album.portada)}
                                        alt={album.titulo}
                                        style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                                    />
                                    <div className={styles.albumInfo}>
                                        <h3>{album.titulo}</h3>
                                        <p>{album.añoLanzamiento}</p>
                                        <p>{album.numeroTracks} canciones</p>
                                        <p>- {album.sello} -</p>
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
                                    <span className={styles.trackNumber}>{index + 1}</span>
                                    <img
                                        src={buildImageUrl(cancion.albumCompleto?.portada)}
                                        alt={cancion.artistaCompleto.nombre}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            objectFit: 'cover',
                                            borderRadius: 4,
                                        }}
                                    />
                                    <div className={styles.trackInfo}>
                                        <div className={styles.trackName}>{cancion.titulo}</div>
                                        <div className={styles.trackArtist}>
                                            {cancion.artistaCompleto.nombre}
                                        </div>
                                    </div>
                                    <div className={styles.trackActions}>
                                        <i className="fas fa-play"></i>
                                        <span className={styles.trackDuration}>
                                            {cancion.duracion}
                                        </span>
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

            <audio ref={audioRef} src={cancionActual?.audioUrl || undefined} />
        </div>
    );
}

export default PrincipalPage;
