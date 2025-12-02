
import { Division, RaceEvent, Team, Champion, Admin, DivisionData, MediaItem, LeaderboardEntry } from './types';

// =============================================================================
// 📂 GUÍA DE CARPETAS (IMPORTANTE)
// =============================================================================
/*
  Para que las imágenes funcionen, debes crear estas carpetas en tu proyecto (public/):
  1. public/images/logos/      -> Aquí va 'logo.png' y 'hero-bg.jpg'
  2. public/images/champions/  -> Aquí van las fotos de los campeones (ej: 's3-div1.jpg')
  3. public/images/staff/      -> Aquí van las fotos de los admins (ej: 'alejandro.jpg')
*/

// =============================================================================
// 📜 REGLAMENTO
// =============================================================================
// Link directo al PDF en Google Drive. Asegúrate de que termine en "/preview"
export const LEAGUE_RULES_URL = "https://drive.google.com/file/d/1ID1ZR0QDcjwX2cp49wUe1446AgXKPjuR/preview";

// =============================================================================
// 🌐 REDES SOCIALES
// =============================================================================
export const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/masterracingseries/",
    twitch: "https://www.twitch.tv/masterracingseries",
    youtube: "https://youtube.com/@masterracingseries",
    discord: "#" 
};

// =============================================================================
// 📸 MULTIMEDIA (GALLERY)
// =============================================================================
/*
  type: 'YOUTUBE' | 'TWITCH' | 'IMAGE'
  - Para YouTube: Usa la URL "embed" (ej: https://www.youtube.com/embed/VIDEO_ID)
  - Para Twitch: Usa la URL del player o clip (ej: https://clips.twitch.tv/embed?clip=ID&parent=tudominio.com)
  - Para Imagen: Usa la ruta local 'images/...' o una URL externa.
*/
export const MEDIA_ITEMS: MediaItem[] = [
    {
        id: 'm1',
        type: 'YOUTUBE',
        url: 'https://www.youtube.com/embed/u2NJDt2tM5M?si=example', 
        title: 'Highlights: Round 3 Australia'
    },
    {
        id: 'm2',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1535079934785-644095386349?q=80&w=2940&auto=format&fit=crop',
        title: 'Photo Finish Bahrain'
    },
    {
        id: 'm3',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1631519266649-938270137c79?q=80&w=2942&auto=format&fit=crop',
        title: 'Paddock Life'
    },
    {
        id: 'm4',
        type: 'YOUTUBE',
        url: 'https://www.youtube.com/embed/546qf7q0yqI?si=example',
        title: 'Season 4 Trailer'
    }
];

// =============================================================================
// 🏎️ EQUIPOS (TEAMS)
// =============================================================================
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

// =============================================================================
// 👥 PILOTOS (LINEUPS)
// =============================================================================
// Modifica los arrays directamente para actualizar las alineaciones.
// teamId debe coincidir con los id de arriba (rb, merc, ferrari, etc.)

const generateDrivers = (divisionPrefix: string): any[] => {
  return TEAMS.flatMap((team, index) => [
    { id: `${divisionPrefix}-d${index}-1`, name: `Piloto ${index}A`, teamId: team.id, number: 10 + index, country: 'CL' },
    { id: `${divisionPrefix}-d${index}-2`, name: `Piloto ${index}B`, teamId: team.id, number: 80 + index, country: 'AR' },
  ]);
};

export const DIVISIONS: Division[] = [
  { id: 'div1', name: 'División 1 (Elite)', drivers: generateDrivers('D1') },
  { id: 'div2', name: 'División 2 (Pro)', drivers: generateDrivers('D2') },
  { id: 'div3', name: 'División 3 (Challenger)', drivers: generateDrivers('D3') },
  { id: 'div4', name: 'División 4 (Rookie)', drivers: generateDrivers('D4') },
];

