# UINIK

Sitio editorial en español, escrito en un único archivo HTML con estilos, interacciones, Coolvetica e ilustraciones integrados. Los títulos se muestran en minúsculas. No requiere React ni dependencias de ejecución.

## Desarrollo y publicación

- Abrir index.html directamente en un navegador, o ejecutar npm run dev.
- Ejecutar npm run build para validar el JavaScript y copiar index.html, nosotros.html y participa.html a dist.
- Ejecutar npm run preview para revisar dist en http://127.0.0.1:5173.
- Se puede indicar otro puerto con -- --port 5179.
- En Render: comando npm ci && npm run build; directorio de publicación dist.

## Contenido

La página principal explica qué es UINIK, a quién se dirige y cómo participar. El catálogo reúne 50 ideas para desarrollar en 10 áreas del documento UINIK_50_Proyectos.docx. Incluye búsqueda sin distinción de acentos, filtro por área, carga progresiva y detalle de cada propuesta, sin cifras de participantes.

La página nosotros.html cuenta el origen de UINIK y el paso de organización mexicana a comunidad internacional. La portada presenta la comunidad, sus áreas y un catálogo de proyectos con fichas de lectura tipo paper (título, área y resumen). La sección Fotos reserva espacios para imágenes de pláticas, conferencias y eventos, pendientes de recibir. El icono de Discord abre un aviso de migración con acceso a contacto.

Nuestra presencia en el mundo incluye México, Yucatán, España, Londres (Reino Unido), Argentina y Colombia. El mapa SVG incluye una ampliación de México y se puede desplazar horizontalmente en pantallas pequeñas. Los límites se conservan en public/maps; scripts/create-presence-map.mjs permite regenerar presence.svg. El SVG está integrado en index.html: si se regenera, hay que sustituir también el SVG de la sección presencia antes de compilar. Fuentes de límites: https://github.com/johan/world.geo.json y https://github.com/angelnmara/geojson.

Nuestros aliados muestra los siete logotipos aportados por el usuario. Los PNG originales están en public/partners y sus copias integradas en index.html evitan depender de enlaces externos durante la visita. Penn Climate y Northeastern se muestran sobre fondo oscuro para conservar el contraste de sus textos blancos.

La sección Contáctanos enlaza al formulario de participa.html. El destinatario se configura únicamente en el código del formulario, sin mostrar la dirección en los textos del sitio. El formulario valida los campos y prepara un correo mediante mailto: el visitante debe enviarlo desde su aplicación de correo. Incluye vista del mensaje y opción de copiarlo. No hay backend de envío ni almacenamiento de solicitudes.

Los iconos originales de Lucide conservan su licencia en un comentario del HTML. La página respeta la preferencia del sistema para reducir movimiento.

Las imágenes y Coolvetica están integradas en el HTML. DM Sans se solicita a Google Fonts y dispone de una alternativa local. Los archivos de marca aportados se conservan en la repo.
