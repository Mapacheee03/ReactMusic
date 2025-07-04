import { useEffect, useRef, useState } from 'react';
import styles from './PrincipalPage.module.css';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { ApiMusica } from '../../services/api';
import { Link } from 'react-router-dom';
import type { Cancion, AlbumResumen } from '../../services/api';

function PrincipalPage() {
    const [canciones, setCanciones] = useState<Cancion[]>([]);
    const [albumes, setAlbumes] = useState<AlbumResumen[]>([]);
    const [cancionActual, setCancionActual] = useState<Cancion | undefined>(undefined);
    const [indiceActual, setIndiceActual] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Estado para el carrusel hero
    const [indiceHero, setIndiceHero] = useState<number>(0);

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

    // Cambio automático del hero cada 5 segundos
    useEffect(() => {
        if (albumes.length === 0) return;

        const intervalo = setInterval(() => {
            setIndiceHero(prev => (prev + 1) % albumes.length);
        }, 5000); // 5000 ms = 5 segundos

        return () => clearInterval(intervalo);
    }, [albumes]);

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

    // Obtenemos el álbum actual para el hero
    const albumHero = albumes[indiceHero];

    return (
        <div className={styles.container}>
            <SideBarComponent />
            <div className={styles.mainContent}>
                <div className={styles.heroSection}>
                    {albumHero ? (
                        <div className={styles.newRelease}
                            style={{
                                backgroundImage: albumHero.portada
                                    ? `url(${albumHero.portada})`
                                    : ` url('/src/assets/Frame 1.png')`,
                            }}
                       >
                            <div className={styles.newReleaseLabel}>New Releases!</div>
                            <div className={styles.heroContainer}>
                                <div className={styles.heroText}>
                                    <h2>{albumHero.titulo}</h2>
                                    <button
                                        className={styles.playButton}
                                        onClick={() => {
                                            // Buscar canción del álbum para reproducir
                                            const indiceCancion = canciones.findIndex(c => c.albumCompleto?.id === albumHero.id);
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

                    {/* Resto de secciones (Albums Recientes, Música) sin cambios */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Albums Recientes</h3>
                        <div className={styles.albumsGrid}>
                            {albumes.map(album => (
                                <Link key={album.id} to={`/album/${album.id}`} className={styles.albumCard}>
                                    <div
                                        className={styles.albumCover}
                                        style={album.portada && album.portada.length < 0
                                            ? { backgroundImage: `url(${album.portada})` }
                                            : {}}
                                    ></div>
                                    <div className={styles.albumInfo}>
                                        <h3>{album.titulo}</h3>
                                        <p>{album.artista} · {album.añoLanzamiento}</p>
                                        <p>{album.numeroCanciones} canciones</p>
                                        <p></p>
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
                                    <div
                                        className={styles.trackCover}
                                        style={cancion.albumCompleto?.imagen
                                            ? { backgroundImage: `url(${cancion.albumCompleto.imagen})` }
                                            : {}}
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

            <audio ref={audioRef} src={cancionActual?.audioUrl || undefined} />
        </div>
    );
}

export default PrincipalPage;
