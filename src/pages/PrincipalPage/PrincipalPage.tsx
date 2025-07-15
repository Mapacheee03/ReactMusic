import { useEffect, useRef, useState } from 'react';
import styles from './PrincipalPage.module.css';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import { ApiMusica } from '../../services/api';
import { Link } from 'react-router-dom';
import type { Cancion, AlbumCompleto } from '../../services/api';

const BASE_URL = 'https://api-musica.netlify.app/';

function buildImageUrl(path?: string) {
    if (!path || path.trim() === '') return null;
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

    // Sidebar y móvil
    const [showSidebar, setShowSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        ApiMusica.getCanciones()
            .then(data => {
                // Aquí ajustamos audioUrl, usa la que tengas real o pon ejemplo
                const cancionesConAudio = data.map(c => ({
                    ...c,
                    audioUrl: c.audioUrl || `https://cdn.example.com/audio/${c.id}.mp3`,
                }));
                setCanciones(cancionesConAudio);
            })
            .catch(console.error);

        ApiMusica.getAlbumes()
            .then(setAlbumes)
            .catch(console.error);
    }, []);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowSidebar(true);
            } else {
                setShowSidebar(false);
            }
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (albumes.length === 0) return;

        const intervalo = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setIndiceHero(prev => (prev + 1) % albumes.length);
                setFade(true);
            }, 600);
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

    // Sidebar toggles
    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const closeSidebar = () => {
        if (isMobile) setShowSidebar(false);
    };


    return (
        <div className={styles.container}>
            <NavbarComponent onToggleSidebar={toggleSidebar} />
            <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />

            <div
                className={styles.mainContent}
                style={{
                    marginLeft: showSidebar && !isMobile ? '300px' : '0',
                    transition: 'margin-left 0.3s ease-in-out',
                }}
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
                                src={buildImageUrl(albumHero.portada) || undefined}
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

                            <div className={styles.newReleaseLabel} style={{ position: 'relative', zIndex: 1 }}>
                                New Releases!
                            </div>
                            <div className={styles.heroContainer} style={{ position: 'relative', zIndex: 1 }}>
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
                        <div className={styles.heroSkeleton}>
                            <div className={styles.heroImageSkeleton} />
                            <div className={styles.heroTextSkeleton} />
                            <div className={styles.heroButtonSkeleton} />
                        </div>
                    )}

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Albums Recientes</h3>
                        {albumes.length > 0 ? (
                            <div className={styles.albumsGrid}>
                                {albumes.map(album => (
                                    <Link
                                        key={album.id}
                                        to={`/album/${album.id}`}
                                        className={styles.albumCard}
                                    >
                                        <img
                                            src={buildImageUrl(album.portada) || undefined}
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
                        ) : (
                            <div className={styles.albumsGrid}>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={styles.albumCardSkeleton}>
                                        <div className={styles.albumImageSkeleton} />
                                        <div className={styles.albumInfoSkeleton}>
                                            <div className={styles.textLineSkeleton} />
                                            <div className={styles.textLineSkeleton} />
                                            <div className={styles.textLineSkeleton} />
                                            <div className={styles.textLineSkeletonShort} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>MUSIC</h3>
                        {canciones.length > 0 ? (
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
                                            src={buildImageUrl(cancion.albumCompleto?.portada) || undefined}
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
                        ) : (
                            <ul className={styles.trackList}>
                                {[...Array(5)].map((_, i) => (
                                    <li key={i} className={styles.trackItemSkeleton}>
                                        <div className={styles.trackNumberSkeleton} />
                                        <div className={styles.trackImageSkeleton} />
                                        <div className={styles.trackInfoSkeleton}>
                                            <div className={styles.textLineSkeleton} />
                                            <div className={styles.textLineSkeletonShort} />
                                        </div>
                                        <div className={styles.trackDurationSkeleton} />
                                    </li>
                                ))}
                            </ul>
                        )}
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
