import './SideBarComponent.css';
function SideBarComponent() {
    return (
        
        <div className="sidebar">

            <div className="nav-section">
                <div className="logo">
                    <h1>MP Music</h1>
                </div>

                <a href="#" className="nav-item"><span className="material-symbols-outlined">home</span>Principal</a>
                <a href="#" className="nav-item"><span className="material-symbols-outlined">explore</span>Explorar</a>
                <a href="#" className="nav-item"><span className="material-symbols-outlined">artist</span>Artistas</a>
          
                <a href="#" className="nav-item U"><span className="material-symbols-outlined">add</span>Nueva Playlist</a>

                    {/* <br> */}

                        <div className="nav-title">Your Top Genres</div>
                        <div className="genre-tags sidebar-tags">
                            <span className="genre-tag">Dance/Electronic</span>
                            <span className="genre-tag rock">Rock</span>
                            <span className="genre-tag pop">Pop</span>
                            <span className="genre-tag kpop">Korean-pop</span>
                            <span className="genre-tag made-for-you">Made For You</span>
                            <span className="genre-tag others">Others...</span>
                        </div>
                </div>
            </div>
    );
}
export default SideBarComponent;