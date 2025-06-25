import './FooterComponent.css';

function FooterComponent() {


    return (
        <>
            <div className="song-progress-bar">
                <span className="time current-time">0:00</span>
                <div className="progress-container">
                    <div className="song-progress"></div>
                </div>
                <span className="time total-time">3:45</span>
            </div>
            <footer className="player-bar">
                <div className="now-playing">
                    <div className="now-playing-cover"></div>
                    <div className="now-playing-info">
                        <h4>A Sky Full of Stars</h4>
                        <p>{ }</p>
                    </div>
                    <button className="control-btn" id="heart"><span className="material-symbols-rounded">heart_plus</span></button>
                </div>

                <div className="player-controls">
                    <button className="control-btn" id="shuffle"><span className="material-symbols-rounded">shuffle</span></button>
                    <button className="control-btn" id="prev"><span className="material-symbols-rounded">skip_previous</span></button>
                    <button className="control-btn" id="play"><span className="material-symbols-rounded">play_arrow</span></button>
                    <button className="control-btn" id="next"><span className="material-symbols-rounded">skip_next</span></button>
                    <button className="control-btn" id="repeat"><span className="material-symbols-rounded">repeat</span></button>
                </div>

                <div className="volume-controls">
                    <button className="control-btn" id="volume"><span className="material-symbols-rounded">volume_up</span></button>
                    <div className="volume-slider">
                        <div className="volume-progress"></div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default FooterComponent;