export interface MapboxFeature {
  id: string;
  place_name: string;
  properties: any;
  text: string;
  place_type: string[];
  center: [number, number];
}

export interface MapboxResponse {
  features: MapboxFeature[];
}

export const searchAddress = async (query: string): Promise<MapboxFeature[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${process.env.VITE_MAPBOX_ACCESS_TOKEN}&types=address&limit=5`
    );
    
    if (!response.ok) {
      console.error('Mapbox API error:', response.statusText);
      return [];
    }

    const data: MapboxResponse = await response.json();
    return data.features;
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}