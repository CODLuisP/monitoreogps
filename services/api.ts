import { Unit, RouteName } from '../types';

const BASE_URL = 'https://villa.velsat.pe:8443/api/DeviceList';

const ROUTE_USERNAMES: Record<RouteName, string> = {
  'RUTA W': 'transporvilla',
  'RUTA B': 'etudvrb',
  'RUTA G': 'etudvrg',
  'RUTA 22': 'etudv22'
};

interface ApiDevice {
  deviceId: string;
  lastGPSTimestamp: string;
  lastValidLatitude: number;
  lastValidLongitude: number;
  lastValidHeading: number;
  lastValidSpeed: number;
  descripcion: string | null;
  direccion: string;
  codgeoact: string | null;
  rutaact: string;
  datosGeocercausu: any;
}

interface ApiResponse {
  fechaActual: string;
  datosDevice: ApiDevice[];
}

const formatUnixTimestamp = (timestamp: string): string => {
  try {
    // The timestamp is in seconds, so multiply by 1000 for milliseconds
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  } catch (e) {
    console.error('Error formatting timestamp:', e);
    return timestamp;
  }
};

export const fetchUnitsByRoute = async (route: RouteName): Promise<{ units: Unit[], timestamp: string }> => {
  const username = ROUTE_USERNAMES[route];
  try {
    const response = await fetch(`${BASE_URL}/${username}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${route}`);
    }
    
    const rawData: ApiResponse = await response.json();
    
    if (!rawData || !Array.isArray(rawData.datosDevice)) {
      console.warn(`Invalid data structure for ${route}`, rawData);
      return { units: [], timestamp: new Date().toISOString() };
    }
    
    const units = rawData.datosDevice.map((device) => ({
      id: device.deviceId,
      plate: device.deviceId, // Using deviceId as plate for now
      route: route,
      lastReport: formatUnixTimestamp(device.lastGPSTimestamp), // Using the device specific timestamp
      speed: device.lastValidSpeed,
      lat: device.lastValidLatitude,
      lng: device.lastValidLongitude,
      address: device.direccion || 'Sin dirección',
      status: (device.lastValidSpeed > 0 ? 'moving' : 'stopped') as 'moving' | 'stopped' | 'offline',
      lastGPSTimestamp: device.lastGPSTimestamp
    }));

    return { units, timestamp: rawData.fechaActual };

  } catch (error) {
    console.error(`Error fetching units for ${route}:`, error);
    return { units: [], timestamp: new Date().toISOString() };
  }
};

export const fetchAllUnits = async (): Promise<{ units: Unit[], timestamp: string }> => {
  const promises = (Object.keys(ROUTE_USERNAMES) as RouteName[]).map(route => 
    fetchUnitsByRoute(route)
  );
  
  const results = await Promise.all(promises);
  
  const allUnits = results.flatMap(r => r.units);
  // Use the timestamp from the first successful response, or current time if all failed
  const timestamp = results.find(r => r.units.length > 0)?.timestamp || new Date().toISOString();
  
  return { units: allUnits, timestamp };
};
