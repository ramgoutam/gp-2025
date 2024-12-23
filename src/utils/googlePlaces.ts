import { toast } from "@/components/ui/use-toast";

export interface PlaceSuggestion {
  place_id: string;
  description: string;
}

let placesService: google.maps.places.AutocompleteService | null = null;
let geocoder: google.maps.Geocoder | null = null;

export const initGooglePlaces = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      placesService = new google.maps.places.AutocompleteService();
      geocoder = new google.maps.Geocoder();
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps JavaScript API'));
    };

    document.head.appendChild(script);
  });
};

export const getPlaceSuggestions = async (
  input: string
): Promise<PlaceSuggestion[]> => {
  if (!placesService) {
    console.error('Places service not initialized');
    return [];
  }

  try {
    const response = await placesService.getPlacePredictions({
      input,
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    return (response?.predictions || []).map(prediction => ({
      place_id: prediction.place_id,
      description: prediction.description
    }));
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    toast({
      title: "Error",
      description: "Failed to fetch address suggestions",
      variant: "destructive",
    });
    return [];
  }
};

export const validateGoogleApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    await initGooglePlaces(apiKey);
    // Try a simple geocoding request to validate the key
    const result = await getPlaceSuggestions('test');
    return true;
  } catch (error) {
    console.error('Google API key validation failed:', error);
    return false;
  }
};