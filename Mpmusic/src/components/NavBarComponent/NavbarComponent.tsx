import { useState, useEffect } from 'react';
import styles from './NavbarComponent.module.css';
import { ApiMusica } from '../../services/api';
import type { Cancion, AlbumCompleto } from '../../services/api';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // ✅ Añadido
  const [resultados, setResultados] = useState<(Cancion | AlbumCompleto)[]>([]);

  const handleToggle = () => {
    setMenuOpen(prev => !prev);
    onToggleSidebar();
  };

  useEffect(() => {
    if (searchTerm.length === 0) {
      setResultados([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [canciones, albumes] = await Promise.all([
          ApiMusica.getCanciones(),
          ApiMusica.getAlbumes()
        ]);

        const term = searchTerm.toLowerCase();

        const resultadosFiltrados = [
          ...canciones.filter(c =>
            c.titulo.toLowerCase().includes(term)
          ),
          ...albumes.filter(a =>
            a.titulo.toLowerCase().includes(term)
          )
        ];

        setResultados(resultadosFiltrados);
      } catch (error) {
        console.error('Error al buscar:', error);
      }
    };

    const delay = setTimeout(fetchData, 300); // debounce básico
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button
          className={styles.menuButton}
          onClick={handleToggle}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {menuOpen ? 'menu' : 'close'}
          </span>
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
                  <Link to={`/cancion/${item.id}`}>{item.titulo} - {item.artista}</Link>
                ) : (
                  <Link to={`/album/${item.id}`}>{item.titulo} (Álbum)</Link>
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
