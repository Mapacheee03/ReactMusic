// // src/context/SearchContext.tsx
// import { createContext, useContext, useEffect, useState } from 'react';
// import type { Cancion, Artista } from '../services/api';

// interface SearchContextType {
//   query: string;
//   setQuery: (q: string) => void;
//   resultadosCanciones: Cancion[];
//   resultadosArtistas: Artista[];
// }

// const SearchContext = createContext<SearchContextType | undefined>(undefined);

// export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
//   const [query, setQuery] = useState('');
//   const [resultadosCanciones, setResultadosCanciones] = useState<Cancion[]>([]);
//   const [resultadosArtistas, setResultadosArtistas] = useState<Artista[]>([]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (query.trim()) {
//         fetch(`https://api-musica.netlify.app/api/canciones?q=${encodeURIComponent(query)}`)
//           .then(res => res.json())
//           .then(data => setResultadosCanciones(data.success ? data.data : []));

//         fetch(`https://api-musica.netlify.app/api/artistas`)
//           .then(res => res.json())
//           .then(data => {
//             if (data.success && Array.isArray(data.data)) {
//               const filtered = data.data.filter((a: Artista) =>
//                 a.nombre.toLowerCase().includes(query.toLowerCase())
//               );
//               setResultadosArtistas(filtered);
//             } else {
//               setResultadosArtistas([]);
//             }
//           });
//       } else {
//         setResultadosCanciones([]);
//         setResultadosArtistas([]);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [query]);

//   return (
//     <SearchContext.Provider value={{ query, setQuery, resultadosCanciones, resultadosArtistas }}>
//       {children}
//     </SearchContext.Provider>
//   );
// };

// export const useSearch = () => {
//   const ctx = useContext(SearchContext);
//   if (!ctx) throw new Error('useSearch debe usarse dentro de SearchProvider');
//   return ctx;
// };
