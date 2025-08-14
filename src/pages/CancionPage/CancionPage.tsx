import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './CancionPage.module.css';
import type { Cancion } from '../../services/api';
import { ApiMusica } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { FaArrowLeft } from 'react-icons/fa';

const BASE_URL = 'https://reactmusic-back.onrender.com/';

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
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const { play, isPlaying } = usePlayer();

  useEffect(() => {
    if (!id) return;

    const fetchCancion = async () => {
      try {
        const canciones = await ApiMusica.getCanciones();
        const encontrada = canciones.find(c => c.id === Number(id));

        if (encontrada) {
          const cancionConAudio: Cancion = {
            ...encontrada,
            audioUrl: encontrada.audioUrl || `${BASE_URL}audios/${encontrada.id}.mp3`,
          };
          setCancion(cancionConAudio);
          // Reproducir automáticamente al cargar
          play(cancionConAudio, [cancionConAudio], 0);
        } else {
          setCancion(null);
        }
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
        <FooterComponent />
      </div>
    );
  }

  if (!cancion) {
    return (
      <div className={styles.container}>
        <NavbarComponent onToggleSidebar={toggleSidebar} />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <h2>Canción no encontrada</h2>
            <p>La canción que buscas no está disponible</p>
            <button 
              className={styles.backButton} 
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Volver
            </button>
          </div>
        </main>
        <FooterComponent />
      </div>
    );
  }

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
              src={buildImageUrl(cancion.album?.portada) || '/default-album.jpg'}
              alt={cancion.album?.titulo || 'Portada del álbum'}
              className={styles.coverImage}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-album.jpg';
              }}
            />
          </div>

          <div className={styles.songInfo}>
            <h1 className={styles.songTitle}>{cancion.titulo}</h1>
            <h3 className={styles.artistName}>{cancion.artista?.nombre || 'Artista desconocido'}</h3>
            <h4 className={styles.albumName}>Álbum: {cancion.album?.titulo || 'Sin álbum'}</h4>

            <div className={styles.metadata}>
              <p><strong>Año:</strong> {cancion.año || 'Desconocido'}</p>
              <p><strong>Duración:</strong> {cancion.duracion || '--:--'}</p>
              {cancion.compositor && <p><strong>Compositor:</strong> {cancion.compositor}</p>}
            </div>

            {cancion.letra && (
              <div className={styles.lyricsSection}>
                <h3>Letra</h3>
                <div className={styles.lyricsContent}>
                  {cancion.letra.split('\n').map((line, i) => (
                    <p key={i}>{line || <br />}</p>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.audioContainer}>
              <audio
                controls
                className={styles.audioPlayer}
                src={cancion.audioUrl}
                // Manejar la reproducción cuando el usuario interactúa directamente con el reproductor
                onPlay={() => play(cancion, [cancion], 0)}
              >
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
};

export default CancionPage;