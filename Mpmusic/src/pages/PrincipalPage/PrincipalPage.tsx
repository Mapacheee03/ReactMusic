import './PrincipalPage.css';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';


function PrincipalPage() {
    return (
        <>
            <div className="container">
                <div id="sidebar-placeholder">
                    <SideBarComponent />
                </div>
                <div className="main-content">
                    <div className="top-bar">
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input type=" text" placeholder="Artists, songs, or podcasts" />
                        </div>
                        <div className="user-profile">
                            <div className="user-avatar">
                                <i className="fas fa-user"></i>
                            </div>
                            <span className="user-name">Orlando Grajeda</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <div className="hero-section">
                        <div className="new-release">
                            <div className="new-release-label">New Releases!</div>
                            <div className="hero-container">
                                <div className="hero-text">
                                    <h2>Light Downs Low MAX</h2>
                                    <button className="play-button">Play Now!</button>
                                </div>
                            </div>
                        </div>
                        <div className="section">
                            <h3 className="section-title">Recently played</h3>
                            <div className="albums-grid" id="albums-container">
                            </div>
                        </div>
                        <div className="section">
                            <h3 className="section-title">Top Global</h3>
                            <ul className="track-list" id="top-global-list">
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            <div id="footer-placeholder">
                <FooterComponent/> 
            </div>
        </>
    );
}
export default PrincipalPage;