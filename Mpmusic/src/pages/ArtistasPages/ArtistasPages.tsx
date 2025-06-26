// import FooterComponent from '../../components/FooterComponent/FooterComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import SearchComponent from '../../components/SearchComponent/SearchComponent';
// import styles from './AlbumPage.module.css';


function ArtistasPages() {
    return (

        <div className="container">
            <SideBarComponent />
            <SearchComponent />

            <div className="artist-list">
                <div className="artist-item">
                    <div className="avatar-container">
                        <img
                            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop&crop=face"
                            alt="División Minúscula"
                            className="avatar"
                        />
                    </div>
                    <div className="artist-info">
                        <h3 className="artist-name">División Minúscula</h3>
                        <p className="song-count">1 canción</p>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ArtistasPages;