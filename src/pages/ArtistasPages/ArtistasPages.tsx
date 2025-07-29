import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 👉 IMPORTANTE
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import styles from './ArtistasPages.module.css';
import { ApiMusica } from '../../services/api';
import type { Artista, Cancion } from '../../services/api';

const BASE_URL = 'http://localhost:3001/';

function buildImageUrl(path?: string) {
    if (!path || path.trim() === '') return '';
    const safePath = path.startsWith('/') ? path.slice(1) : path;
    const encodedPath = safePath.split('/').map(encodeURIComponent).join('/');
    return `${BASE_URL}${encodedPath}`;
}

function ArtistasPages() {
    const [artistas, setArtistas] = useState<Artista[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [cancionActual] = useState<Cancion | undefined>(undefined);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        ApiMusica.getArtistas()
            .then(setArtistas)
            .catch(error => console.error('Error al cargar artistas:', error));
    }, []);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setShowSidebar(!mobile); // Mostrar u ocultar sidebar
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleNext = () => console.log('Siguiente canción');
    const handlePrev = () => console.log('Canción anterior');
    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const closeSidebar = () => { if (isMobile) setShowSidebar(false); };

    return (
        <div className={styles.container}>
            <NavbarComponent onToggleSidebar={toggleSidebar} />
            <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />

            <div className={styles.mainContent}>
                <div className={styles.artistList}>
                    <h1 className={styles.h1}>Artistas</h1>
                    {artistas.map(artista => (
                        <div className={styles.artistItem} key={artista.id}>
                            <div className={styles.avatarContainer}>
                                <img
                                    src={buildImageUrl(artista.imagen)}
                                    alt={artista.nombre}
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.artistInfo}>
                                <h3 className={styles.artistName}>
                                    {/* 👇 Enlace al detalle del artista */}
                                    <Link to={`/artista/${artista.id}`} className={styles.link}>
                                        {artista.nombre}
                                    </Link>
                                </h3>
                                <p className={styles.songCount}>
                                    {artista.genero} – {artista.nacionalidad}
                                </p>
                                <p className={styles.songCount}>
                                    {artista.biografia}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FooterComponent
                cancionActual={cancionActual}
                onPlay={handlePlay}
                onPause={handlePause}
                onNext={handleNext}
                onPrev={handlePrev}
                isPlaying={isPlaying}
            />
        </div>
    );
}

export default ArtistasPages;
