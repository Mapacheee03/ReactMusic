import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiMusica } from '../../services/api';
import type { Album, Cancion } from '../../services/api';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import { usePlayer } from '../../context/PlayerContext';
import styles from './AlbumPage.module.css';

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

function AlbumPage() {
    const { albumId } = useParams();
    const [album, setAlbum] = useState<Album | null>(null);
    const [canciones, setCanciones] = useState<Cancion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    const { play } = usePlayer();

    useEffect(() => {
        if (!albumId) return;

        setIsLoading(true);

        const fetchData = async () => {
            try {
                const [albumes, cancionesApi] = await Promise.all([
                    ApiMusica.getAlbumes(),
                    ApiMusica.getCanciones()
                ]);

                const encontrado = albumes.find(a => a.id === parseInt(albumId));
                setAlbum(encontrado || null);

                const filtradas = cancionesApi
                    .filter(c => c.album?.id === parseInt(albumId))
                    .map(c => ({
                        ...c,
                        audioUrl: c.audioUrl || `https://reactmusic-back.onrender.com/audios/${c.id}.mp3`,
                    }));

                setCanciones(filtradas);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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

    const handlePlayCancion = (index: number) => {
        if (canciones[index]) {
            play(canciones[index], canciones, index);
        }
    };

    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const closeSidebar = () => {
        if (isMobile) setShowSidebar(false);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <NavbarComponent onToggleSidebar={toggleSidebar} />
                <div className={styles.mainContent}>
                    <div className={styles.albumSection}>
                        <div className={styles.albumHeaderSkeleton}>
                            <div className={styles.albumCoverSkeleton} />
                            <div className={styles.albumDetailsSkeleton}>
                                <div className={styles.textLineSkeleton} />
                                <div className={styles.textLineSkeletonShort} />
                                <div className={styles.textLineSkeletonShort} />
                            </div>
                        </div>
                        <div className={styles.trackList}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={styles.trackItemSkeleton}>
                                    <div className={styles.trackNumberSkeleton} />
                                    <div className={styles.trackInfoSkeleton}>
                                        <div className={styles.textLineSkeleton} />
                                        <div className={styles.textLineSkeletonShort} />
                                    </div>
                                    <div className={styles.trackDurationSkeleton} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }

    if (!album) {
        return (
            <div className={styles.container}>
                <NavbarComponent onToggleSidebar={toggleSidebar} />
                <div className={styles.mainContent}>
                    <div className={styles.notFound}>
                        <h2>Álbum no encontrado</h2>
                        <p>El álbum que buscas no está disponible</p>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <NavbarComponent onToggleSidebar={toggleSidebar} />
            <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />

            <div className={styles.mainContent}>
                <div className={styles.albumSection}>
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
                            <div className={styles.albumDescription}>
                                {album.descripcion || 'Descripción no disponible'}
                            </div>
                        </div>
                    </div>

                    <div className={styles.trackList}>
                        <h2 className={styles.sectionTitle}>Lista de canciones</h2>
                        {canciones.length > 0 ? (
                            canciones.map((cancion, i) => (
                                <div
                                    className={styles.trackItem}
                                    key={cancion.id}
                                    onClick={() => handlePlayCancion(i)}
                                >
                                    <div className={styles.trackNumber}>
                                        <span>{i + 1}</span>
                                        <i className={`fas fa-play ${styles.trackPlayBtn}`}></i>
                                    </div>
                                    <div className={styles.trackInfo}>
                                        <h3>{cancion.titulo}</h3>
                                        <p>{cancion.artista?.nombre}</p>
                                    </div>
                                    <div className={styles.trackDuration}>{cancion.duracion}</div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noTracks}>
                                <p>Este álbum no contiene canciones</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FooterComponent />
        </div>
    );
}

export default AlbumPage;