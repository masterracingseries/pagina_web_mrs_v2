
import { Division, RaceEvent, Team, Champion, Admin, DivisionData, MediaItem, LeaderboardEntry } from './types';

/**
 * 🚩 CONFIGURACIÓN DE TEMPORADA (MODO PRE-SEASON)
 */
export const IS_SEASON_ACTIVE = false; 

export const REGISTRATION_URL = "https://forms.gle/GXuXpwheGow1fne67"; 

/**
 * 🛠️ RUTAS DE ACTIVOS (Relative to public folder)
 */
export const LOGO_URL = "images/logos/logo.png"; 

export const LEAGUE_RULES_URL = "https://drive.google.com/file/d/1wPT33tlpuQ2kWoU5LidIgi9K8ncn2B4e/view?usp=sharing";

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
  { id: 'r1', round: 1, country: 'Australia', trackName: 'Albert Park Circuit', date: '8-11 Marzo', isoDate: '2026-03-11', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/au.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia.png.transform/2col/image.png', info: 'Circuito semiurbano rápido, conocido por sus curvas de alta velocidad y muros cercanos.' },
  { id: 'r2', round: 2, country: 'China', trackName: 'Shanghai International Circuit', date: '15-18 Marzo', isoDate: '2026-03-18', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/cn.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/China.png.transform/2col/image.png', info: 'Famoso por su interminable curva 1 y la larguísima recta trasera que favorece los adelantamientos.' },
  { id: 'r3', round: 3, country: 'Austria', trackName: 'Red Bull Ring', date: '22-25 Marzo', isoDate: '2026-03-25', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/at.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria.png.transform/2col/image.png', info: 'Trazado corto pero intenso, con grandes desniveles y fuertes frenadas.' },
  { id: 'r4', round: 4, country: 'Japón', trackName: 'Suzuka International Racing Course', date: '29 Mar - 1 Abr', isoDate: '2026-04-01', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/jp.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan.png.transform/2col/image.png', info: 'Circuito de la vieja escuela en forma de 8, con las icónicas y exigentes "Eses".' },
  { id: 'r5', round: 5, country: 'Bahrein', trackName: 'Bahrain International Circuit', date: '6-8 y 12 Abril', isoDate: '2026-04-12', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/bh.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Bahrain.png.transform/2col/image.png', info: 'Carrera nocturna en el desierto, muy exigente con los frenos y la tracción.' },
  { id: 'r6', round: 6, country: 'Arabia Saudita', trackName: 'Jeddah Corniche Circuit', date: '13-19 Abril', isoDate: '2026-04-19', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/sa.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Saudi%20Arabia.png.transform/2col/image.png', info: 'El circuito urbano más rápido del mundo, sin margen de error.' },
  { id: 'r7', round: 7, country: 'Italia', trackName: 'Autodromo Enzo e Dino Ferrari', date: '20-26 Abril', isoDate: '2026-04-26', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/it.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Emilia%20Romagna.png.transform/2col/image.png', info: 'Trazado histórico, técnico y rápido, donde adelantar es un gran desafío.' },
  { id: 'r8', round: 8, country: 'Miami', trackName: 'Miami International Autodrome', date: '27 Abr - 3 May', isoDate: '2026-05-03', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/us.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Miami.png.transform/2col/image.png', info: 'Circuito urbano alrededor del Hard Rock Stadium con zonas muy rápidas y un sector técnico.' },
  { id: 'r9', round: 9, country: 'Azerbaiyán', trackName: 'Baku City Circuit', date: '4-10 Mayo', isoDate: '2026-05-10', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/az.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244987/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan.png.transform/2col/image.png', info: 'Combina la recta más larga del calendario con la estrecha y técnica zona del castillo.' },
  { id: 'r10', round: 10, country: 'España', trackName: 'Circuit de Barcelona-Catalunya', date: '11-17 Mayo', isoDate: '2026-05-17', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/es.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244986/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain.png.transform/2col/image.png', info: 'Circuito muy completo que pone a prueba la aerodinámica de los monoplazas.' },
];

/**
 * 🏆 HISTORIAL DE CAMPEONES
 * Se muestran únicamente los campeones de la Season 3.
 */
export const CHAMPIONS: Champion[] = [
  // --- SEASON 3 (ARCHIVOS ACTUALMENTE EN GITHUB) ---
  { id: 'c1-s3', name: 'RLS_DARUMA', season: 'S3', division: 'Division 1', teamId: 'rb', imageUrl: "images/champions/campeon_div1_season3_rlsdaruma.png" },
  { id: 'c2-s3', name: 'RLS_PRICE', season: 'S3', division: 'Division 2', teamId: 'ferrari', imageUrl: "images/champions/campeon_div2_season3_rlsprice.png" },
  { id: 'c3-s3', name: 'RLS_MATIASTAPIA', season: 'S3', division: 'Division 3', teamId: 'mclaren', imageUrl: "images/champions/campeon_div3_season3_rlsmatiastapia.png" },
  { id: 'c4-s3', name: 'CHIKIXD_2', season: 'S3', division: 'Division 4', teamId: 'aston', imageUrl: "images/champions/campeon_div4_season3_chikixd.png" },
  { id: 'c1-s4', name: 'JSQ_VALENMAR46', season: 'S4', division: 'Division 1', teamId: 'redbull', imageUrl: "images/champions/campeon_div1_season4_jsqvalen.png" },
  { id: 'c2-s4', name: 'NEM_THAPIA', season: 'S4', division: 'Division 2', teamId: 'mclaren', imageUrl: "images/champions/campeon_div2_season4_nemthapia.png" },
  { id: 'c3-s4', name: 'RLS_MACHUCA42', season: 'S4', division: 'Division 3', teamId: 'ferrari', imageUrl: "images/champions/campeon_div3_season4_rlsmachuca.png" },
  { id: 'c4-s4', name: 'NEM_ISAAC', season: 'S4', division: 'Division 4', teamId: 'mclaren', imageUrl: "images/champions/campeon_div4_season4_nemisaac.png" },
];

export const ADMINS: Admin[] = [
  { 
    id: 'a1', 
    name: 'Sebastian Muzenmayer', 
    alias: 'RLS_FACETAS',
    role: 'Dictador Supremo', 
    description: 'Dictador supremo, se hace lo que el diga o te despide.', 
    imageUrl: "images/admins/facetas_admin.jpeg" 
  },
  { 
    id: 'a2', 
    name: 'Esteban Iriarte', 
    alias: 'RLS_IRIARTE',
    role: 'Administrador Multitasking', 
    description: 'Hace de todo cuanto tiene tiempo (nunca).', 
    imageUrl: "images/admins/iriarte_admin.jpeg" 
  },
  { 
    id: 'a3', 
    name: 'Gaston Sepulveda', 
    alias: 'RLS_IRONHUNTER',
    role: 'Fundador & Pilar', 
    description: 'Sin el nada de esto existe.', 
    imageUrl: "images/admins/iron_admin.jpeg" 
  },
];

export const DIVISION_STANDINGS: DivisionData[] = [];
export const LEADERBOARD_DEFAULTS: LeaderboardEntry[] = [];
