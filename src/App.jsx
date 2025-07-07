import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MapSelector from './components/MapSelector';
import IdeasEditor from './components/IdeasEditor';
import Results from './components/Results';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'none' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.5rem 2rem',
        background: 'var(--bg-glass)',
        boxShadow: 'var(--shadow)',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '1.7rem', letterSpacing: '0.02em', textShadow: '0 2px 12px #2563eb33' }}>
          Blint<span style={{ color: 'var(--accent-orange)', textShadow: '0 2px 12px #ff7e1b44' }}>AI</span>
        </Link>
        <Link to="/about" style={{ color: 'var(--primary-blue)', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', borderRadius: 12, padding: '6px 18px', background: 'rgba(37,99,235,0.07)', transition: 'background 0.2s' }}>
          Sobre nosotros
        </Link>
      </nav>
      <main style={{ maxWidth: 700, margin: '2.5rem auto', padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  const [location, setLocation] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [results, setResults] = useState([]);
  const [step, setStep] = useState(1);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '0.01em', textShadow: '0 4px 24px #2563eb22' }}>Encuentra lugares ideales con IA</h1>
      <p style={{ color: '#444', marginBottom: 32, fontSize: 18, fontWeight: 500, textShadow: '0 2px 8px #fff6e5' }}>Selecciona una ubicación, ingresa tus intereses y deja que la IA haga el resto.</p>
      <div style={{
        background: 'var(--bg-glass)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow)',
        padding: 40,
        maxWidth: 520,
        margin: '0 auto',
        border: '1.5px solid #e0e7ff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: -60, left: -60,
          width: 180, height: 180,
          background: 'radial-gradient(circle, #2563eb33 0%, transparent 80%)',
          zIndex: 0,
          filter: 'blur(12px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -60, right: -60,
          width: 180, height: 180,
          background: 'radial-gradient(circle, #ff7e1b33 0%, transparent 80%)',
          zIndex: 0,
          filter: 'blur(12px)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {step === 1 && (
            <MapSelector location={location} setLocation={setLocation} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <IdeasEditor location={location} ideas={ideas} setIdeas={setIdeas} onBack={() => setStep(1)} onNext={() => setStep(3)} />
          )}
          {step === 3 && (
            <Results location={location} ideas={ideas} results={results} setResults={setResults} onBack={() => setStep(2)} />
          )}
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2 style={{ color: 'var(--primary-blue)' }}>Sobre nosotros</h2>
      <p>Próximamente...</p>
    </div>
  );
}

export default App;
