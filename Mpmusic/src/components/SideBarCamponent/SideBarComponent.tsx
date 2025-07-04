import './SideBarComponent.css';
import { Link } from 'react-router-dom';
import { ApiMusica } from '../../services/api';
import { useEffect, useState } from 'react';

function SideBarComponent() {
  const [generos, setGeneros] = useState<string[]>([]);

 useEffect(() => {
  const fetchGeneros = async () => {
    try {
      const response = await ApiMusica.getGenero(); // devuelve string[]
      setGeneros(response); // directo
    } catch (error) {
      console.error('Error al obtener géneros:', error);
    }
  };

  fetchGeneros();
}, []);
  return (
    <div className="sidebar">
      <div className="nav-section">
        <div className="logo">
          <h1>MP Music</h1>
        </div>

        <Link to="/" className="nav-item">
          <span className="material-symbols-outlined">home</span> Principal
        </Link>
        <Link to="/explorar" className="nav-item">
          <span className="material-symbols-outlined">explore</span> Explorar
        </Link>
        <Link to="/artistas" className="nav-item">
          <span className="material-symbols-outlined">artist</span> Artistas
        </Link>
        {/* <Link to="/nueva-playlist" className="nav-item">
          <span className="material-symbols-outlined">add</span> Nueva Playlist
        </Link> */}

        <div className="nav-title">Your Top Genres</div>
        <div className="genre-tags sidebar-tags">
          {generos.map((genero, index) => (
            <span
              key={index}
              className={`genre-tag ${genero.toLowerCase().replace(/\s/g, '-')}`}
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
