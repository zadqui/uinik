import { useState, type FormEvent } from 'react';

function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return <header className="section-heading"><p className="eyebrow">{number} / {label}</p><h2>{title}</h2></header>;
}

export function About() {
  return <section className="about editorial-section" id="quienes-somos" aria-labelledby="about-title">
    <p className="eyebrow">01 / QUIÉNES SOMOS</p>
    <div className="about-layout"><h2 id="about-title">LAS IDEAS TIENEN<br />MUCHAS <span>VOCES.</span></h2>
      <div className="about-copy"><p className="lead">Somos una organización académica multidisciplinaria nacida de una iniciativa estudiantil.</p><p>Nos reúne la curiosidad y la convicción de que el conocimiento avanza cuando distintas disciplinas colaboran. Investigamos, desarrollamos proyectos y acercamos la ciencia a la sociedad.</p><p>Detrás de cada pregunta hay alguien que observa. Detrás de cada proyecto, personas que se encuentran.</p><a className="text-link" href="#comunidad">Conoce nuestra comunidad <span aria-hidden="true">↘</span></a></div>
    </div>
    <p className="manifesto-note">La ciencia también empieza con una conversación.</p>
  </section>;
}

const pillars = [
  { number: '01', verb: 'PREGUNTAR.', title: 'Investigación científica', text: 'Explorar problemas, formular preguntas y desarrollar propuestas que generen conocimiento. Cada disciplina aporta una forma de mirar.', link: 'Explorar proyectos', target: '#proyectos' },
  { number: '02', verb: 'HACER.', title: 'Desarrollo e innovación', text: 'Convertir ideas en proyectos, prototipos y herramientas. Reunir distintas habilidades para construir soluciones y aprender en el proceso.', link: 'Conocer las propuestas', target: '#proyectos' },
  { number: '03', verb: 'CONTAR.', title: 'Divulgación científica', text: 'Transformar investigaciones propias y de otras instituciones en historias rigurosas y accesibles, también para quienes aún no se sienten cerca de la ciencia.', link: 'Acercarse a las historias', target: '#divulgacion' },
];

export function Pillars() {
  return <section className="pillars editorial-section" id="investigacion" aria-label="Investigación y nuestros tres pilares">
    <SectionHeading number="02" label="TRES FORMAS DE CONSTRUIR CONOCIMIENTO" title="DE LA PREGUNTA A LA HISTORIA." />
    <div className="pillar-grid">{pillars.map(pillar => <article className="pillar" key={pillar.number}><span className="index-number">{pillar.number}</span><h3>{pillar.verb}</h3><h4>{pillar.title}</h4><p>{pillar.text}</p><a className="text-link" href={pillar.target}>{pillar.link} <span aria-hidden="true">↗</span></a></article>)}</div>
  </section>;
}

const projects = [
  { id: 'orion', name: 'ORION', academic: 'Sistema de inteligencia artificial orientado al apoyo personalizado de personas autistas', category: 'Inteligencia artificial · Diseño inclusivo', problem: '¿Cómo explorar herramientas de apoyo que reconozcan necesidades y preferencias individuales?', disciplines: 'Computación, psicología y diseño de interacción.', participants: 'Perfiles ilustrativos: estudiantes de computación, especialistas en autismo y personas con experiencia vivida. No representa un equipo confirmado.', approach: 'Esta ficha propone un espacio para documentar necesidades, participación de usuarios, criterios de diseño y evaluación. No describe una herramienta validada ni ofrece recomendaciones clínicas.' },
  { id: 'muerdago', name: 'MUÉRDAGO EN LA CIUDAD DE MÉXICO', academic: 'Estudio del impacto del muérdago en el arbolado urbano y posibles estrategias de monitoreo', category: 'Ecología urbana · Análisis de datos', problem: '¿Cómo organizar la observación del arbolado urbano para estudiar su relación con el muérdago?', disciplines: 'Biología, ciencias ambientales y análisis de datos.', participants: 'Perfiles ilustrativos: estudiantes de biología, especialistas en arbolado y colaboradores de campo. No representa un equipo confirmado.', approach: 'Esta ficha permite plantear preguntas de investigación, definir un protocolo de observación y describir futuras estrategias de monitoreo. No presenta muestreos ni resultados científicos obtenidos.' },
];

