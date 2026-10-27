# UINIK

Sitio editorial bilingüe, con inglés como idioma inicial y español disponible desde el selector. Usa HTML con estilos, interacciones, Coolvetica e ilustraciones integrados, sin React ni dependencias de ejecución.

## Desarrollo y publicación

- Abrir index.html directamente en un navegador, o ejecutar npm run dev.
- Ejecutar npm run build para generar y validar las cinco páginas en inglés y sus versiones en español dentro de dist/es, además de copiar la merch y los recursos para constancias.
- Ejecutar npm run preview para revisar dist en http://127.0.0.1:5173.
- Se puede indicar otro puerto con -- --port 5179.
- En Render: comando npm ci && npm run build; directorio de publicación dist.

## Idiomas y edición

El contenido fuente en español está en locales/es/index.html, locales/es/nosotros.html, locales/es/participa.html, locales/es/afiliados.html y locales/es/portal.html. Las traducciones generales están en scripts/translations.mjs, scripts/membership-translations.mjs y scripts/portal-translations.mjs; los proyectos y sus traducciones se leen de data/uinik.sqlite. scripts/localize.mjs genera las páginas inglesas en la raíz y las españolas en es/. No editar esas salidas directamente: npm run build las regenera desde las fuentes y la base. El generador del mapa también actualiza la fuente en locales/es.

## Base de datos

`data/uinik.sqlite` es una base SQLite portable, versionada en GitHub, con el catálogo público y estructura de integrantes, stack, proyectos y publicaciones. La compilación valida su integridad y relaciones antes de generar la web. El archivo no se publica en dist. No contiene credenciales ni registros privados; las tablas de perfiles y publicaciones están vacías. Ver [data/README.md](data/README.md) para importación, exportación, respaldos y migración al VPS.

Comandos: `npm run db:validate`, `npm run db:test`, `npm run db:export -- ruta.json`, `npm run db:import -- ruta.json` y `npm run db:backup -- ruta.sqlite`. El registro y la edición de perfiles desde la web requieren un backend futuro; GitHub versiona los cambios confirmados manualmente, no las interacciones de visitantes.

La primera visita a la raíz usa inglés. El selector EN / Español aparece en las cinco páginas, conserva la página, los parámetros del formulario y el ancla al cambiar de idioma, y guarda la preferencia en localStorage. Si el almacenamiento está deshabilitado, los enlaces de cada idioma siguen funcionando. Los textos estáticos, catálogo, mapa, diálogos, accesibilidad y estados del formulario tienen versiones en ambos idiomas.

## Maqueta del portal

`/portal/` y `/es/portal/` permiten revisar las vistas de acceso, invitación, activación, perfil y panel, con el estilo de UINIK. El prototipo no está enlazado desde la web pública y contiene un aviso permanente de que está pendiente de producción. Las vistas son accesibles libremente para revisión: no constituyen un portal protegido.

El perfil y las habilidades se previsualizan solo en memoria. No se solicitan contraseñas, no se envían invitaciones, no se crean cuentas ni sesiones y no se guardan datos del formulario. No se usa el catálogo ilustrativo para simular asignaciones personales reales. La preferencia general de idioma sigue usando localStorage como en el resto del sitio, sin almacenar información del perfil.

Ejecutar `npm run portal:test` después de compilar para comprobar vistas, perfil, habilidades, reinicio y ausencia de transmisión/persistencia del formulario. El flujo existente de Afiliados mediante `?nombre=` se conserva por decisión del usuario.

La etapa de backend queda documentada en [docs/PORTAL_BACKEND_HANDOFF.md](docs/PORTAL_BACKEND_HANDOFF.md): ciclo de invitaciones, verificación de identidad, autorización, sesiones/CSRF, datos persistentes, pruebas y decisiones de revisión pendientes. No se han añadido endpoints de autenticación, tablas de credenciales ni cambios en servicios de Render.

La navegación usa rutas sin extensión: /, /nosotros/, /participa/, /afiliados/ y sus equivalentes bajo /es/. El build genera directorios con index.html para servirlos en hosting estático. Los enlaces antiguos con .html se normalizan a su ruta limpia, conservando parámetros y anclas; el servidor local emite una redirección 308. Los archivos .html de la raíz permanecen como fuentes generadas y compatibilidad, no como destinos de navegación.

## Contenido

La página principal explica qué es UINIK, a quién se dirige y cómo participar. El catálogo contiene 46 proyectos en 10 áreas, con títulos y enfoques técnicos revisados a partir del documento UINIK_50_Proyectos.docx. Se retiraron ORION, el estudio de muérdago y los dos proyectos de voz/corpus en maya yucateco. Incluye búsqueda sin distinción de acentos, filtro por área, carga progresiva y detalle de cada propuesta. Los campos phase (proposal, development, final) y teamSize permiten registrar fase y número de integrantes; se han completado con una distribución ilustrativa solicitada por el usuario: 11 propuestas, 23 en desarrollo y 12 en fase final, con equipos estimados de 4 a 12 personas. Cada registro incluye metadataType: illustrative y la interfaz identifica estos datos como ilustrativos, sin atribuir avances ni integrantes confirmados.

La página nosotros.html cuenta el origen de UINIK y el paso de organización mexicana a comunidad internacional. La portada presenta la comunidad, sus áreas y un catálogo de proyectos con fichas de lectura tipo paper (título, área y resumen). La sección Fotos reserva espacios para imágenes de pláticas, conferencias y eventos, pendientes de recibir. El icono de Discord abre un aviso de migración con acceso a contacto.

