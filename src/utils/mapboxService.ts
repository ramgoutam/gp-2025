export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

export const searchAddress = async (query: string): Promise<MapboxFeature[]> => {
  if (!query) return [];
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${accessToken}&types=address`;

  try {
    const response = await fetch(endpoint);
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