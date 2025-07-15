import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiMusica } from '../../services/api';
import styles from './SideBarComponent.module.css';

interface SideBarProps {
  showSidebar: boolean;
  onCloseSidebar: () => void;
}

function SideBarComponent({ showSidebar, onCloseSidebar }: SideBarProps) {
  const [generos, setGeneros] = useState<string[]>([]);

  useEffect(() => {
    ApiMusica.getGenero()
      .then(setGeneros)
      .catch(console.error);
  }, []);

  const handleClickLink = () => {
    if (showSidebar) onCloseSidebar();
  };

  return (
    <div className={`${styles.sidebar} ${showSidebar ? styles.show : styles.hidden}`}>
      <div className={styles.navSection}>

        <Link to="/" className={styles.navItem} onClick={handleClickLink}>
          <span className="material-symbols-outlined">home</span> Principal
        </Link>
        {/* <Link to="/explorar" className={styles.navItem} onClick={handleClickLink}>
          <span className="material-symbols-outlined">explore</span> Explorar
        </Link> */}
        <Link to="/artistas" className={styles.navItem} onClick={handleClickLink}>
          <span className="material-symbols-outlined">artist</span> Artistas
        </Link>
        <div className={styles.separator}></div>
        <Link to="/playlists" className={styles.playlistButton} onClick={handleClickLink}>
          <span className="material-symbols-outlined">queue_music</span>
          Playlists
        </Link>

        <div className={styles.navTitle}>Your Top Genres</div>
        <div className={styles.genreTags}>
          {generos.map((genero, index) => (
            <span
              key={index}
              className={`${styles.genreTag} ${styles[genero.toLowerCase().replace(/\s/g, '-') || 'others']}`}
            >
              {genero}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBarComponent;
