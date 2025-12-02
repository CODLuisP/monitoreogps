import { RecordCount } from '../types';

const SERVER_URLS = {
  '107': 'https://sub.velsat.pe:2096/api/DeviceList/CantidadRegistros',
  '125': 'https://velsat.pe:2096/api/DeviceList/CantidadRegistros'
};

export const fetchRecordCounts = async (server: '107' | '125'): Promise<RecordCount[]> => {
  try {
    const response = await fetch(SERVER_URLS[server]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching record counts from server ${server}:`, error);
    return [];
  }
};
