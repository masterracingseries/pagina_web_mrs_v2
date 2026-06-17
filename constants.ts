
import { Division, RaceEvent, Team, Champion, Admin, DivisionData, MediaItem, LeaderboardEntry } from './types';

/**
 * 🚩 CONFIGURACIÓN DE TEMPORADA
 * ─────────────────────────────────────────────────────
 * ⚠️  ÚNICO LUGAR donde se cambia el número de season.
 *     Todos los componentes leen desde acá.
 * ─────────────────────────────────────────────────────
 */
export const CURRENT_SEASON = 6;                          // <── cambiar cada temporada
export const CURRENT_SEASON_LABEL = `S${CURRENT_SEASON}`; // "S6"
export const IS_SEASON_ACTIVE = true;
export const SHOW_REGISTRATION = false;  // <── true para mostrar el botón de inscripción
export const REGISTRATION_URL  = '';      // <── URL del formulario cuando SHOW_REGISTRATION = true


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
  { id: 'r1',  round: 1,  country: 'Austria',       trackName: 'Red Bull Ring',                      date: '15-19 Junio',      isoDate: '2026-06-19', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/at.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria.png.transform/2col/image.png',        info: 'Trazado corto pero intenso en Spielberg. Grandes desniveles, fuertes frenadas y muchas oportunidades de adelantamiento gracias al DRS.' },
  { id: 'r2',  round: 2,  country: 'Japón',          trackName: 'Suzuka International Racing Course', date: '22-26 Junio',      isoDate: '2026-06-26', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/jp.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan.png.transform/2col/image.png',          info: 'Circuito en forma de 8, con las icónicas y exigentes "Eses". Un templo del automovilismo que premia al piloto por encima de todo.' },
  { id: 'r3',  round: 3,  country: 'Canadá',         trackName: 'Circuit Gilles Villeneuve',          date: '29 Jun - 3 Jul',   isoDate: '2026-07-03', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/ca.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Canada.png.transform/2col/image.png',        info: 'Semipermanente en la isla Notre-Dame de Montréal. Famoso por el muro de los campeones, muy exigente con los frenos y lleno de acción.' },
  { id: 'r4',  round: 4,  country: 'Australia',      trackName: 'Albert Park Circuit',                date: '6-10 Julio',       isoDate: '2026-07-10', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/au.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia.png.transform/2col/image.png',      info: 'Circuito semiurbano rápido en Melbourne, con curvas de alta velocidad y muros muy cercanos que no perdonan el más mínimo error.' },
  { id: 'r5',  round: 5,  country: 'Madrid',         trackName: 'Circuit de Madrid',                  date: '13-17 Julio',      isoDate: '2026-07-17', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/es.svg', mapUrl: 'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000001/common/f1/2026/track/2026trackmadringdetailed.webp',                                                          info: 'El nuevo trazado de la capital española. Moderno, veloz y con zonas técnicas que exigen precisión milimétrica a los pilotos.' },
  { id: 'r6',  round: 6,  country: 'Hungría',        trackName: 'Hungaroring',                        date: '20-24 Julio',      isoDate: '2026-07-24', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/hu.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Hungary.png.transform/2col/image.png',       info: 'Conocido como el "Mónaco sin muros". Trazado angosto y sinuoso donde adelantar es casi imposible y la clasificación lo es todo.' },
  { id: 'r7',  round: 7,  country: 'Países Bajos',   trackName: 'Circuit Zandvoort (Invertido)',      date: '27-31 Julio',      isoDate: '2026-07-31', completed: false, format: 'INVERTED', flagUrl: 'https://flagcdn.com/nl.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Netherlands.png.transform/2col/image.png',    info: 'La versión invertida del trazado holandés con sus icónicos peraltes ahora en sentido contrario. Un desafío único que pondrá a prueba la adaptabilidad de cada piloto.' },
  { id: 'r8',  round: 8,  country: 'Reino Unido',    trackName: 'Silverstone Circuit',                date: '3-7 Agosto',       isoDate: '2026-08-07', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/gb.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Great%20Britain.png.transform/2col/image.png', info: 'El templo del automovilismo. Alta velocidad, curvas de alta carga aerodinámica como Copse y Maggotts, y un clima que siempre sorprende.' },
  { id: 'r9',  round: 9,  country: 'Azerbaiyán',     trackName: 'Baku City Circuit',                  date: '10-14 Agosto',     isoDate: '2026-08-14', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/az.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244987/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan.png.transform/2col/image.png',    info: 'Combina la recta más larga del calendario con la estrecha y técnica zona del castillo. Escenario de caos, safety cars y adelantamientos épicos.' },
  { id: 'r10', round: 10, country: 'Brasil',          trackName: 'Autódromo José Carlos Pace',        date: '17-21 Agosto',     isoDate: '2026-08-21', completed: false, format: 'FEATURE',  flagUrl: 'https://flagcdn.com/br.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Brazil.png.transform/2col/image.png',        info: 'Interlagos: cambios de altitud, clima impredecible y un ambiente único. La gran final de la temporada en el corazón de América del Sur.' },
];

/**
 * 🏆 HISTORIAL DE CAMPEONES
 * ─────────────────────────────────────────────────────
 * Al terminar cada temporada: agregar los 4 campeones
 * nuevos con season: 'S6', 'S7', etc.
 * Imágenes en: /public/images/champions/
 * ─────────────────────────────────────────────────────
 */
export const CHAMPIONS: Champion[] = [
  // --- SEASON 3 ---
  { id: 'c1-s3', name: 'RLS_DARUMA',      season: 'S3', division: 'Division 1', teamId: 'rb',      imageUrl: "images/champions/campeon_div1_season3_rlsdaruma.png" },
  { id: 'c2-s3', name: 'RLS_PRICE',       season: 'S3', division: 'Division 2', teamId: 'ferrari', imageUrl: "images/champions/campeon_div2_season3_rlsprice.png" },
  { id: 'c3-s3', name: 'RLS_MATIASTAPIA', season: 'S3', division: 'Division 3', teamId: 'mclaren', imageUrl: "images/champions/campeon_div3_season3_rlsmatiastapia.png" },
  { id: 'c4-s3', name: 'CHIKIXD_2',       season: 'S3', division: 'Division 4', teamId: 'aston',   imageUrl: "images/champions/campeon_div4_season3_chikixd.png" },
  // --- SEASON 4 ---
  { id: 'c1-s4', name: 'JSQ_VALENMAR46', season: 'S4', division: 'Division 1', teamId: 'rb',      imageUrl: "images/champions/campeon_div1_season4_jsqvalen.jpeg" },
  { id: 'c2-s4', name: 'NEM_THAPIA',     season: 'S4', division: 'Division 2', teamId: 'mclaren', imageUrl: "images/champions/campeon_div2_season4_nemthapia.jpeg" },
  { id: 'c3-s4', name: 'RLS_MACHUCA42',  season: 'S4', division: 'Division 3', teamId: 'ferrari', imageUrl: "images/champions/campeon_div3_season4_rlsmachuca.jpeg" },
  { id: 'c4-s4', name: 'NEM_ISAAC',      season: 'S4', division: 'Division 4', teamId: 'mclaren', imageUrl: "images/champions/campeon_div4_season4_nemisaac.jpeg" },
  // --- SEASON 5 --- ⚠️ Descomentar y completar al finalizar S5
  // { id: 'c1-s5', name: 'PILOTO_DIV1', season: 'S5', division: 'Division 1', teamId: 'rb',      imageUrl: "images/champions/campeon_div1_season5_xxx.jpeg" },
  // { id: 'c2-s5', name: 'PILOTO_DIV2', season: 'S5', division: 'Division 2', teamId: 'ferrari', imageUrl: "images/champions/campeon_div2_season5_xxx.jpeg" },
  // { id: 'c3-s5', name: 'PILOTO_DIV3', season: 'S5', division: 'Division 3', teamId: 'mclaren', imageUrl: "images/champions/campeon_div3_season5_xxx.jpeg" },
  // { id: 'c4-s5', name: 'PILOTO_DIV4', season: 'S5', division: 'Division 4', teamId: 'aston',   imageUrl: "images/champions/campeon_div4_season5_xxx.jpeg" },
  // --- SEASON 6 --- ⚠️ Agregar al finalizar S6
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
