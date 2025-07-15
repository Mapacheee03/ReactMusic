const BASE_URL = 'https://api-musica.netlify.app';

// Tipos
export interface Artista {
    id: number;
    nombre: string;
    nacionalidad: string;
    genero: string;
    imagen: string;
    biografia: string;
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
    audioUrl?: string;  // opcional
}

export interface AlbumCompleto {
    id: number;
    titulo: string;
    artistaId: number;
    artistaNombre?: string;  // Puedes añadir nombre aquí para simplificar
    añoLanzamiento: number;
    genero: string;
    duracionTotal: string;
    numeroTracks: number;
    portada: string;
    descripcion: string;
    sello: string;
    productor: string;
    canciones: Cancion[];  // Lista de canciones en el álbum
}

// Método genérico para hacer fetch
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

    // Ahora la función obtiene los álbumes completos incluyendo las canciones agrupadas
    getAlbumes: async (): Promise<AlbumCompleto[]> => {
        // Obtén todas las canciones y artistas para construir los álbumes completos
        const canciones = await get<Cancion[]>('/api/canciones');
        const artistas = await get<Artista[]>('/api/artistas');

        // Map de álbumes para agrupar canciones
        const albumMap = new Map<number, AlbumCompleto>();

        canciones.forEach(cancion => {
            const alb = cancion.albumCompleto;
            if (!albumMap.has(alb.id)) {
                // Busca nombre del artista
                const artista = artistas.find(a => a.id === alb.artistaId);
                albumMap.set(alb.id, {
                    ...alb,
                    artistaNombre: artista?.nombre || '',
                    canciones: []
                });
            }
            albumMap.get(alb.id)!.canciones.push(cancion);
        });

        // Finalmente retorna el arreglo de álbumes con canciones agrupadas
        return Array.from(albumMap.values());
    },

    getGenero: () => get<string[]>('/api/generos'),
};
