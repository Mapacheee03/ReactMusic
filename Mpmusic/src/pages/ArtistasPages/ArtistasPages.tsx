import { useEffect, useState } from 'react';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import styles from './ArtistasPages.module.css';
import { ApiMusica } from '../../services/api';
import type { Artista, Cancion } from '../../services/api';

function ArtistasPages() {
    const [artistas, setArtistas] = useState<Artista[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [cancionActual] = useState<Cancion | undefined>(undefined);

    useEffect(() => {
        ApiMusica.getArtistas()
            .then(setArtistas)
            .catch(error => console.error('Error al cargar artistas:', error));
    }, []);

    // Simulación de control
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleNext = () => console.log('Siguiente canción');
    const handlePrev = () => console.log('Canción anterior');

    return (
        <div className={styles.container}>
            <SideBarComponent />

            <div className={styles.mainContent}>

                <div className={styles.artistList}>
                    <h1 className={styles.h1}>Artistas</h1>
                    {artistas.map(artista => (
                        <div className={styles.artistItem} key={artista.id}>
                            <div className={styles.avatarContainer}>
                                <img
                                    src={artista.imagen}
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.artistInfo}>
                                <h3 className={styles.artistName}>{artista.nombre}</h3>
                                <p className={styles.songCount}>
                                    {artista.genero} – {artista.nacionalidad}
                                </p>
                                <p className={styles.songCount}>
                                    {artista.biografia}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FooterComponent
                cancionActual={cancionActual}
                onPlay={handlePlay}
                onPause={handlePause}
                onNext={handleNext}
                onPrev={handlePrev}
                isPlaying={isPlaying}
            />
        </div>
    );
}

export default ArtistasPages;
