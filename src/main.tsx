import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { About, Pillars, Projects, Stories, Community, Join } from './sections';
import './styles.css';
import './editorial.css';

const sections = [
  { id: 'quienes-somos', label: 'Quiénes somos' },
  { id: 'investigacion', label: 'Investigación' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'divulgacion', label: 'Divulgación' },
  { id: 'comunidad', label: 'Comunidad' },
  { id: 'unete', label: 'Únete a UINIK' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(window.location.hash.slice(1) || null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const syncHash = () => setSelected(window.location.hash.slice(1) || null);
    window.addEventListener('hashchange', syncHash);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.editorial-section').forEach(section => observer.observe(section));
    return () => { window.removeEventListener('hashchange', syncHash); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  function navigate(id: string | null) {
    setSelected(id === 'inicio' ? null : id);
    setMenuOpen(false);
    // Move keyboard focus out of the collapsed menu and into its destination.
    requestAnimationFrame(() => {
      const destination = document.getElementById(id || 'inicio');
      destination?.setAttribute('tabindex', '-1');
      destination?.focus({ preventScroll: true });
    });
  }
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <a className="brand" href="#inicio" onClick={() => navigate(null)} aria-label="UINIK, inicio">
        <span className="brand-symbol"><img src="/images/logouinikblanco.png" alt="" width="44" height="44" /></span>
        <span>UINIK<span className="brand-caption">CIENCIA · PERSONAS · COMUNIDAD</span></span>
      </a>
      <button ref={menuButton} className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Cerrar −' : 'Menú +'}</button>
      <nav id="main-nav" aria-label="Navegación principal" className={menuOpen ? 'is-open' : ''}>
        <a href="#inicio" onClick={() => navigate(null)} aria-current={!selected || selected === 'inicio' ? 'location' : undefined}>Inicio</a>
        {sections.map(section => <a key={section.id} href={`#${section.id}`} className={section.id === 'unete' ? 'nav-join' : ''} onClick={() => navigate(section.id)} aria-current={selected === section.id ? 'location' : undefined}>{section.label}{section.id === 'unete' && <span aria-hidden="true"> ↗</span>}</a>)}
      </nav>
    </header>
    <main id="contenido" tabIndex={-1}>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-meta"><span>UNA INICIATIVA ESTUDIANTIL. MUCHAS MIRADAS.</span><span className="edition">UINIK / 01</span></div>
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true" /> CIENCIA QUE NOS CONECTA</p>
            <h1 id="hero-title">EL CONOCIMIENTO<br />ES <span className="human">HUMANO.</span></h1>
            <p className="intro">Investigamos, desarrollamos proyectos y transformamos conocimiento científico en historias accesibles para la sociedad.</p>
            <div className="hero-actions"><a className="button" href="#quienes-somos" onClick={() => navigate('quienes-somos')}>Conoce UINIK <span aria-hidden="true">↗</span></a><a className="text-link" href="#unete" onClick={() => navigate('unete')}>Encuentra tu lugar <span aria-hidden="true">↗</span></a></div>
            <p className="margin-note">Distintas disciplinas.<br />Una curiosidad compartida.</p>
          </div>
          <figure className="hero-art">
            <img className="hero-collage" src="/images/uinik-hero-collage.png" width="1182" height="1330" alt="Cuatro personas colaboran: observan una planta con una lupa, comparten un esquema científico y toman notas." fetchPriority="high" />
            <figcaption>Distintas miradas. Un conocimiento compartido.</figcaption>
          </figure>
        </div>
        <div className="hero-footer"><span>EL CONOCIMIENTO AVANZA CUANDO COLABORAMOS.</span><span>INVESTIGAR <b> / </b> CREAR <b> / </b> COMPARTIR</span></div>
      </section>
      <About />
      <Pillars />
      <Projects />
      <Stories />
      <Community />
      <Join />
    </main>
    <footer className="site-footer"><span>UINIK — El conocimiento es humano.</span><a href="#inicio" onClick={() => navigate(null)}>Volver al inicio ↑</a><span>Prototipo · Contenidos de demostración identificados</span></footer>
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
