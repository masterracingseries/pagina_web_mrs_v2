
import { Division, RaceEvent, Team, Champion, Admin, DivisionData, MediaItem, LeaderboardEntry } from './types';

/**
 * 🚩 CONFIGURACIÓN DE TEMPORADA (MODO PRE-SEASON)
 */
export const IS_SEASON_ACTIVE = false; 

export const REGISTRATION_URL = "https://forms.gle/tu-link-aqui"; 

/**
 * 🛠️ RUTAS DE ACTIVOS (Relative to public folder)
 */
export const LOGO_URL = "images/logos/logo.png"; 

export const LEAGUE_RULES_URL = "https://drive.google.com/file/d/1ID1ZR0QDcjwX2cp49wUe1446AgKPjuR/preview";

export const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/masterracingseries/",
    twitch: "https://www.twitch.tv/masterracingseries",
    youtube: "https://youtube.com/@masterracingseries",
    discord: "#" 
};

export const MEDIA_ITEMS: MediaItem[] = [
    { 
        id: 'm1', 
        type: 'TWITCH', 
        url: `https://clips.twitch.tv/embed?clip=EasySmoothAardvarkMau5-BcnYvsXj1vEpwSQL&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`, 
        title: 'Final de infarto' 
    },
    { 
        id: 'm2', 
        type: 'YOUTUBE', 
        url: 'https://www.youtube.com/embed/DYF4Rp3zfKc', 
        title: 'No me choquen' 
    },
    { 
        id: 'm3', 
        type: 'YOUTUBE', 
        url: 'https://www.youtube.com/embed/7uSWra9M634', 
        title: 'Que mierda hiciste Daruma' 
    },
    { 
        id: 'm4', 
        type: 'IMAGE', 
        url: 'https://images.unsplash.com/photo-1535079934785-644095386349?q=80&w=2940&auto=format&fit=crop', 
        title: 'Season 5 Reveal' 
    }
];

export const TEAMS: Team[] = [
  { id: 'rb', name: 'Red Bull Racing', color: '#3671C6', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png.transform/2col/image.png' },
  { id: 'merc', name: 'Mercedes-AMG', color: '#27F4D2', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png.transform/2col/image.png' },
  { id: 'ferrari', name: 'Ferrari', color: '#E8002D', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png.transform/2col/image.png' },
  { id: 'mclaren', name: 'McLaren', color: '#FF8000', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png.transform/2col/image.png' },
  { id: 'aston', name: 'Aston Martin', color: '#225941', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png.transform/2col/image.png' },
  { id: 'alpine', name: 'Alpine', color: '#FF87BC', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png.transform/2col/image.png' },
  { id: 'williams', name: 'Williams', color: '#64C4FF', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png.transform/2col/image.png' },
  { id: 'rb_vcarb', name: 'RB (VCARB)', color: '#6692FF', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png.transform/2col/image.png' },
  { id: 'sauber', name: 'Kick Sauber', color: '#52E252', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber-logo.png.transform/2col/image.png' },
  { id: 'haas', name: 'Haas F1 Team', color: '#B6BABD', logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas-logo.png.transform/2col/image.png' },
];

export const DIVISIONS: Division[] = [
  { id: 'div1', name: 'División 1 (Elite)', drivers: [] },
  { id: 'div2', name: 'División 2 (Pro)', drivers: [] },
  { id: 'div3', name: 'División 3 (Challenger)', drivers: [] },
  { id: 'div4', name: 'División 4 (Rookie)', drivers: [] },
];

export const CALENDAR: RaceEvent[] = [
  { id: 'r1', round: 1, country: 'TBA', trackName: 'TBA', date: 'COMING SOON', isoDate: '2025-01-01', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/un.svg', mapUrl: '' },
];

/**
 * 🏆 HISTORIAL DE CAMPEONES
 * Las imágenes de Season 4 se cargarán solas si se suben con el nombre:
 * 'images/champions/campeon_div[X]_season4_[NOMBRE].png'
 */
export const CHAMPIONS: Champion[] = [
  // --- SEASON 4 (PRE-CARGADOS PARA CUANDO SUBAS LAS FOTOS) ---
  { id: 'c1-s4', name: 'RLS_DARUMA', season: 'S4', division: 'Division 1', teamId: 'rb', imageUrl: "images/champions/campeon_div1_season4_rlsdaruma.png" },
  { id: 'c2-s4', name: 'RLS_PRICE', season: 'S4', division: 'Division 2', teamId: 'ferrari', imageUrl: "images/champions/campeon_div2_season4_rlsprice.png" },
  
  // --- SEASON 3 (ARCHIVOS ACTUALMENTE EN GITHUB) ---
  { id: 'c1-s3', name: 'RLS_DARUMA', season: 'S3', division: 'Division 1', teamId: 'rb', imageUrl: "images/champions/campeon_div1_season3_rlsdaruma.png" },
  { id: 'c2-s3', name: 'RLS_PRICE', season: 'S3', division: 'Division 2', teamId: 'ferrari', imageUrl: "images/champions/campeon_div2_season3_rlsprice.png" },
  { id: 'c3-s3', name: 'RLS_MATIASTAPIA', season: 'S3', division: 'Division 3', teamId: 'mclaren', imageUrl: "images/champions/campeon_div3_season3_rlsmatiastapia.png" },
  { id: 'c4-s3', name: 'CHIKIXD_2', season: 'S3', division: 'Division 4', teamId: 'aston', imageUrl: "images/champions/campeon_div4_season3_chikixd.png" },
];

export const ADMINS: Admin[] = [
  { id: 'a1', name: 'Alejandro', role: 'Race Director', description: 'Fundador de MRS. Encargado de la normativa y dirección de carrera.', imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
  { id: 'a2', name: 'Beatriz', role: 'CM & Logistics', description: 'La voz de MRS. Gestiona redes sociales y coordinación de eventos.', imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
  { id: 'a3', name: 'Sebastian', role: 'Technical Support', description: 'Experto en telemetría y soporte técnico.', imageUrl: "images/logos/gif_iacetas.gif" },
];

export const DIVISION_STANDINGS: DivisionData[] = [];
export const LEADERBOARD_DEFAULTS: LeaderboardEntry[] = [];
