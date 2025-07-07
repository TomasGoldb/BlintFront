import { useEffect, useState } from 'react';
import axios from 'axios';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function StarRating({ rating }) {
  // Redondea a la media estrella más cercana
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <span style={{ color: '#FFD700', fontSize: 20, marginLeft: 4 }}>
      {'★'.repeat(fullStars)}{halfStar ? '½' : ''}
    </span>
  );
}

export default function Results({ location, ideas, results, setResults, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!results.length && location && ideas.length) {
      buscarLugares();
    } else if (results.length) {
      fetchDetails(results);
    }
    // eslint-disable-next-line
  }, []);

  const buscarLugares = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/find-places`, {
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
          const url = `${import.meta.env.VITE_API_URL}/place-details?place_id=${placeId}`;
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
      <button onClick={onBack} style={{ position: 'absolute', left: 18, top: 18, background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 700, fontSize: 28, cursor: 'pointer', borderRadius: 16, padding: '2px 14px', boxShadow: '0 1px 6px #2563eb11', zIndex: 2, transition: 'background 0.2s' }} title="Volver">
        ←
      </button>
      <div style={{ marginBottom: 24, fontWeight: 700, fontSize: 22, color: 'var(--primary-blue)', textShadow: '0 2px 12px #2563eb22' }}>Lugares sugeridos cerca de tu ubicación:</div>
      {loading && <div style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: 18, margin: '32px 0' }}>Buscando lugares mágicos...</div>}
      {error && <div style={{ color: 'red', fontWeight: 600, margin: '16px 0' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {places.map((place, idx) => (
          <div key={place.id} style={{
            background: 'linear-gradient(120deg, #fff6e5 0%, #e0e7ff 100%)',
            border: '1.5px solid #e0e7ff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 8px 32px #2563eb22, 0 2px 12px #ff7e1b22',
            padding: 0,
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 180,
            display: 'flex',
            alignItems: 'stretch',
            transition: 'box-shadow 0.2s',
          }}>
            {/* Glow */}
            <div style={{ position: 'absolute', top: -40, left: -40, width: 120, height: 120, background: 'radial-gradient(circle, #2563eb22 0%, transparent 80%)', zIndex: 0, filter: 'blur(8px)' }} />
            <div style={{ position: 'absolute', bottom: -40, right: -40, width: 120, height: 120, background: 'radial-gradient(circle, #ff7e1b22 0%, transparent 80%)', zIndex: 0, filter: 'blur(8px)' }} />
            {place.photo && (
              <img src={place.photo} alt={place.name} style={{ width: 160, height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl) 0 0 var(--radius-xl)', boxShadow: '0 2px 16px #2563eb22', background: '#e0e7ff' }} />
            )}
            <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: 22, marginBottom: 6, letterSpacing: '0.01em', textShadow: '0 2px 12px #2563eb22' }}>{place.name}</div>
              <div style={{ color: '#444', margin: '8px 0 10px', fontWeight: 500, fontSize: 16 }}>{place.address}</div>
              {place.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: 16 }}>★</span>
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: 16 }}>{place.rating}</span>
                  <StarRating rating={place.rating} />
                </div>
              )}
              <a href={place.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, var(--accent-orange) 60%, var(--primary-blue) 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: 17,
                borderRadius: 18,
                padding: '10px 28px',
                textDecoration: 'none',
                boxShadow: '0 2px 12px #ff7e1b22',
                letterSpacing: '0.01em',
                marginTop: 18,
                transition: 'background 0.2s',
                filter: 'drop-shadow(0 0 8px #2563eb33)',
              }}>Ver más en Maps</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 