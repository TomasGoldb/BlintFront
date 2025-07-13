import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MapSelector from './components/MapSelector';
import IdeasEditor from './components/IdeasEditor';
import Results from './components/Results';
import SEO from './components/SEO';

function App() {
  return (
    <>
      <SEO />
      <div style={{ minHeight: '100vh', background: 'none' }}>
        <header>
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
        </header>
        <main id="main-content" style={{ maxWidth: 700, margin: '2.5rem auto', padding: '0 1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function Home() {
  const [location, setLocation] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [results, setResults] = useState([]);
  const [step, setStep] = useState(1);

  return (
    <>
      <SEO 
        title="BlintAI - Encuentra lugares ideales con Inteligencia Artificial"
        description="Descubre los mejores lugares cerca de ti usando IA. Selecciona tu ubicación, describe tus intereses y encuentra restaurantes, cafés, parques y más lugares perfectos para ti."
        keywords="IA, inteligencia artificial, lugares, restaurantes, cafés, parques, búsqueda de lugares, recomendaciones, ubicación, mapas, Google Maps"
      />
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1 style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '0.01em', textShadow: '0 4px 24px #2563eb22' }}>Encuentra lugares ideales con IA</h1>
        <p style={{ color: '#444', marginBottom: 32, fontSize: 18, fontWeight: 500, textShadow: '0 2px 8px #fff6e5' }}>Selecciona una ubicación, ingresa tus intereses y deja que la IA haga el resto.</p>
        <article style={{
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
              <IdeasEditor 
                location={location} 
                ideas={ideas} 
                setIdeas={(newIdeas) => {
                  setIdeas(newIdeas);
                  // Limpiar resultados cuando cambian las ideas
                  setResults([]);
                }} 
                onBack={() => setStep(1)} 
                onNext={() => setStep(3)} 
              />
            )}
            {step === 3 && (
              <Results location={location} ideas={ideas} results={results} setResults={setResults} onBack={() => setStep(2)} />
            )}
          </div>
        </article>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <SEO 
        title="Sobre BlintAI - Descubre lugares con Inteligencia Artificial"
        description="Conoce más sobre BlintAI, la aplicación que utiliza inteligencia artificial para encontrar los mejores lugares cerca de ti basándose en tus intereses y ubicación."
        keywords="sobre BlintAI, inteligencia artificial, lugares, recomendaciones, IA"
      />
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1 style={{ color: 'var(--primary-blue)' }}>Sobre BlintAI</h1>
        <article>
          <h2 style={{ color: 'var(--primary-blue)', marginTop: '2rem', fontSize: '1.5rem' }}>¿Qué es BlintAI?</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#444', marginBottom: '2rem' }}>
            BlintAI es una aplicación web innovadora que utiliza inteligencia artificial para ayudarte a descubrir 
            los mejores lugares cerca de tu ubicación. Nuestra tecnología analiza tus intereses y preferencias 
            para recomendarte restaurantes, cafés, parques y otros lugares que se adapten perfectamente a tus gustos.
          </p>
          
          <h2 style={{ color: 'var(--primary-blue)', marginTop: '2rem', fontSize: '1.5rem' }}>¿Cómo funciona?</h2>
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
            <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e0e7ff' }}>
              <h3 style={{ color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>1. Selecciona tu ubicación</h3>
              <p>Elige el área donde quieres encontrar lugares interesantes.</p>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e0e7ff' }}>
              <h3 style={{ color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>2. Describe tus intereses</h3>
              <p>Cuéntanos qué tipo de lugares te gustan o qué actividades quieres hacer.</p>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e0e7ff' }}>
              <h3 style={{ color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>3. Recibe recomendaciones</h3>
              <p>Nuestra IA analiza tus preferencias y te sugiere los lugares perfectos.</p>
            </div>
          </div>
          
          <h2 style={{ color: 'var(--primary-blue)', marginTop: '2rem', fontSize: '1.5rem' }}>Características principales</h2>
          <ul style={{ textAlign: 'left', maxWidth: 600, margin: '1rem auto', fontSize: 18, lineHeight: 1.6 }}>
            <li>✅ Búsqueda inteligente con IA</li>
            <li>✅ Recomendaciones personalizadas</li>
            <li>✅ Integración con Google Maps</li>
            <li>✅ Interfaz intuitiva y fácil de usar</li>
            <li>✅ Gratuito y sin registro</li>
          </ul>
        </article>
      </section>
    </>
  );
}

export default App;
