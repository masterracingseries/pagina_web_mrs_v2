/**
 * ConfigContext — Contexto global de configuración dinámica.
 *
 * Envuelve toda la app en App.tsx con <ConfigProvider>.
 * Cualquier componente puede leer la config con useConfigContext().
 *
 * Ejemplo:
 *   const { config } = useConfigContext();
 *   const admins = config.admins;
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useConfig, RemoteConfig, NewsItem } from '../hooks/useConfig';

interface ConfigContextValue {
  config  : RemoteConfig;
  loading : boolean;
  source  : 'remote' | 'fallback';
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const value = useConfig();
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfigContext debe usarse dentro de <ConfigProvider>');
  return ctx;
}

// Re-exportar el tipo NewsItem para que los componentes lo importen desde acá
export type { NewsItem };
