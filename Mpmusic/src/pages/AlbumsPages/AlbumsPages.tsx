import styles from './AlbumPage.module.css';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiMusica } from '../../services/api';
import type { AlbumCompleto, Cancion } from '../../services/api';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import SideBarComponent from '../../components/SideBarCamponent/SideBarComponent';

function AlbumPage() {
    const { albumId } = useParams();
    const [album, setAlbum] = useState<AlbumCompleto | null>(null);
    const [canciones, setCanciones] = useState<Cancion[]>([]);
    const [cancionActual, setCancionActual] = useState<Cancion | undefined>();
    const [indiceActual, setIndiceActual] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (albumId) {
            ApiMusica.getAlbumes().then(albumes => {
                const encontrado = albumes.find(a => a.id === parseInt(albumId));
                setAlbum(encontrado || null);
            });
            ApiMusica.getCanciones().then(canciones => {
                const filtradas = canciones.filter(c => c.albumCompleto.id === parseInt(albumId));
                // Para demo: asigna url de audio de prueba (reemplaza por real)
                const cancionesConAudio = filtradas.map(c => ({
                    ...c,
                    audioUrl: '',
                }));
                setCanciones(cancionesConAudio);
            });
        }
    }, [albumId]);

    // Reproducir una canción por índice
    const reproducirCancion = (index: number) => {
        const cancion = canciones[index];
        setCancionActual(cancion);
        setIndiceActual(index);
        setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
        }, 100);
    };

    const onPlay = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const onPause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const onNext = () => {
        if (canciones.length === 0) return;
        const nextIndex = (indiceActual + 1) % canciones.length;
        reproducirCancion(nextIndex);
    };

    const onPrev = () => {
        if (canciones.length === 0) return;
        const prevIndex = (indiceActual - 1 + canciones.length) % canciones.length;
        reproducirCancion(prevIndex);
    };

    // // Actualiza el tiempo y duración conforme avanza la canción
    // useEffect(() => {
    //     const audio = audioRef.current;
    //     if (!audio) return;

    //     // const actualizarTiempo = () => {
    //     //     setCurrentTime(audio.currentTime);
    //     //     setDuration(audio.duration || 0);
    //     // };

    //     audio.addEventListener('timeupdate', actualizarTiempo);
    //     audio.addEventListener('ended', onNext);

    //     return () => {
    //         audio.removeEventListener('timeupdate', actualizarTiempo);
    //         audio.removeEventListener('ended', onNext);
    //     };
    // }, [cancionActual, onNext]);

    if (!album) return <div>Cargando...</div>;

    return (
        <div className={styles.container}>
            <SideBarComponent />
            <div className={styles.mainContent}>
                <div className={styles.albumSection}>
                    <div className={styles.albumHeader}>
                        <div
                            className={styles.albumCover}
                        // style={{ backgroundImage: `url(${album.portada})` }}
                        ></div>
                        <div className={styles.albumDetails}>
                            <div className={styles.artistBadge}>
                                <div className={styles.verifiedIcon}></div>
                                <span>{album.productor}</span>
                            </div>
                            <h1 className={styles.albumTitle}>{album.titulo}</h1>
                            <div className={styles.albumMeta}>
                                <div>Álbum • {album.añoLanzamiento}</div>
                                <div>{album.numeroTracks} canciones • {album.duracionTotal}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.trackList}>
                        {canciones.map((cancion, i) => (
                            <div
                                className={styles.trackItem}
                                key={cancion.id}
                                onClick={() => reproducirCancion(i)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.trackNumber}>
                                    <span>{i + 1}</span>
                                    <i className={`fas fa-play ${styles.trackPlayBtn}`}></i>
                                </div>
                                <div className={styles.trackInfo}>
                                    <h3>{cancion.titulo}</h3>
                                    <p>{cancion.artistaCompleto.nombre}</p>
                                </div>
                                <div className={styles.trackDuration}>{cancion.duracion}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FooterComponent
                cancionActual={cancionActual}
                onPlay={onPlay}
                onPause={onPause}
                onNext={onNext}
                onPrev={onPrev}
                isPlaying={isPlaying}
            />

            <audio ref={audioRef} src={cancionActual?.audioUrl} />
        </div>
    );
}

export default AlbumPage;
