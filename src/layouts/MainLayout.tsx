import { Outlet } from 'react-router-dom';
import FooterComponent from '../components/FooterComponent/FooterComponent';

function MainLayout() {
  return (
    <>
      <div className="container">
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      <FooterComponent
        onPlay={() => {}}
        onPause={() => {}}
        onNext={() => {}}
        onPrev={() => {}}
        isPlaying={false}
      />
    </>
  );
}

export default MainLayout;
