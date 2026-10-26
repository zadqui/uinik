# UINIK

Sitio editorial en español, escrito en un único archivo HTML con estilos, interacciones, Coolvetica e ilustraciones integrados. Los títulos se muestran en minúsculas. No requiere React ni dependencias de ejecución.

## Desarrollo y publicación

- Abrir index.html directamente en un navegador, o ejecutar npm run dev.
- Ejecutar npm run build para validar el JavaScript y copiar index.html y participa.html a dist.
- Ejecutar npm run preview para revisar dist en http://127.0.0.1:5173.
- Se puede indicar otro puerto con -- --port 5179.
- En Render: comando npm ci && npm run build; directorio de publicación dist.

## Contenido

La página principal explica qué es UINIK, a quién se dirige y cómo participar. El catálogo reúne 50 ideas para desarrollar en 10 áreas del documento UINIK_50_Proyectos.docx. Incluye búsqueda sin distinción de acentos, filtro por área, carga progresiva y detalle de cada propuesta, sin cifras de participantes.

La sección Contáctanos y la página participa.html dirigen los mensajes a zadquielchan@gmail.com. El formulario valida los campos y prepara un correo mediante mailto: el visitante debe enviarlo desde su aplicación de correo. Incluye vista del mensaje y opción de copiarlo si no hay una aplicación configurada. No hay backend de envío ni almacenamiento de solicitudes.

Los iconos originales de Lucide conservan su licencia en un comentario del HTML. La página respeta la preferencia del sistema para reducir movimiento.

Las imágenes y Coolvetica están integradas en el HTML. DM Sans se solicita a Google Fonts y dispone de una alternativa local. Los archivos de marca aportados se conservan en la repo.
