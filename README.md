# UINIK

Sitio editorial en español, escrito en un único archivo HTML con estilos, interacciones, Coolvetica e ilustraciones integrados. Los títulos se muestran en minúsculas. No requiere React ni dependencias de ejecución.

## Desarrollo y publicación

- Abrir index.html directamente en un navegador, o ejecutar npm run dev.
- Ejecutar npm run build para validar el JavaScript y copiar index.html, nosotros.html y participa.html a dist.
- Ejecutar npm run preview para revisar dist en http://127.0.0.1:5173.
- Se puede indicar otro puerto con -- --port 5179.
- En Render: comando npm ci && npm run build; directorio de publicación dist.

## Contenido

La página principal explica qué es UINIK, a quién se dirige y cómo participar. El catálogo contiene 46 proyectos en 10 áreas, con títulos y enfoques técnicos revisados a partir del documento UINIK_50_Proyectos.docx. Se retiraron ORION, el estudio de muérdago y los dos proyectos de voz/corpus en maya yucateco. Incluye búsqueda sin distinción de acentos, filtro por área, carga progresiva y detalle de cada propuesta. Los campos phase (proposal, development, final) y teamSize permiten registrar fase y número de integrantes; se han completado con una distribución ilustrativa solicitada por el usuario: 11 propuestas, 23 en desarrollo y 12 en fase final, con equipos estimados de 4 a 12 personas. Cada registro incluye metadataType: illustrative y la interfaz identifica estos datos como ilustrativos, sin atribuir avances ni integrantes confirmados.

La página nosotros.html cuenta el origen de UINIK y el paso de organización mexicana a comunidad internacional. La portada presenta la comunidad, sus áreas y un catálogo de proyectos con fichas de lectura tipo paper (título, área y resumen). La sección Fotos reserva espacios para imágenes de pláticas, conferencias y eventos, pendientes de recibir. El icono de Discord abre un aviso de migración con acceso a contacto.

Nuestra presencia en el mundo incluye México, España, Reino Unido, Argentina y Colombia. El mapa SVG eleva y etiqueta los cinco países al pasar el cursor, enfocarlos con el teclado o tocarlos. Incluye botones de selección, sin ampliación de México. Un texto debajo cuenta el inicio en Yucatán y la expansión internacional. En pantallas pequeñas se puede desplazar horizontalmente. Los límites se conservan en public/maps; scripts/create-presence-map.mjs regenera presence.svg y sincroniza automáticamente el SVG integrado en index.html. Fuente de límites: https://github.com/johan/world.geo.json.

Nuestros aliados muestra exclusivamente Youth Technology Corps (https://ytcorps.org/), IRISTEM (https://iristem.org/), Technology for {You}th (https://technologyforyouth.org/), FIRST (https://www.firstinspires.org/), Google for Developers (https://developers.google.com/community?hl=es-419#developers-community-map) y GitHub Campus Experts (https://github.com/education/students/campus-expert). Cada tarjeta abre su sitio en otra pestaña. Los originales están en public/partners y sus copias integradas en index.html evitan depender de enlaces externos para cargar las imágenes. Technology for {You}th usa un fondo oscuro para conservar el contraste del logo blanco.

Las tres páginas usan como favicon el logo de UINIK suministrado, integrado en una URL de datos.

La sección Contáctanos enlaza al formulario de participa.html. El destinatario se configura únicamente en el código del formulario, sin mostrar la dirección en los textos del sitio. El formulario usa POST AJAX a FormSubmit para enviar sin abrir una aplicación de correo. Valida campos, evita envíos simultáneos, incluye un campo trampa antispam y mantiene el mensaje si hay un fallo o no se confirma el envío. Solo muestra éxito si FormSubmit devuelve success=true (booleano o texto). La recepción requiere activar el formulario desde el correo que envía FormSubmit al destinatario. La entrega real no se pudo verificar desde el entorno de desarrollo por fallos de resolución DNS de formsubmit.co.

Merch presenta camiseta, polo, taza y alfombrilla a partir de las imágenes aportadas. Los botones abren el mismo formulario con el producto elegido. Es un catálogo de consultas: no se han definido precios, inventario, cobros ni pagos. Las imágenes están en public/merch y el build las copia a dist/merch para cargarlas de forma diferida. Las tarjetas de participación tienen fondo blanco y el botón de Discord usa un logo grande sin contorno.

Los iconos originales de Lucide conservan su licencia en un comentario del HTML. La página respeta la preferencia del sistema para reducir movimiento.

Las imágenes y Coolvetica están integradas en el HTML. DM Sans se solicita a Google Fonts y dispone de una alternativa local. Los archivos de marca aportados se conservan en la repo.
