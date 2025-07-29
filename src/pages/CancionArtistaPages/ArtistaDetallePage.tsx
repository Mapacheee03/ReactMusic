import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { ApiMusica } from '../../services/api';
import type { Artista, Cancion } from '../../services/api';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [cancionActual, setCancionActual] = useState<Cancion | undefined>(undefined);
  const [indiceActual, setIndiceActual] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [artistasData, cancionesData] = await Promise.all([
          ApiMusica.getArtistas(),
          ApiMusica.getCanciones()
        ]);

        const found = artistasData.find(a => a.id === Number(id));
        setArtista(found || null);

        const filtradas = cancionesData
          .filter(c => c.artista?.id === Number(id))
          .map(c => ({
            ...c,
            audioUrl: c.audioUrl || `https://reactmusic-back.onrender.com/audios/${c.id}.mp3`,
          }));

        setCanciones(filtradas);

        if (filtradas.length > 0) {
          setCancionActual(filtradas[0]);
          setIndiceActual(0);
        }
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

  const handlePlay = (cancion: Cancion) => {
    const index = canciones.findIndex(c => c.id === cancion.id);
    if (index !== -1) reproducirCancion(index);
  };

  const handlePause = () => {
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
  const closeSidebar = () => { if (isMobile) setShowSidebar(false); };

  return (
    <div className={styles.container}>
      <NavbarComponent onToggleSidebar={toggleSidebar} />
      <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />
      <div className={styles.mainContent}>
        <div className={styles.albumSection}>
          {loading ? (
            <div className={styles.albumHeader}>
              <div className={styles.albumCoverSkeleton} />
              <div className={styles.albumDetails}>
                <div className={styles.artistBadgeSkeleton} />
                <div className={styles.albumTitleSkeleton} />
                <div className={styles.albumMetaSkeleton} />
              </div>
            </div>
          ) : artista ? (
            <div className={styles.albumHeader}>
              <div className={styles.albumCover}>
                <img src={buildImageUrl(artista.imagen)} alt={artista.nombre} className={styles.albumImage} />
              </div>
              <div className={styles.albumDetails}>
                <div className={styles.artistBadge}>
                  <div className={styles.verifiedIcon}></div>
                  Artista verificado
                </div>
                <h1 className={styles.albumTitle}>{artista.nombre}</h1>
                <div className={styles.albumMeta}>
                  {artista.genero} • {artista.nacionalidad}
                </div>
              </div>
            </div>
          ) : (
            <div>No se encontró el artista.</div>
          )}

          <div className={styles.trackList}>
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} className={styles.trackItemSkeleton}></div>
                ))
              : canciones.map((cancion, index) => (
                  <div
                    key={cancion.id}
                    className={styles.trackItem}
                    onClick={() => handlePlay(cancion)}
                  >
                    <div className={styles.trackNumber}>
                      <span>{index + 1}</span>
                    </div>
                    <div className={styles.trackInfo}>
                      <h3>{cancion.titulo}</h3>
                      <p>{cancion.album?.titulo}</p>
                    </div>
                    <div className={styles.trackDuration}>{cancion.duracion}</div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <FooterComponent
        cancionActual={cancionActual}
        onPlay={() => cancionActual && reproducirCancion(indiceActual)}
        onPause={handlePause}
        onNext={onNext}
        onPrev={onPrev}
        isPlaying={isPlaying}
      />

      <audio ref={audioRef} src={cancionActual?.audioUrl || undefined} />
    </div>
  );
};

export default ArtistaDetallePage;
