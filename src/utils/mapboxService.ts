export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

export const searchAddress = async (query: string): Promise<MapboxFeature[]> => {
  if (!query) return [];
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('Mapbox access token is not defined');
    return [];
  }
  
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${accessToken}&types=address`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      id: feature.id,
      place_name: feature.place_name,
      center: feature.center,
    }));
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
}