import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: 'var(--radius-lg)',
  marginBottom: 24,
  boxShadow: 'var(--shadow)',
  border: '1.5px solid #e0e7ff',
  overflow: 'hidden',
  background: 'var(--bg-glass)',
};

export default function MapSelector({ location, setLocation, onNext }) {
  const [mapCenter, setMapCenter] = useState(location || { lat: -34.6037, lng: -58.3816 });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    language: 'es',
  });
  const mapRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (isLoaded && window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'ar' }, // Opcional: restringe a Argentina
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLocation({ lat, lng });
          setMapCenter({ lat, lng });
          if (mapRef.current) mapRef.current.panTo({ lat, lng });
        }
      });
    }
  }, [isLoaded, setLocation]);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 18, color: 'var(--primary-blue)' }}>Busca una ubicación:</div>
      <div style={{ marginBottom: 18, position: 'relative', zIndex: 2 }}>
        <input
          ref={inputRef}
          placeholder="Buscar dirección, ciudad, lugar..."
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 24,
            border: '1.5px solid #e0e7ff',
            fontSize: 16,
            fontFamily: 'Poppins',
            boxShadow: '0 2px 8px #2563eb11',
            background: 'var(--bg-glass)',
            outline: 'none',
            fontWeight: 500,
            color: 'var(--primary-blue)',
            marginBottom: 0,
          }}
        />
      </div>
      <div style={containerStyle}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={14}
            onLoad={map => (mapRef.current = map)}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              clickableIcons: false,
              styles: [
                { elementType: 'geometry', stylers: [{ color: '#f7faff' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#2563eb' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#fff' }] },
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e0e7ff' }] },
                { featureType: 'water', stylers: [{ color: '#dbeafe' }] },
              ],
            }}
          >
            {location && (
              <Marker
                position={location}
                icon={{
                  url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png',
                  scaledSize: { width: 36, height: 36 },
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div style={{ padding: 40, color: '#aaa' }}>Cargando mapa...</div>
        )}
      </div>
      <button
        style={{
          marginTop: 24,
          background: 'linear-gradient(90deg, var(--primary-blue) 60%, var(--accent-orange) 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 38px',
          fontWeight: 700,
          fontSize: 18,
          cursor: location ? 'pointer' : 'not-allowed',
          opacity: location ? 1 : 0.5,
          boxShadow: '0 2px 16px #2563eb22',
          letterSpacing: '0.01em',
          transition: 'background 0.2s',
        }}
        disabled={!location}
        onClick={onNext}
      >
        Siguiente
      </button>
    </div>
  );
} 