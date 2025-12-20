import L from 'leaflet';

// Default center for Hungary (Budapest)
export const DEFAULT_CENTER: [number, number] = [47.4979, 19.0402];
export const DEFAULT_ZOOM = 13;

// Custom marker icons
export const createBottleIcon = (count: number) => {
  return L.divIcon({
    html: `
      <div class="custom-marker-wrapper">
        <div class="custom-marker bottle-marker">
          <div class="marker-content">
            <span class="marker-count" style="
              display: inline-block;
              background: white;
              color: #059669;
              font-weight: 800;
              font-size: 16px;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 3px #10b981, 0 0 0 4px white;
              border: 2px solid #10b981;
              text-shadow: none;
            ">${count}</span>
          </div>
        </div>
        <div class="marker-pulse"></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="custom-marker-wrapper">
        <div class="custom-marker user-location-marker">
          <div class="marker-inner-circle"></div>
        </div>
        <div class="marker-pulse"></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const createSelectedMarkerIcon = (count: number) => {
  return L.divIcon({
    html: `
      <div class="custom-marker-wrapper">
        <div class="custom-marker selected-marker">
          <div class="marker-content">
            <span class="marker-count" style="
              display: inline-block;
              background: white;
              color: #7c3aed;
              font-weight: 900;
              font-size: 18px;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4), 0 0 0 4px #a78bfa, 0 0 0 6px white;
              border: 3px solid #7c3aed;
              text-shadow: none;
              animation: pulse-number 2s ease-in-out infinite;
            ">${count}</span>
          </div>
        </div>
        <div class="marker-pulse active"></div>
      </div>
      <style>
        @keyframes pulse-number {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `,
    className: 'custom-div-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// Format distance for display
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

// Get user's current location
export const getUserLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};
