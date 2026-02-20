
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
  isoDate: string; // CRÍTICO: Formato YYYY-MM-DD
  completed: boolean; 
  flagUrl: string;
  mapUrl: string;
  format: RaceFormat;
  info?: string;
}

export interface Champion {
  id: string;
  name: string;
  season: string; 
  division: string;
  teamId: string;
  imageUrl: string;
}

export interface Admin {
  id: string;
  name: string;
  alias?: string;
  role: string;
  description: string;
  imageUrl: string;
}

export interface GCSDivisionData {
    pilotos: any[];
    constructores: any[];
    ultimo_gp?: string;
}

export interface DivisionData {
    id: string;
    name: string;
    standings: {
        drivers: any[];
        constructors: any[];
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

export interface LeaderboardEntry {
    name: string;
    time: string;
    rawTime: number;
    date: string;
}
