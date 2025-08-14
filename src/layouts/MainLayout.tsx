import { Outlet } from 'react-router-dom';
import FooterComponent from '../components/FooterComponent/FooterComponent';
import { PlayerProvider } from '../context/PlayerContext';

function MainLayout() {
  return (
    <PlayerProvider>
      <div className="container">
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      <FooterComponent />
    </PlayerProvider>
  );
}

export default MainLayout;