Nuestra presencia en el mundo incluye México, España, Reino Unido, Argentina y Colombia. El mapa SVG eleva y etiqueta los cinco países al pasar el cursor, enfocarlos con el teclado o tocarlos. Incluye botones de selección, sin ampliación de México. Un texto debajo cuenta el inicio en Yucatán y la expansión internacional. En pantallas pequeñas se puede desplazar horizontalmente. Los límites se conservan en public/maps; scripts/create-presence-map.mjs regenera presence.svg y sincroniza automáticamente el SVG integrado en index.html. Fuente de límites: https://github.com/johan/world.geo.json.

Nuestros aliados muestra exclusivamente Youth Technology Corps (https://ytcorps.org/), IRISTEM (https://iristem.org/), Technology for {You}th (https://technologyforyouth.org/), FIRST (https://www.firstinspires.org/), Google for Developers (https://developers.google.com/community?hl=es-419#developers-community-map) y GitHub Campus Experts (https://github.com/education/students/campus-expert). Cada tarjeta abre su sitio en otra pestaña. Los originales están en public/partners y sus copias integradas en index.html evitan depender de enlaces externos para cargar las imágenes. Technology for {You}th usa un fondo oscuro para conservar el contraste del logo blanco.

Las cuatro páginas usan como favicon el logo de UINIK suministrado, integrado en una URL de datos.

La sección Contáctanos enlaza al formulario de participa.html. El destinatario se configura únicamente en el código del formulario, sin mostrar la dirección en los textos del sitio. El formulario usa POST AJAX a FormSubmit para enviar sin abrir una aplicación de correo. Valida campos, evita envíos simultáneos, incluye un campo trampa antispam y mantiene el mensaje si hay un fallo o no se confirma el envío. Solo muestra éxito si FormSubmit devuelve success=true (booleano o texto). La recepción requiere activar el formulario desde el correo que envía FormSubmit al destinatario. La entrega real no se pudo verificar desde el entorno de desarrollo por fallos de resolución DNS de formsubmit.co.

Merch presenta camiseta, polo, taza y alfombrilla a partir de las imágenes aportadas. Los botones abren el mismo formulario con el producto elegido. Es un catálogo de consultas: no se han definido precios, inventario, cobros ni pagos. Las imágenes están en public/merch y el build las copia a dist/merch para cargarlas de forma diferida. Las tarjetas de participación tienen fondo blanco y el botón de Discord usa un logo grande sin contorno.

Afiliados permite leer el acuerdo de participación y uso responsable de recursos y aceptarlo expresamente antes de generar una constancia personalizada. Se retiraron sus enlaces del sitio público: se comparte /afiliados/?nombre=Nombre+Completo o /es/afiliados/?nombre=Nombre+Completo por correo. El parámetro nombre se decodifica, normaliza y precarga en el campo y la vista previa; la aceptación sigue desmarcada. Sin un nombre válido en el enlace se deshabilita la generación y se solicita una nueva invitación. Ejemplos: /es/afiliados/?nombre=Natalia+Rubio y /es/afiliados/?nombre=Juan+P%C3%A9rez. Los enlaces antiguos .html conservan el parámetro al redirigirse.

Incluye noindex/nofollow/noarchive y una política no-referrer para no reenviar la URL personalizada a otros sitios. El nombre forma parte de la URL, por lo que la personalización no equivale a una invitación autenticada o firmada. El acuerdo español reproduce el texto proporcionado; la versión inglesa ofrece su traducción. La fecha de incorporación corresponde al día actual en America/Mexico_City. Al editar el nombre se invalida la descarga y se pide aceptar de nuevo.

La constancia se genera localmente con scripts/member-certificate.mjs, pdf-lib, fontkit y Noto Sans, usando la plantilla original en public/membership/template.pdf. Usa el nuevo texto de incorporación proporcionado, con el nombre y la fecha dentro de su primera oración, los compromisos, el uso autorizado de recursos, la propiedad intelectual y la aclaración sobre la relación laboral. El texto añadido se organiza en siete párrafos con separación vertical, una sola tipografía y tamaño y color negro, sin destacar el nombre ni la frase final. El ajuste mide todas las líneas y los espacios para conservar una página sin invadir las firmas. La fecha superior usa la misma tipografía y tamaño. Conserva los elementos gráficos y firmas de la plantilla. El build publica el módulo y sus recursos bajo /membership/. La generación no envía formularios ni crea una entrada central de aceptación; el nombre sí está presente en la URL de invitación. Las pruebas de PDF se guardan en output/pdf y tmp/pdfs, ignorados por Git.

Las flechas de navegación son iconos SVG originales descargados de https://github.com/lucide-icons/lucide/tree/main/icons y conservados en public/icons, junto con su licencia. Se usan imágenes locales en lugar de caracteres de flecha o vectores dibujados para esta edición. Afiliados incluye el logo de UINIK en su cabecera.

Los iconos originales de Lucide conservan su licencia en un comentario del HTML. La página respeta la preferencia del sistema para reducir movimiento.

Las imágenes y Coolvetica están integradas en el HTML. DM Sans se solicita a Google Fonts y dispone de una alternativa local. Los archivos de marca aportados se conservan en la repo.
