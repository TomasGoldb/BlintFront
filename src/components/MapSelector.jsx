import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: 'var(--radius-xl)',
  marginBottom: 24,
  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)',
  border: '2px solid #e0e7ff',
  overflow: 'hidden',
  background: '#ffffff',
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
      
      // Agregar estilos personalizados al autocompletado
      const style = document.createElement('style');
      style.textContent = `
        .pac-container {
          border-radius: 12px !important;
          border: 2px solid #e0e7ff !important;
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.15) !important;
          background: #ffffff !important;
          font-family: 'Poppins', sans-serif !important;
          margin-top: 4px !important;
        }
        .pac-item {
          padding: 12px 16px !important;
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          font-size: 14px !important;
          color: #1e293b !important;
          transition: background-color 0.2s ease !important;
        }
        .pac-item:hover {
          background-color: #f8fafc !important;
        }
        .pac-item-selected {
          background-color: #e0e7ff !important;
          color: #2563eb !important;
          font-weight: 600 !important;
        }
        .pac-item-query {
          font-weight: 600 !important;
          color: #1e293b !important;
        }
        .pac-item-query:before {
          margin-right: 8px !important;
        }
        .pac-matched {
          font-weight: 700 !important;
          color: #2563eb !important;
        }
      `;
      document.head.appendChild(style);
      
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
                { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
                { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#ffffff' }] },
                { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
                { featureType: 'water', stylers: [{ color: '#e0f2fe' }] },
                { featureType: 'landscape', stylers: [{ color: '#f8fafc' }] },
              ],
            }}
          >
            {location && (
              <Marker
                position={location}
                icon={{
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                  fillColor: '#2563eb',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                  scale: 1.5,
                  anchor: { x: 12, y: 24 },
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
          background: location ? '#2563eb' : '#94a3b8',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 38px',
          fontWeight: 700,
          fontSize: 18,
          cursor: location ? 'pointer' : 'not-allowed',
          opacity: location ? 1 : 0.6,
          boxShadow: location ? '0 4px 16px rgba(37, 99, 235, 0.3)' : '0 2px 8px rgba(148, 163, 184, 0.2)',
          letterSpacing: '0.01em',
          transition: 'all 0.2s ease',
        }}
        disabled={!location}
        onClick={onNext}
      >
        Siguiente
      </button>
    </div>
  );
} 