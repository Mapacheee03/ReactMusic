const BASE_URL = 'https://reactmusic-back.onrender.com';

// Tipos
export interface Artista {
    id: number;
    nombre: string;
    nacionalidad: string;
    genero: string;
    añoFormacion: number;
    imagen: string;
    biografia: string;
}

export interface Album {
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
    albumId: number;
    artistaId: number;
    duracion: string;
    pista: number;
    letra: string;
    compositor: string;
    año: number;
    artista: Artista;
    album: Album;
    audioUrl?: string;  // opcional
}

// Método genérico para hacer fetch y manejar respuesta {success, data} o directa
async function get<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();

        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
            if (data.success) return data.data;
            throw new Error('Respuesta no exitosa');
        }

        return data as T;
    } catch (error) {
        console.error(`Error al obtener ${endpoint}:`, error);
        throw error;
    }
}

// API pública
export const ApiMusica = {
    getCanciones: () => get<Cancion[]>('/api/canciones'),

    getArtistas: async (): Promise<Artista[]> => {
        const canciones = await get<Cancion[]>('/api/canciones');
        const artistasUnicos = new Map<number, Artista>();
        canciones.forEach(c => {
            if (!artistasUnicos.has(c.artista.id)) {
                artistasUnicos.set(c.artista.id, c.artista);
            }
        });
        return Array.from(artistasUnicos.values());
    },

    getAlbumes: async (): Promise<Album[]> => {
        const canciones = await get<Cancion[]>('/api/canciones');
        const albumMap = new Map<number, Album>();
        canciones.forEach(c => {
            if (!albumMap.has(c.album.id)) {
                albumMap.set(c.album.id, c.album);
            }
        });
        return Array.from(albumMap.values());
    },
};
