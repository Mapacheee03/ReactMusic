import styles from './AlbumPage.module.css';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiMusica } from '../../services/api';
import type { Album, Cancion } from '../../services/api';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';

const BASE_URL = 'http://localhost:3001/';

function buildImageUrl(path?: string) {
    if (!path || path.trim() === '') return '';
    const safePath = path.startsWith('/') ? path.slice(1) : path;
    const encodedPath = safePath
        .split('/')
        .map(segment => encodeURIComponent(segment).replace(/'/g, '%27'))
        .join('/');
    return `${BASE_URL}${encodedPath}`;
}

function AlbumPage() {
    const { albumId } = useParams();
    const [album, setAlbum] = useState<Album | null>(null);
    const [canciones, setCanciones] = useState<Cancion[]>([]);
    const [cancionActual, setCancionActual] = useState<Cancion | undefined>();
    const [indiceActual, setIndiceActual] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [showSidebar, setShowSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (albumId) {
            setIsLoading(true);
            Promise.all([
                ApiMusica.getAlbumes(),
                ApiMusica.getCanciones()
            ])
                .then(([albumes, cancionesApi]) => {
                    const encontrado = albumes.find(a => a.id === parseInt(albumId));
                    setAlbum(encontrado || null);

                    // Filtra canciones por album.id, no albumCompleto
                    const filtradas = cancionesApi.filter(c => c.album?.id === parseInt(albumId));
                    // Asegurar que audioUrl tenga algo, si no viene poner un placeholder o vacío
                    const cancionesConAudio = filtradas.map(c => ({
                        ...c,
                        audioUrl: c.audioUrl || `https://cdn.example.com/audio/${c.id}.mp3`,
                    }));
                    setCanciones(cancionesConAudio);

                    if (cancionesConAudio.length > 0) {
                        setCancionActual(cancionesConAudio[0]);
                        setIndiceActual(0);
                    }
                })
                .finally(() => setIsLoading(false));
        }
    }, [albumId]);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setShowSidebar(!mobile);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

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

    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const closeSidebar = () => {
        if (isMobile) setShowSidebar(false);
    };

    return (
        <div className={styles.container}>
            <NavbarComponent onToggleSidebar={toggleSidebar} />
            <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />

            <div className={styles.mainContent}>
                <div className={styles.albumSection}>
                    {/* Header del Álbum */}
                    {isLoading || !album ? (
                        <div className={styles.albumHeaderSkeleton}>
                            <div className={styles.albumCoverSkeleton} />
                            <div className={styles.albumDetailsSkeleton}>
                                <div className={styles.textLineSkeleton} />
                                <div className={styles.textLineSkeletonShort} />
                                <div className={styles.textLineSkeletonShort} />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.albumHeader}>
                            <div
                                className={styles.albumCover}
                                style={{
                                    backgroundImage: `url(${buildImageUrl(album.portada)})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '8px'
                                }}
                            />
                            <div className={styles.albumDetails}>
                                <div className={styles.artistBadge}>
                                    <div className={styles.verifiedIcon}></div>
                                    <span>{album.productor}</span>
                                </div>
                                <h1 className={styles.albumTitle}>{album.titulo}</h1>
                                <div className={styles.albumMeta}>
                                    <div>Álbum • {album.añoLanzamiento}</div>
                                    <div>{album.numeroTracks} canciones • {album.duracionTotal}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de canciones */}
                    <div className={styles.trackList}>
                        {isLoading
                            ? [...Array(6)].map((_, i) => (
                                <div key={i} className={styles.trackItemSkeleton}>
                                    <div className={styles.trackNumberSkeleton} />
                                    <div className={styles.trackInfoSkeleton}>
                                        <div className={styles.textLineSkeleton} />
                                        <div className={styles.textLineSkeletonShort} />
                                    </div>
                                    <div className={styles.trackDurationSkeleton} />
                                </div>
                            ))
                            : canciones.map((cancion, i) => (
                                <div
                                    className={styles.trackItem}
                                    key={cancion.id}
                                    onClick={() => reproducirCancion(i)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={styles.trackNumber}>
                                        <span>{i + 1}</span>
                                        <i className={`fas fa-play ${styles.trackPlayBtn}`}></i>
                                    </div>
                                    <div className={styles.trackInfo}>
                                        <h3>{cancion.titulo}</h3>
                                        {/* Mostrar nombre del artista, no artistaCompleto */}
                                        <p>{cancion.artista?.nombre}</p>
                                    </div>
                                    <div className={styles.trackDuration}>{cancion.duracion}</div>
                                </div>
                            ))
                        }
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

export default AlbumPage;
