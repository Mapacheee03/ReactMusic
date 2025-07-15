import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrincipalPage from './pages/PrincipalPage/PrincipalPage';
import AlbumsPages from './pages/AlbumsPages/AlbumsPages';
import ArtistasPages from './pages/ArtistasPages/ArtistasPages';
import './Style/global.css'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<PrincipalPage />} />
          <Route path="album/:albumId" element={<AlbumsPages />} />

          {/* <Route path="explorar" element={<ExplorarPage />} /> */}
          <Route path="/artistas" element={<ArtistasPages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
