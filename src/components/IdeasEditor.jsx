import { useState } from 'react';
import axios from 'axios';

export default function IdeasEditor({ location, ideas, setIdeas, onBack, onNext }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newIdea, setNewIdea] = useState('');

  const handleExtract = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blint/extract-ideas`, { text: input });
      // Suponemos que la API devuelve ideas como string separadas por salto de línea o array
      let extracted = res.data.ideas;
      if (typeof extracted === 'string') {
        extracted = extracted.split(/\n|,|;/).map(i => i.trim()).filter(Boolean);
      }
      setIdeas(extracted);
    } catch (e) {
      setError('No se pudieron extraer ideas.');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (newIdea && !ideas.includes(newIdea)) {
      setIdeas([...ideas, newIdea]);
      setNewIdea('');
    }
  };

  const handleEdit = (idx, value) => {
    const updated = [...ideas];
    updated[idx] = value;
    setIdeas(updated);
  };

  const handleDelete = (idx) => {
    setIdeas(ideas.filter((_, i) => i !== idx));
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
      }}>← Atrás</button>
      <div style={{ marginTop: 40, marginBottom: 16, fontWeight: 600, fontSize: 18, color: 'var(--primary-blue)' }}>Describe brevemente lo que buscas:</div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1.5px solid #e0e7ff', padding: 16, fontFamily: 'Poppins', marginBottom: 12, fontSize: 16, boxShadow: '0 2px 8px #2563eb11', background: 'var(--bg-glass)', resize: 'none' }}
        placeholder="Ej: Quiero un lugar tranquilo para leer y tomar café cerca de un parque"
      />
      <button onClick={handleExtract} disabled={loading || !input} style={{ background: input ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', padding: '12px 32px', fontWeight: 700, fontSize: 16, cursor: input ? 'pointer' : 'not-allowed', opacity: input ? 1 : 0.6, boxShadow: input ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 2px 8px rgba(148, 163, 184, 0.2)', marginBottom: 8, marginTop: 4, letterSpacing: '0.01em', transition: 'all 0.2s ease' }}>
        {loading ? 'Extrayendo...' : 'Extraer ideas'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ margin: '28px 0 10px', fontWeight: 600, color: 'var(--primary-blue)' }}>Ideas clave:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18, justifyContent: 'flex-start', maxWidth: '100%', alignItems: 'flex-start' }}>
        {ideas.map((idea, idx) => (
          <div key={idx} style={{ 
            background: '#2563eb', 
            color: 'white', 
            borderRadius: 20, 
            padding: '6px 16px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)', 
            fontWeight: 600, 
            fontSize: 14,
            margin: '2px',
            whiteSpace: 'nowrap'
          }}>
            <input
              value={idea}
              onChange={e => handleEdit(idx, e.target.value)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                fontWeight: 600, 
                width: `${Math.max(idea.length * 8, 80)}px`,
                fontSize: 14, 
                outline: 'none',
                textAlign: 'center'
              }}
            />
            <button onClick={() => handleDelete(idx)} style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ff7e1b', 
              fontWeight: 700, 
              fontSize: 18, 
              cursor: 'pointer', 
              borderRadius: 12, 
              padding: '0 4px',
              lineHeight: 1
            }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
        <input
          value={newIdea}
          onChange={e => setNewIdea(e.target.value)}
          placeholder="Agregar idea"
          style={{ borderRadius: 32, border: '1.5px solid #e0e7ff', padding: '8px 18px', fontFamily: 'Poppins', fontSize: 15, boxShadow: '0 1px 6px #2563eb11', background: 'var(--bg-glass)' }}
        />
        <button onClick={handleAdd} style={{ background: '#ff7e1b', color: 'white', border: 'none', borderRadius: 32, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 126, 27, 0.3)', letterSpacing: '0.01em', transition: 'all 0.2s ease' }}>Agregar</button>
      </div>
      <button
        onClick={onNext}
        disabled={ideas.length === 0}
        style={{ background: ideas.length ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', padding: '14px 38px', fontWeight: 700, fontSize: 18, cursor: ideas.length ? 'pointer' : 'not-allowed', opacity: ideas.length ? 1 : 0.6, boxShadow: ideas.length ? '0 4px 16px rgba(37, 99, 235, 0.3)' : '0 2px 8px rgba(148, 163, 184, 0.2)', letterSpacing: '0.01em', transition: 'all 0.2s ease' }}
      >
        Buscar lugares
      </button>
    </div>
  );
} 