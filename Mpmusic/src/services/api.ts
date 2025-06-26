const BASE_URL = 'https://api-musica.netlify.app';

// Tipos
export interface Artista {
    id: number;
    nombre: string;
    nacionalidad: string;
    genero: string;
    imagen: string;
}

export interface AlbumCompleto {
    id: number;
    titulo: string;
    artistaId: number;
    añoLanzamiento: number;
    genero: string;
    duracionTotal: string;
    numeroTracks: number;
    portada: string;
    descripcion: string;
    sello: string;
    productor: string;
}

export interface Cancion {
    id: number;
    titulo: string;
    artista: string;
    album: string;
    duracion: string;
    año: number;
    artistaCompleto: Artista;
    albumCompleto: AlbumCompleto;
    audioUrl?: string;  // <-- aquí

}

export interface AlbumResumen {
    id: number;
    titulo: string;
    artista: string;
    añoLanzamiento: number;
    genero: string;
    portada: string;
    numeroCanciones: number;
    infoCanciones: Cancion;
}

// Método genérico
async function get<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const data = await response.json();
        if (data.success) return data.data;
        throw new Error('Respuesta no exitosa');
    } catch (error) {
        console.error(`Error al obtener ${endpoint}:`, error);
        throw error;
    }
}

// API pública
export const ApiMusica = {
    getCanciones: () => get<Cancion[]>('/api/canciones'),
    getArtistas: () => get<Artista[]>('/api/artistas'),
    getAlbumes: () => get<AlbumCompleto[]>('/api/albumes'),
    getGenero: () => get<string[]>('/api/generos'),

    getAlbumesResumen: async (): Promise<AlbumResumen[]> => {
        const canciones = await get<Cancion[]>('/api/canciones');

        const albumMap = new Map<number, AlbumResumen>();

        canciones.forEach(cancion => {
            const albumId = cancion.albumCompleto.id;
            if (!albumMap.has(albumId)) {
                albumMap.set(albumId, {
                    id: cancion.albumCompleto.id,
                    titulo: cancion.albumCompleto.titulo,
                    artista: cancion.artistaCompleto.nombre,
                    añoLanzamiento: cancion.albumCompleto.añoLanzamiento,
                    genero: cancion.albumCompleto.genero,
                    portada: cancion.albumCompleto.portada,
                    numeroCanciones: cancion.albumCompleto.numeroTracks,
                    infoCanciones: cancion, // Primera canción que aparece del álbum
                });
            }
        });

        return Array.from(albumMap.values());
    }
};