// =============================================================================
// 📅 CALENDARIO
// =============================================================================
export const CALENDAR: RaceEvent[] = [
  { id: 'r1', round: 1, country: 'Bahréin', trackName: 'Sakhir', date: '02 MAR', completed: true, format: 'FEATURE', flagUrl: 'https://flagcdn.com/bh.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png' },
  { id: 'r2', round: 2, country: 'Arabia Saudita', trackName: 'Jeddah', date: '09 MAR', completed: true, format: 'FEATURE', flagUrl: 'https://flagcdn.com/sa.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png' },
  { id: 'r3', round: 3, country: 'Australia', trackName: 'Melbourne', date: '24 MAR', completed: true, format: 'SPRINT', flagUrl: 'https://flagcdn.com/au.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png' },
  { id: 'r4', round: 4, country: 'Japón', trackName: 'Suzuka', date: '07 APR', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/jp.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png' },
  { id: 'r5', round: 5, country: 'China', trackName: 'Shanghai', date: '21 APR', completed: false, format: 'INVERTED', flagUrl: 'https://flagcdn.com/cn.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png' },
  { id: 'r6', round: 6, country: 'Miami', trackName: 'Miami Gardens', date: '05 MAY', completed: false, format: 'SPRINT', flagUrl: 'https://flagcdn.com/us.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png' },
  { id: 'r7', round: 7, country: 'Emilia Romagna', trackName: 'Imola', date: '19 MAY', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/it.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png' },
  { id: 'r8', round: 8, country: 'Mónaco', trackName: 'Monaco', date: '26 MAY', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/mc.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png' },
  { id: 'r9', round: 9, country: 'Canadá', trackName: 'Montreal', date: '09 JUN', completed: false, format: 'INVERTED', flagUrl: 'https://flagcdn.com/ca.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png' },
  { id: 'r10', round: 10, country: 'España', trackName: 'Barcelona', date: '23 JUN', completed: false, format: 'FEATURE', flagUrl: 'https://flagcdn.com/es.svg', mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png' },
];

// =============================================================================
// 🏆 CAMPEONES (CARPETA: images/champions)
// =============================================================================
// Usa la ruta local relativa: 'images/champions/NOMBRE_ARCHIVO.jpg'
export const CHAMPIONS: Champion[] = [
  // SEASON 3
  { id: 'c1-s3', name: 'RLS_DARUMA', season: 'S3', division: 'Division 1', teamId: 'rb', imageUrl: 'images/champions/s3-div1.jpg' },
  { id: 'c2-s3', name: 'RLS_PRICE', season: 'S3', division: 'Division 2', teamId: 'ferrari', imageUrl: 'images/champions/s3-div2.jpg' },
  { id: 'c3-s3', name: 'RLS_MATIASTAPIA', season: 'S3', division: 'Division 3', teamId: 'merc', imageUrl: 'images/champions/s3-div3.jpg' },
  { id: 'c4-s3', name: 'CHIKIXD_2', season: 'S3', division: 'Division 4', teamId: 'mclaren', imageUrl: 'images/champions/s3-div4.jpg' },
  
  // SEASON 2
  { id: 'c1-s2', name: 'GhostRider', season: 'S2', division: 'Division 1', teamId: 'merc', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' }, // Ejemplo con URL externa
  { id: 'c2-s2', name: 'SpeedDemon', season: 'S2', division: 'Division 2', teamId: 'rb', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },
  { id: 'c3-s2', name: 'Tifosi_King', season: 'S2', division: 'Division 3', teamId: 'ferrari', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },
  { id: 'c4-s2', name: 'Rookie_One', season: 'S2', division: 'Division 4', teamId: 'haas', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },

  // SEASON 1
  { id: 'c1-s1', name: 'Legendary', season: 'S1', division: 'Division 1', teamId: 'mclaren', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },
  { id: 'c2-s1', name: 'IceMan', season: 'S1', division: 'Division 2', teamId: 'alpine', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },
  { id: 'c3-s1', name: 'ChecoFan', season: 'S1', division: 'Division 3', teamId: 'rb', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },
  { id: 'c4-s1', name: 'VettelLover', season: 'S1', division: 'Division 4', teamId: 'aston', imageUrl: 'https://images.unsplash.com/photo-1574781440813-f96e4745811f?q=80&w=2940&auto=format&fit=crop' },
];

// =============================================================================
// 👷 STAFF / NOSOTROS (CARPETA: images/staff)
// =============================================================================
// Usa la ruta local relativa: 'images/staff/NOMBRE_ARCHIVO.jpg'
export const ADMINS: Admin[] = [
  { id: 'a1', name: 'Alejandro', role: 'Race Director', description: 'Fundador de MRS. Encargado de la normativa y sanciones.', imageUrl: 'images/staff/alejandro.jpg' },
  { id: 'a2', name: 'Beatriz', role: 'Community Manager', description: 'La voz de MRS en redes sociales. Organiza los streams.', imageUrl: 'images/staff/beatriz.jpg' },
  { id: 'a3', name: 'Carlos', role: 'Technical Stewart', description: 'Configuración de servidores y telemetría.', imageUrl: 'images/staff/carlos.jpg' },
];

// =============================================================================
// 📊 RESULTADOS (STANDINGS)
// =============================================================================
export const DIVISION_STANDINGS: DivisionData[] = [
  {
    id: 'div1',
    name: 'División 1 (Elite)',
    standings: {
      drivers: [
        { posicion: 1, id: 'Carlos Perez', equipo: 'Red Bull Racing', puntos: 86 },
        { posicion: 2, id: 'Max Verstappen', equipo: 'Red Bull Racing', puntos: 80 },
      ],
      constructors: [
        { posicion: 1, equipo: 'Red Bull Racing', puntos: 166 },
        { posicion: 2, equipo: 'Ferrari', puntos: 100 },
      ]
    }
  },
  {
    id: 'div2',
    name: 'División 2 (Pro)',
    standings: {
      drivers: [
         { posicion: 1, id: 'Pedro Gaseoso', equipo: 'Alpine', puntos: 50 },
      ],
      constructors: [
         { posicion: 1, equipo: 'Alpine', puntos: 90 },
      ]
    }
  },
];

// =============================================================================
// 🎮 GAME LEADERBOARD
// =============================================================================
export const LEADERBOARD_DEFAULTS: LeaderboardEntry[] = [];
