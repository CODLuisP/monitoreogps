export type RouteName = 'RUTA W' | 'RUTA B' | 'RUTA G' | 'RUTA 22';

export interface Unit {
  id: string;
  plate: string;
  route: RouteName;
  lastReport: string;
  speed: number; // in Km/h
  lat: number;
  lng: number;
  address: string;
  status: 'moving' | 'stopped' | 'offline';
  lastGPSTimestamp: string;
}

export interface AnalysisResult {
  summary: string;
  alerts: string[];
}