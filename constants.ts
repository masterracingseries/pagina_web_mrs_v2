
import { Division, RaceEvent, Team, Champion, Admin, DivisionData, MediaItem, LeaderboardEntry } from './types';

/**
 * 🛠️ SISTEMA DE ACTIVOS (FLUJO MAESTRO)
 */
export const ASSET_PATHS = {
    LOGOS: 'images/logos',
    CHAMPIONS: 'images/champions',
    STAFF: 'images/staff',
    SPONSORS: 'images/sponsors',
    PROMO: 'images/promo'
};

// Usamos ruta relativa explícita para GitHub Pages
export const LOGO_URL = './images/logos/logo.png';

const getImg = (cat: keyof typeof ASSET_PATHS, name: string) => `${ASSET_PATHS[cat]}/${name}`;

export const LEAGUE_RULES_URL = "https://drive.google.com/file/d/1ID1ZR0QDcjwX2cp49wUe1446AgXKPjuR/preview";

export const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/masterracingseries/",
    twitch: "https://www.twitch.tv/masterracingseries",
    youtube: "https://youtube.com/@masterracingseries",
    discord: "#" 
};

export const MEDIA_ITEMS: MediaItem[] = [
    { id: 'm1', type: 'YOUTUBE', url: 'https://www.youtube.com/embed/u2NJDt2tM5M?si=example', title: 'Highlights: Round 3 Australia' },
    { id: 'm2', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1535079934785-644095386349?q=80&w=2940&auto=format&fit=crop', title: 'Photo Finish Bahrain' },
    { id: 'm4', type: 'YOUTUBE', url: 'https://www.youtube.com/embed/546qf7q0yqI?si=example', title: 'Season 4 Trailer' }
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

export const CALENDAR: RaceEvent[] = [
  { 
    id: 'r1', round: 1, country: 'Bahréin', trackName: 'Sakhir', 
    date: '02 MAR', isoDate: '2025-03-02', completed: true, format: 'FEATURE', 
    flagUrl: 'https://flagcdn.com/bh.svg', 
    mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png' 
  },
  { 
    id: 'r2', round: 2, country: 'Arabia Saudita', trackName: 'Jeddah', 
    date: '09 MAR', isoDate: '2025-03-09', completed: true, format: 'FEATURE', 
    flagUrl: 'https://flagcdn.com/sa.svg', 
    mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png' 
  },
  { 
    id: 'r3', round: 3, country: 'Australia', trackName: 'Albert Park', 
    date: '16 MAR', isoDate: '2025-03-16', completed: false, format: 'FEATURE', 
    flagUrl: 'https://flagcdn.com/au.svg', 
    mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png' 
  },
  { 
    id: 'r4', round: 4, country: 'Japón', trackName: 'Suzuka', 
    date: '23 MAR', isoDate: '2025-03-23', completed: false, format: 'SPRINT', 
    flagUrl: 'https://flagcdn.com/jp.svg', 
    mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png' 
  },
  { 
    id: 'r5', round: 5, country: 'China', trackName: 'Shanghai', 
    date: '06 ABR', isoDate: '2025-04-06', completed: false, format: 'FEATURE', 
    flagUrl: 'https://flagcdn.com/cn.svg', 
    mapUrl: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png' 
  },
];

export const CHAMPIONS: Champion[] = [
  { id: 'c1-s3', name: 'RLS_DARUMA', season: 'S3', division: 'Division 1', teamId: 'rb', imageUrl: getImg('CHAMPIONS', 'campeon_div1_season3_rlsdaruma.png') },
  { id: 'c2-s3', name: 'RLS_PRICE', season: 'S3', division: 'Division 2', teamId: 'ferrari', imageUrl: getImg('CHAMPIONS', 'campeon_div2_season3_rlsprice.png') },
  { id: 'c3-s3', name: 'RLS_MATIASTAPIA', season: 'S3', division: 'Division 3', teamId: 'merc', imageUrl: getImg('CHAMPIONS', 'campeon_div3_season3_rlsmatiastapia.png') },
  { id: 'c4-s3', name: 'CHIKIXD_2', season: 'S3', division: 'Division 4', teamId: 'mclaren', imageUrl: getImg('CHAMPIONS', 'campeon_div4_season3_chikixd.png') },
];

export const ADMINS: Admin[] = [
  { id: 'a1', name: 'Alejandro', role: 'Race Director', description: 'Fundador de MRS.', imageUrl: getImg('STAFF', 'alejandro.jpg') },
  { id: 'a2', name: 'Beatriz', role: 'CM', description: 'La voz de MRS.', imageUrl: getImg('STAFF', 'beatriz.jpg') },
];

export const DIVISION_STANDINGS: DivisionData[] = [];
export const LEADERBOARD_DEFAULTS: LeaderboardEntry[] = [];
