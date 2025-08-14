import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { ApiMusica } from '../../services/api';
import type { Artista, Cancion } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import styles from './ArtistaDetallePage.module.css';

const BASE_URL = 'https://reactmusic-back.onrender.com/';

function buildImageUrl(path?: string) {
  if (!path || path.trim() === '') return '';
  const safePath = path.startsWith('/') ? path.slice(1) : path;
  const encodedPath = safePath.split('/').map(encodeURIComponent).join('/');
  return `${BASE_URL}${encodedPath}`;
}

const ArtistaDetallePage = () => {
  const { id } = useParams();
  const [artista, setArtista] = useState<Artista | null>(null);
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { play } = usePlayer();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [artistasData, cancionesData] = await Promise.all([
          ApiMusica.getArtistas(),
          ApiMusica.getCanciones()
        ]);

        const foundArtista = artistasData.find(a => a.id === Number(id));
        setArtista(foundArtista || null);

        const cancionesArtista = cancionesData
          .filter(c => c.artista?.id === Number(id))
          .map(c => ({
            ...c,
            audioUrl: c.audioUrl || `https://reactmusic-back.onrender.com/audios/${c.id}.mp3`,
          }));

        setCanciones(cancionesArtista);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  if (loading) {
    return (
      <div className={styles.container}>
        <NavbarComponent onToggleSidebar={toggleSidebar} />
        <div className={styles.mainContent}>
          <div className={styles.albumSection}>
            <div className={styles.albumHeader}>
              <div className={styles.albumCoverSkeleton} />
              <div className={styles.albumDetails}>
                <div className={styles.artistBadgeSkeleton} />
                <div className={styles.albumTitleSkeleton} />
                <div className={styles.albumMetaSkeleton} />
              </div>
            </div>
            <div className={styles.trackList}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className={styles.trackItemSkeleton}></div>
              ))}
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  }

  if (!artista) {
    return (
      <div className={styles.container}>
        <NavbarComponent onToggleSidebar={toggleSidebar} />
        <div className={styles.mainContent}>
          <div className={styles.notFound}>
            <h2>Artista no encontrado</h2>
            <p>El artista que buscas no está disponible</p>
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
            <div className={styles.albumCover}>
              <img 
                src={buildImageUrl(artista.imagen)} 
                alt={artista.nombre} 
                className={styles.albumImage} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-artist.jpg';
                }}
              />
            </div>
            <div className={styles.albumDetails}>
              <div className={styles.artistBadge}>
                <div className={styles.verifiedIcon}></div>
                Artista verificado
              </div>
              <h1 className={styles.albumTitle}>{artista.nombre}</h1>
              <div className={styles.albumMeta}>
                <span className={styles.genre}>{artista.genero}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.country}>{artista.nacionalidad}</span>
              </div>
              <div className={styles.bio}>{artista.biografia}</div>
            </div>
          </div>

          <div className={styles.trackList}>
            <h2 className={styles.sectionTitle}>Canciones</h2>
            {canciones.length > 0 ? (
              canciones.map((cancion, index) => (
                <div
                  key={cancion.id}
                  className={styles.trackItem}
                  onClick={() => handlePlayCancion(index)}
                >
                  <div className={styles.trackNumber}>
                    <span>{index + 1}</span>
                  </div>
                  <div className={styles.trackInfo}>
                    <h3>{cancion.titulo}</h3>
                    <p>{cancion.album?.titulo || 'Sin álbum'}</p>
                  </div>
                  <div className={styles.trackDuration}>{cancion.duracion}</div>
                </div>
              ))
            ) : (
              <div className={styles.noSongs}>
                <p>Este artista no tiene canciones disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default ArtistaDetallePage;