// src/services/api.ts
const BASE_URL = 'https://reactmusic-back.onrender.com';

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
    audioUrl?: string;
}

async function get<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener ${endpoint}:`, error);
        throw error;
    }
}

export const ApiMusica = {
    getCanciones: () => get<Cancion[]>('/api/canciones'),
    getArtistas: () => get<Artista[]>('/api/artistas'),
    getAlbumes: () => get<Album[]>('/api/albumes'),
};