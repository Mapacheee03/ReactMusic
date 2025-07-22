import { useState, useEffect } from 'react';
import styles from './NavbarComponent.module.css';
import { ApiMusica } from '../../services/api';
import type { Cancion, AlbumCompleto } from '../../services/api';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState<(Cancion | AlbumCompleto)[]>([]);
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [albumes, setAlbumes] = useState<AlbumCompleto[]>([]);

  const handleToggle = () => onToggleSidebar();

  // ✅ Carga datos solo una vez
  useEffect(() => {
    ApiMusica.getCanciones().then(setCanciones);
    ApiMusica.getAlbumes().then(setAlbumes);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setResultados([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    const cancionesFiltradas = canciones.filter(c =>
      c.titulo.toLowerCase().includes(term)
    );

    const albumesFiltrados = albumes.filter(a =>
      a.titulo.toLowerCase().includes(term)
    );

    const resultadosFiltrados = [...cancionesFiltradas, ...albumesFiltrados].slice(0, 7); // ✅ Limita resultados

    const delay = setTimeout(() => {
      setResultados(resultadosFiltrados);
    }, 150); // ✅ Debounce más rápido

    return () => clearTimeout(delay);
  }, [searchTerm, canciones, albumes]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button
          className={styles.menuButton}
          onClick={handleToggle}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className={styles.logo}>MP Music</h1>
      </div>

      <div className={styles.navbarSearch}>
        <input
          type="search"
          placeholder="Buscar música o álbum..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && resultados.length > 0 && (
          <ul className={styles.resultados}>
            {resultados.map((item, index) => (
              <li key={index}>
                {'artista' in item ? (
                  <Link to={`/cancion/${item.id}`}>
                    {item.titulo} - {item.artista}
                  </Link>
                ) : (
                  <Link to={`/album/${item.id}`}>
                    {item.titulo} (Álbum)
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.navbarProfile}>
        <span className="material-symbols-outlined">account_circle</span>
      </div>
    </nav>
  );
};

export default NavbarComponent;
