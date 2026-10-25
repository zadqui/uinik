# UINIK · dirección e implementación por etapas

La referencia propone tinta negra sobre papel cálido, titulares condensados, recortes orgánicos e ilustraciones humanas. La adaptación web separa el contenido tipográfico del collage para conservar legibilidad y accesibilidad. Negro, blanco y #F4F0E8 dominan; #102E5E subraya lo humano y #FF6B2B introduce acentos pequeños. El logo original se muestra completo sobre negro, sin alterar el archivo ni su geometría.

## Arquitectura prevista

- Inicio: `SiteHeader`, `Hero`, `Pillars`, `FeaturedProjects`, `ScienceStories`, `CommunityInvite`, `SiteFooter`.
- Quiénes somos: origen, filosofía y tres pilares.
- Investigación: preguntas, disciplinas y líneas de trabajo.
- Proyectos: título académico, problemática, disciplina, participantes y estado. Demos explícitas para ORION y muérdago; sin resultados inventados.
- Divulgación: composiciones de revista para artículos, documentales e historias.
- Comunidad: colaboración entre perfiles; cualquier cifra ilustrativa se identificará como tal.
- Únete: modalidades de colaboración y formulario local que no transmite datos.

## Estado de esta entrega

React + TypeScript + Vite, CSS propio sin biblioteca UI. La primera versión es una página continua con las siete secciones enlazables por anclas, compatibles con enlaces directos y el historial del navegador. `src/main.tsx` contiene navegación, hero y pie; `src/sections.tsx` organiza componentes reutilizables para presentación, pilares, proyectos, divulgación, comunidad e incorporación. `SectionHeading` unifica las cabeceras editoriales. Se pueden convertir las secciones en páginas independientes cuando crezca el contenido.

El collage está integrado sin modificar el original. El resto combina tipografía, columnas de revista y un recorte de papel construido en CSS; no requiere nuevas imágenes. No hay recursos visuales esenciales pendientes.

Las fichas ORION y muérdago son demostraciones ficticias claramente identificadas, con filtros y detalles desplegables. Los participantes se expresan como perfiles ilustrativos, sin inventar nombres o equipos. Divulgación presenta dos conceptos editoriales desplegables, sin simular publicaciones disponibles. Comunidad no publica estadísticas ni instituciones aliadas.

El formulario usa validación nativa y confirmación local en memoria; no realiza peticiones ni guarda datos en almacenamiento del navegador. Solicita información ficticia para probarlo y explica el alcance antes de introducir datos.

Adaptación a móvil, tablet y escritorio mediante CSS; foco visible, menú con cierre mediante Escape, enlaces semánticos y detalles nativos accesibles. Animaciones de entrada mediante IntersectionObserver sin ocultar el contenido; `prefers-reduced-motion` desactiva animaciones y desplazamiento suave. Compilación, estructura renderizada y revisión en Chrome verificadas. Se probaron siete anchos de 320 a 1440 px, sin desbordamientos de página ni titulares recortados. Menú móvil, Escape, transferencia de foco al destino, filtros, desplegables, validación del formulario, ausencia de envío y almacenamiento, movimiento reducido y enlaces directos pasaron las comprobaciones. Capturas en `artifacts/` (excluidas de Git). El alcance es Chrome de escritorio con vistas adaptables; no sustituye pruebas en dispositivos físicos u otros motores.

## Desarrollo

`npm install`, `npm run dev`. Verificación: `npm run build`. Las fuentes Barlow Condensed y DM Sans se solicitan a Google Fonts; hay alternativas locales si no hay conexión. No se descargan imágenes externas.
