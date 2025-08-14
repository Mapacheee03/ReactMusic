import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrincipalPage from './pages/PrincipalPage/PrincipalPage';
import AlbumsPages from './pages/AlbumsPages/AlbumsPages';
import ArtistasPages from './pages/ArtistasPages/ArtistasPages';
import ArtistaDetallePage from './pages/CancionArtistaPages/ArtistaDetallePage';
import './Style/global.css';
import CancionPage from './pages/CancionPage/CancionPage';
import MainLayout from './layouts/MainLayout';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PrincipalPage />} />
          <Route path="album/:albumId" element={<AlbumsPages />} />
          <Route path="/artistas" element={<ArtistasPages />} />
          <Route path="/artista/:id" element={<ArtistaDetallePage />} />
          <Route path="/cancion/:id" element={<CancionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;