export function Projects() {
  const [filter, setFilter] = useState('todos');
  const shown = projects.filter(project => filter === 'todos' || project.id === filter);
  return <section className="projects editorial-section" id="proyectos" aria-label="Proyectos">
    <div className="section-top"><SectionHeading number="03" label="LABORATORIO DE IDEAS" title="PREGUNTAS QUE NOS MUEVEN." /><p className="section-aside">Una pregunta abre un camino.<br />La colaboración permite recorrerlo.</p></div>
    <p className="demo-label">CONTENIDO DE DEMOSTRACIÓN · Fichas ficticias basadas en los ejemplos del encargo. Sin resultados ni equipos confirmados.</p>
    <div className="project-filters" role="group" aria-label="Filtrar proyectos">{[{ id: 'todos', label: 'Todos' }, { id: 'orion', label: 'Inteligencia artificial' }, { id: 'muerdago', label: 'Ecología urbana' }].map(item => <button type="button" key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
    <p className="filter-status" role="status">{shown.length} {shown.length === 1 ? 'propuesta ilustrativa' : 'propuestas ilustrativas'}</p>
    <div className="project-list">{shown.map(project => <article className={`project project-${project.id}`} key={project.id}>
      <div className="project-title"><p className="eyebrow">{project.category}</p><h3>{project.name}</h3><span className="project-status">Propuesta ilustrativa</span></div>
      <div className="project-copy"><p className="academic-title">{project.academic}</p><p>{project.problem}</p><details><summary>Explorar la ficha <span aria-hidden="true">+</span></summary><dl><dt>Disciplina</dt><dd>{project.disciplines}</dd><dt>Participantes</dt><dd>{project.participants}</dd><dt>Enfoque propuesto</dt><dd>{project.approach}</dd><dt>Estado</dt><dd>Demostración ficticia. Investigación no concluida.</dd></dl></details></div>
    </article>)}</div>
  </section>;
}

const stories = [
  { number: '01', format: 'GUION DOCUMENTAL · CONCEPTO', title: 'La ciudad también hace preguntas.', intro: 'Una caminata, un árbol y una pregunta sobre lo que solemos pasar de largo.', body: 'Esta propuesta editorial comienza a la altura de la banqueta: observar, registrar preguntas y escuchar a quienes estudian el arbolado. El relato conectaría la experiencia cotidiana con el proceso de investigación, mostrando cómo se construye una pregunta antes de buscar una respuesta.', next: 'Para producirla: seleccionar una investigación verificable, acordar entrevistas y revisar el guion con especialistas. No hay documental publicado ni estudio citado todavía.' },
  { number: '02', format: 'ENSAYO VISUAL · CONCEPTO', title: '¿Quién está detrás de una idea?', intro: 'Una historia sobre las personas, los desacuerdos y los encuentros que hacen posible investigar.', body: 'La propuesta sigue el recorrido de una pregunta entre distintas disciplinas. Una libreta, una conversación y un primer prototipo pueden servir de hilo narrativo para contar las decisiones de un equipo, sus dudas y lo que aprende mientras trabaja.', next: 'Para producirla: documentar un proyecto real con consentimiento de sus participantes y contrastar cada afirmación. Este texto es una sinopsis de demostración, no un reportaje realizado.' },
];

export function Stories() {
  return <section className="stories editorial-section" id="divulgacion" aria-label="Divulgación científica">
    <SectionHeading number="04" label="CIENCIA PARA COMPARTIR" title="LA CIENCIA TIENE HISTORIAS." />
    <div className="stories-intro"><p className="lead">Para acercarse a la ciencia, a veces hace falta una buena historia.</p><p>Queremos contar qué se investiga, cómo se hace y por qué nos toca. Con contexto, rigor y espacio para la curiosidad.</p></div>
    <p className="demo-label">MESA EDITORIAL · Conceptos ficticios de demostración. No son publicaciones ni documentales disponibles.</p>
    <div className="story-spread">{stories.map(story => <article className="story" key={story.number}><div className="story-meta"><span>{story.format}</span><span>{story.number}</span></div><h3>{story.title}</h3><p>{story.intro}</p><details><summary>Leer la propuesta editorial <span aria-hidden="true">↗</span></summary><p>{story.body}</p><p className="story-next">{story.next}</p></details></article>)}</div>
  </section>;
}

export function Community() {
  return <section className="community editorial-section" id="comunidad" aria-labelledby="community-title">
    <p className="eyebrow">05 / MUCHAS DISCIPLINAS. UN PUNTO DE ENCUENTRO.</p>
    <div className="community-layout"><div><h2 id="community-title">TU MIRADA<br />TAMBIÉN <span>CUENTA.</span></h2><p className="lead">La próxima conversación puede empezar contigo.</p><p>Estudiantes y egresados. Investigadores y especialistas. Personas que diseñan, comunican o producen historias. La colaboración necesita diferentes maneras de pensar y hacer.</p><a className="button" href="#unete">Encuentra tu forma de colaborar <span aria-hidden="true">↗</span></a></div>
      <aside className="community-note"><p className="eyebrow">UN ESPACIO PARA ENCONTRARNOS</p><p className="community-quote">«¿Y si lo<br />pensamos<br /><em>juntos?</em>»</p><p>Comparte una pregunta.<br />Aporta tu experiencia.<br />Aprende de otras disciplinas.</p><span className="note-signature">EL CONOCIMIENTO ES HUMANO.</span></aside>
    </div>
    <div className="community-roles" aria-label="Perfiles de la comunidad"><span>Estudiantes</span><span>Egresados</span><span>Investigadores</span><span>Diseñadores</span><span>Comunicadores</span><span>Especialistas</span></div>
  </section>;
}

const ways = [
  { title: 'Investiga', text: 'Comparte una pregunta, explora una disciplina o participa en una propuesta de investigación.' },
  { title: 'Desarrolla', text: 'Aporta al diseño y construcción de prototipos, herramientas y proyectos.' },
  { title: 'Cuenta', text: 'Acerca la ciencia a otras personas mediante escritura, diseño o producción audiovisual.' },
];

export function Join() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return <section className="join editorial-section" id="unete" aria-label="Únete a UINIK">
    <SectionHeading number="06" label="HAY UN LUGAR PARA TI" title="HAGAMOS ALGO JUNTOS." />
    <div className="join-layout"><div className="join-copy"><p className="lead">Trae tu curiosidad.<br />Construyamos desde ahí.</p><p>No importa tu semestre o disciplina. Hay distintas formas de aportar y aprender con otras personas.</p><ol className="collaboration-ways">{ways.map((way, index) => <li key={way.title}><span aria-hidden="true">0{index + 1}</span><div><h3>{way.title}</h3><p>{way.text}</p></div></li>)}</ol></div>
      <div className="join-sheet"><h3>Cuéntanos qué te mueve.</h3><p id="form-notice" className="form-notice">Formulario de demostración: no envía ni guarda tus datos. Usa información ficticia para probarlo.</p>
        <form onSubmit={submit} aria-describedby="form-notice" onChange={() => setSubmitted(false)}>
          <div className="form-row"><label htmlFor="name">Nombre <span>(obligatorio)</span></label><input id="name" name="name" autoComplete="off" required maxLength={100} placeholder="¿Cómo te llamas?" /></div>
          <div className="form-row"><label htmlFor="email">Correo <span>(obligatorio)</span></label><input id="email" name="email" type="email" autoComplete="off" required maxLength={200} placeholder="nombre@ejemplo.com" /></div>
          <div className="form-row"><label htmlFor="interest">Me gustaría colaborar en… <span>(obligatorio)</span></label><select id="interest" name="interest" required defaultValue=""><option value="" disabled>Elige una opción</option><option>Investigación científica</option><option>Desarrollo e innovación</option><option>Divulgación científica</option><option>Quiero explorar cómo colaborar</option></select></div>
          <div className="form-row"><label htmlFor="message">Tu disciplina o una idea que quieras compartir <span>(opcional)</span></label><textarea id="message" name="message" rows={3} maxLength={1500} placeholder="Toda buena conversación empieza con una idea…" /></div>
          <button className="button" type="submit">Probar incorporación <span aria-hidden="true">↗</span></button>
          <p className="form-result" role="status">{submitted ? 'Demostración completada. No se enviaron ni guardaron tus datos. El canal real de incorporación se habilitará más adelante.' : ''}</p>
        </form>
      </div>
    </div>
  </section>;
}
