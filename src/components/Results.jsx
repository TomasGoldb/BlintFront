import { useEffect, useState } from 'react';
import axios from 'axios';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function StarRating({ rating }) {
  // Redondea a la media estrella más cercana
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <span style={{ color: '#FFD700', fontSize: 18, marginLeft: 4 }}>
      {'★'.repeat(fullStars)}{halfStar ? '½' : ''}
    </span>
  );
}

export default function Results({ location, ideas, results, setResults, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (location && ideas.length) {
      if (!results.length) {
        buscarLugares();
      } else {
        fetchDetails(results);
      }
    }
    // eslint-disable-next-line
    console.log("ideas", ideas);
  }, [ideas, location, results.length]);

  const buscarLugares = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/blint/find-places`, {
        ideas,
        lat: location.lat,
        lng: location.lng,
      });
      const ids = res.data.place_ids.slice(0, 3);
      setResults(ids);
      fetchDetails(ids);
    } catch (e) {
      setError('No se pudieron buscar lugares.');
      setLoading(false);
    }
  };

  const fetchDetails = async (ids) => {
    setLoading(true);
    setError('');
    try {
      const details = await Promise.all(
        ids.map(async (placeId) => {
          const url = `${API_URL}/api/blint/place-details?place_id=${placeId}`;
          const res = await axios.get(url);
          const p = res.data;
          return {
            id: placeId,
            name: p?.name || 'Lugar',
            rating: p?.rating || null,
            photo: p?.photos?.[0]?.photo_reference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
              : null,
            url: p?.url || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
            address: p?.formatted_address || '',
          };
        })
      );
      setPlaces(details);
    } catch (e) {
      setError('No se pudieron obtener detalles de los lugares.');
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <button onClick={onBack} style={{ 
        position: 'absolute', 
        left: 0, 
        top: -10, 
        background: 'rgba(37,99,235,0.1)', 
        border: 'none', 
        color: 'var(--primary-blue)', 
        fontWeight: 700, 
        fontSize: 16, 
        cursor: 'pointer', 
        borderRadius: 12, 
        padding: '8px 16px', 
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
        transition: 'all 0.2s ease',
        zIndex: 2
      }} title="Volver">← Atrás</button>
      <div style={{ marginTop: 40, marginBottom: 24, fontWeight: 700, fontSize: 22, color: 'var(--primary-blue)', textShadow: '0 2px 12px #2563eb22' }}>Lugares sugeridos cerca de tu ubicación:</div>
      {loading && <div style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: 18, margin: '32px 0' }}>Buscando lugares mágicos...</div>}
      {error && <div style={{ color: 'red', fontWeight: 600, margin: '16px 0' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {places.map((place, idx) => (
          <div key={place.id} style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.12), 0 4px 16px rgba(255, 126, 27, 0.08)',
            padding: 0,
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 420,
            margin: '0 auto',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {place.photo ? (
              <div style={{
                width: '100%',
                height: 170,
                overflow: 'hidden',
                borderTopLeftRadius: 'var(--radius-xl)',
                borderTopRightRadius: 'var(--radius-xl)',
                background: '#f1f5f9',
              }}>
                <img
                  src={place.photo}
                  alt={place.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 14px; font-weight: 600;">Sin imagen</div>';
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: 170,
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                borderTopLeftRadius: 'var(--radius-xl)',
                borderTopRightRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: 14,
                fontWeight: 600,
              }}>
                Sin imagen
              </div>
            )}
            <div style={{ padding: '28px 28px 22px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ color: '#1e293b', fontWeight: 800, fontSize: 22, marginBottom: 8, letterSpacing: '0.01em', lineHeight: 1.2 }}>{place.name}</div>
              <div style={{ color: '#64748b', margin: '10px 0 14px', fontWeight: 500, fontSize: 15, lineHeight: 1.4 }}>{place.address}</div>
              {place.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: '#ff7e1b', fontWeight: 700, fontSize: 17 }}>★</span>
                  <span style={{ color: '#ff7e1b', fontWeight: 700, fontSize: 17 }}>{place.rating}</span>
                  <StarRating rating={place.rating} />
                </div>
              )}
              <a href={place.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block',
                background: '#2563eb',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 18,
                padding: '10px 28px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                letterSpacing: '0.01em',
                marginTop: 16,
                transition: 'all 0.2s ease',
                alignSelf: 'flex-start',
              }}>Ver más en Maps</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 