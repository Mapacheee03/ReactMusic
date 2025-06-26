import { Outlet } from 'react-router-dom';
import FooterComponent from '../components/FooterComponent/FooterComponent';
import SideBarComponent from '../components/SideBarCamponent/SideBarComponent';

function MainLayout() {
  return (
    <>
      <div className="container">
        <SideBarComponent />
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
