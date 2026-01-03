
export interface Team {
  id: string;
  name: string;
  color: string;
  logoUrl: string;
}

export interface Driver {
  id: string;
  name: string;
  teamId: string;
  number: number;
  country: string;
}

export interface Division {
  id: string;
  name: string;
  drivers: Driver[];
}

export type RaceFormat = 'FEATURE' | 'SPRINT' | 'INVERTED';

export interface RaceEvent {
  id: string;
  round: number;
  country: string;
  trackName: string;
  date: string;
  isoDate: string; // Formato YYYY-MM-DD para lógica automática
  completed: boolean; // Ahora se usará como fallback o flag manual
  flagUrl: string;
  mapUrl: string;
  format: RaceFormat;
}

export interface Champion {
  id: string;
  name: string;
  season: string; // 'S1', 'S2', 'S3', 'S4'
  division: string;
  teamId: string;
  imageUrl: string;
}

export interface Admin {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

// --- GCS DATA TYPES (Exact structure from JSON files) ---
export interface GCSDriverStanding {
    posicion: number;
    id: string; // Driver Name
    equipo: string; // Team Name string (e.g. "Red Bull Racing")
    puntos: number;
    status?: string; // e.g. "Reserva"
}

export interface GCSConstructorStanding {
    posicion: number;
    equipo: string;
    puntos: number;
}

export interface GCSDivisionData {
    pilotos: GCSDriverStanding[];
    constructores: GCSConstructorStanding[];
    ultimo_gp?: string; // Nombre del último GP disputado (ej: "Gran Premio de los Paises Bajos")
}
// -------------------------------------------------------

export interface DivisionData {
    id: string;
    name: string;
    standings: {
        drivers: GCSDriverStanding[];
        constructors: GCSConstructorStanding[];
    }
}

export type MediaType = 'IMAGE' | 'YOUTUBE' | 'TWITCH';

export interface MediaItem {
    id: string;
    type: MediaType;
    url: string;
    thumbnail?: string;
    title: string;
}

// --- GAME TYPES ---
export interface LeaderboardEntry {
    name: string;
    time: string; // Formatted "01:23.456"
    rawTime: number; // ms for sorting
    date: string;
}
