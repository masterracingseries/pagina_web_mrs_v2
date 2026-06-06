/**
 * useConfig — Hook que carga la configuración dinámica desde GCS.
 *
 * Flujo:
 *  1. Intenta fetchear config.json del bucket de GCS.
 *  2. Si tiene éxito → usa esos datos en toda la app.
 *  3. Si falla (sin internet, bucket caído, JSON malformado)
 *     → usa los valores hardcodeados de constants.ts como fallback.
 *     La web NUNCA queda en blanco.
 *
 * Uso en componentes:
 *   const { config, loading } = useConfig();
 *   const calendario = config.calendario;
 */

import { useState, useEffect } from 'react';
import {
  CURRENT_SEASON,
  IS_SEASON_ACTIVE,
  SHOW_REGISTRATION,
  REGISTRATION_URL,
  LEAGUE_RULES_URL,
  LOGO_URL,
  SOCIAL_LINKS,
  CALENDAR,
  ADMINS,
  CHAMPIONS,
  MEDIA_ITEMS,
} from '../constants';
import { RaceEvent, Admin, Champion, MediaItem } from '../types';

// ─── URL del config.json en GCS ───────────────────────────────
const GCS_BASE_URL  = 'https://storage.googleapis.com/mrs-standings-season3';
const CONFIG_URL    = `${GCS_BASE_URL}/config.json`;
// ──────────────────────────────────────────────────────────────

// ─── Tipos del JSON remoto ─────────────────────────────────────
export interface RemoteConfig {
  liga: {
    temporada_actual : number;
    is_season_active   : boolean;
    show_registration : boolean;
    registration_url  : string;
    league_rules_url : string;
    logo_url         : string;
  };
  social: {
    instagram : string;
    twitch    : string;
    youtube   : string;
    discord   : string;
  };
  calendario  : RaceEvent[];
  noticias    : NewsItem[];
  admins      : Admin[];
  campeones   : Champion[];
}

export interface NewsItem {
  id          : string;
  type        : 'video' | 'banner' | 'article';
  title       : string;
  subtitle    : string;
  badge       : string;
  videoUrl    : string;
  image       : string;
  link        : string;
  linkText    : string;
  description : string;
}

// ─── Configuración fallback (desde constants.ts) ───────────────
const FALLBACK_CONFIG: RemoteConfig = {
  liga: {
    temporada_actual : CURRENT_SEASON,
    is_season_active : IS_SEASON_ACTIVE,
    league_rules_url : LEAGUE_RULES_URL,
    logo_url         : LOGO_URL,
  },
  social: {
    instagram : SOCIAL_LINKS.instagram,
    twitch    : SOCIAL_LINKS.twitch,
    youtube   : SOCIAL_LINKS.youtube,
    discord   : SOCIAL_LINKS.discord,
  },
  calendario : CALENDAR,
  noticias   : [],   // sin noticias en fallback — el Hero no se rompe, queda vacío
  admins     : ADMINS,
  campeones  : CHAMPIONS,
};
// ──────────────────────────────────────────────────────────────

export function useConfig() {
  const [config, setConfig]   = useState<RemoteConfig>(FALLBACK_CONFIG);
  const [loading, setLoading] = useState(true);
  const [source, setSource]   = useState<'remote' | 'fallback'>('fallback');

  useEffect(() => {
    let cancelled = false;

    const fetchConfig = async () => {
      try {
        const res = await fetch(`${CONFIG_URL}?t=${Date.now()}`); // cache-bust
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: RemoteConfig = await res.json();

        if (!cancelled) {
          setConfig(data);
          setSource('remote');
        }
      } catch (err) {
        // Fallo silencioso — el fallback ya está activo
        console.warn('[useConfig] No se pudo cargar config.json remoto, usando fallback.', err);
        if (!cancelled) setSource('fallback');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConfig();
    return () => { cancelled = true; };
  }, []);

  return { config, loading, source };
}
