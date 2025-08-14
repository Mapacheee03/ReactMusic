import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import styles from './ArtistasPages.module.css';
import { ApiMusica } from '../../services/api';
import type { Artista } from '../../services/api';

const BASE_URL = 'https://reactmusic-back.onrender.com/';

function buildImageUrl(path?: string) {
  if (!path || path.trim() === '') return '';
  const safePath = path.startsWith('/') ? path.slice(1) : path;
  const encodedPath = safePath.split('/').map(encodeURIComponent).join('/');
  return `${BASE_URL}${encodedPath}`;
}

function ArtistasPages() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
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
      setShowSidebar(!mobile);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
        <div className={styles.artistList}>
          <h1 className={styles.h1}>Artistas</h1>
          {artistas.map(artista => (
            <Link 
              to={`/artista/${artista.id}`} 
              className={styles.link} 
              key={artista.id}
            >
              <div className={styles.artistItem}>
                <div className={styles.avatarContainer}>
                  <img
                    src={buildImageUrl(artista.imagen)}
                    alt={artista.nombre}
                    className={styles.avatar}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
                <div className={styles.artistInfo}>
                  <h3 className={styles.artistName}>
                    {artista.nombre}
                  </h3>
                  <p className={styles.artistDetails}>
                    {artista.genero} – {artista.nacionalidad}
                  </p>
                  <p className={styles.artistBio}>
                    {artista.biografia}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}

export default ArtistasPages;