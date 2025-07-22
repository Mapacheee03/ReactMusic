import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import styles from './CancionPage.module.css';
import type { Cancion } from '../../services/api';
import { ApiMusica } from '../../services/api';

import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { FaArrowLeft } from 'react-icons/fa';

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

const CancionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cancion, setCancion] = useState<Cancion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCancion = async () => {
      try {
        const canciones = await ApiMusica.getCanciones();
        const encontrada = canciones.find(c => c.id === Number(id));
        setCancion(encontrada ?? null);
      } catch (error) {
        console.error('Error al cargar la canción:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancion();
  }, [id]);

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

  const onPlay = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const onPause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const onNext = () => {};
  const onPrev = () => {};

  const toggleSidebar = () => setShowSidebar(prev => !prev);
  const closeSidebar = () => {
    if (isMobile) setShowSidebar(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <NavbarComponent onToggleSidebar={toggleSidebar} />
        <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />

        <main
          className={styles.main}
          style={{
            marginLeft: showSidebar && !isMobile ? '300px' : '0',
            transition: 'margin-left 0.3s ease-in-out',
          }}
        >
        

          <section className={styles.songDetailCard}>
            <div className={styles.coverContainer}>
              <div className={styles.skeletonCover}></div>
            </div>

            <div className={styles.songInfo}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonSubtitle}></div>
              <div className={styles.skeletonSubtitle}></div>

              <div className={styles.metadata}>
                <div className={styles.skeletonMetadata}></div>
                <div className={styles.skeletonMetadata}></div>
              </div>

              <div className={styles.skeletonAudio}></div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!cancion) return <div className={styles.error}>Canción no encontrada</div>;

  return (
    <div className={styles.container}>
      <NavbarComponent onToggleSidebar={toggleSidebar} />
      <SideBarComponent showSidebar={showSidebar} onCloseSidebar={closeSidebar} />

      <main
        className={styles.main}
        style={{
          marginLeft: showSidebar && !isMobile ? '300px' : '0',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Volver
        </button>

        <section className={styles.songDetailCard}>
          <div className={styles.coverContainer}>
            <img
              src={buildImageUrl(cancion.albumCompleto.portada) || undefined}
              alt={cancion.albumCompleto.titulo}
              className={styles.coverImage}
            />
          </div>

          <div className={styles.songInfo}>
            <h1 className={styles.songTitle}>{cancion.titulo}</h1>
            <h3 className={styles.artistName}>{cancion.artistaCompleto.nombre}</h3>
            <h4 className={styles.albumName}>Álbum: {cancion.albumCompleto.titulo}</h4>

            <div className={styles.metadata}>
              <p><strong>Año:</strong> {cancion.año}</p>
              <p><strong>Duración:</strong> {cancion.duracion}</p>
            </div>

            {cancion.audioUrl ? (
              <audio
                controls
                ref={audioRef}
                className={styles.audioPlayer}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={cancion.audioUrl} type="audio/mp3" />
                Tu navegador no soporta audio.
              </audio>
            ) : (
              <p className={styles.noAudio}>Audio no disponible.</p>
            )}
          </div>
        </section>
      </main>

      <FooterComponent
        cancionActual={cancion}
        onPlay={onPlay}
        onPause={onPause}
        onNext={onNext}
        onPrev={onPrev}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default CancionPage;
