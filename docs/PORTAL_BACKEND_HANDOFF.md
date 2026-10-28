# Portal UINIK: entrega para revisión de backend y seguridad

## Lo entregado en esta etapa

Maqueta estática bilingüe en `/portal/` y `/es/portal/`, con las vistas de acceso, invitación, activación, perfil y panel. Conserva el estilo de UINIK. Se identifica permanentemente como prototipo pendiente de producción.

Los datos de prueba viven únicamente en el DOM y se pierden al recargar. No hay almacenamiento de credenciales, tokens de invitación, sesiones, cookies de acceso, envío de invitaciones ni escritura de perfiles. Los botones recorren vistas de ejemplo. No hay cambios en la configuración de servicios de Render.

Afiliados conserva su invitación mediante `?nombre=` y su consentimiento. Al pulsar la descarga de la constancia, abre el portal de prueba después de iniciar la descarga nativa. Transfiere únicamente el nombre mediante el fragmento de la URL; no es un token. Ese nombre no verifica identidad ni autoriza una cuenta. La constancia local no se debe importar como prueba de activación o aceptación registrada.

La prueba sugiere un identificador `primerNombrePrimerApellido@uinik.org` y muestra una clave de demostración pública basada en el nombre. No crea buzones ni compara, guarda o autentica contraseñas. Para producción, UINIK entregará contraseñas temporales seguras e independientes del nombre, con cambio posterior. Los apellidos compuestos, nombres de estructura distinta y colisiones requerirán revisión administrativa; no se debe asignar un identificador real solo mediante esta heurística.

El perfil de prueba incluye institución, área, grado, semestre, ubicación, resumen, habilidades, ORCID, contacto, redes y publicaciones declaradas por línea. Ofrece cinco avatares SVG originales inspirados en la referencia del usuario. Todos los datos se representan como texto y se pierden al recargar; no están guardados en la base SQLite ni disponibles para otros integrantes.

## Flujo aprobado para la etapa de backend

| Paso | Comportamiento que debe implementar y revisar el equipo responsable |
| --- | --- |
| Administrador invita | Verificar permiso del administrador, registrar destinatario y estado de la invitación, enviar correo mediante un servicio configurado |
| Integrante recibe | Ofrecer estados claros para invitación pendiente, caducada, anulada o ya utilizada; evitar que el nombre de la URL sea la autorización |
| Integrante activa | Verificar la invitación y la identidad destinataria mediante el mecanismo de autenticación que se apruebe; evitar reutilización y creación de cuentas por terceros |
| Completa perfil | Guardar únicamente campos permitidos y aplicar la política de visibilidad; validar los datos en el servidor |
| Accede al panel | Mostrar solo sus asignaciones y publicaciones autorizadas; separar los permisos del integrante y del administrador |
| Cierra o pierde acceso | Aplicar cierre, expiración, recuperación y revocación de acceso revisados; registrar eventos administrativos relevantes |

## Decisiones pendientes antes de escribir autenticación

1. Designar al responsable técnico y al revisor de seguridad.
2. Elegir el mecanismo/proveedor de identidad y la comprobación del correo destinatario, incluyendo recuperación y protección de cuentas administrativas.
3. Definir duración, uso único, reenvío y anulación de invitaciones; definir qué sucede con integrantes ya existentes.
4. Aprobar la matriz de permisos y la política de publicación de nombres, stack, proyectos, ORCID y publicaciones.
5. Definir el registro de aceptación: versión del acuerdo, identidad verificada y fecha del servidor, sin reutilizar como evidencia la casilla del prototipo.
6. Definir el alojamiento del backend y el almacenamiento persistente, manteniendo intacto el despliegue estático hasta una migración revisada.

## Requisitos de revisión de seguridad

- El ciclo de invitación debe ser verificado por el servidor, con caducidad, uso único y posibilidad de anulación. No debe basarse en un nombre o correo editable en la URL.
- La identidad y el vínculo con el destinatario deben verificarse antes de conceder acceso. La elección de mecanismos y el manejo de credenciales requieren implementación y revisión especializadas; esta entrega no incluye código para ello.
- Revisar el ciclo de sesiones, expiración, cierre, invalidación y cambios de privilegios. Revisar transporte seguro, protección de cookies y prevención de fijación de sesión según la solución elegida.
- Proteger las acciones que cambian estado frente a CSRF y comprobar origen/autorización conforme a la arquitectura. La interfaz no debe ser la única comprobación de permisos.
- Comprobar autorización de cada perfil, asignación, documento y publicación. Un integrante no debe poder actuar como otro cambiando un identificador.
- Evitar exposición de secretos en repositorio, HTML, URL o logs; limitar intentos y revisar mensajes de error para no revelar cuentas ajenas.
- Revisar consentimiento, visibilidad, acceso y eliminación de datos personales, además de auditoría administrativa.

Referencias para el equipo de revisión: [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) y [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Datos y persistencia

`data/uinik.sqlite` conserva únicamente el catálogo público y las tablas públicas preparadas. No debe contener credenciales, sesiones, invitaciones privadas ni registros privados de aceptación. Su historial Git es público para quienes accedan al repositorio.

El backend necesitará su almacenamiento privado fuera del directorio público y de Git, permisos de acceso y un volumen persistente. Deben existir migraciones explícitas, una estrategia de escritura concurrente y copias de respaldo verificadas. Los despliegues no deben reemplazar datos en uso con el archivo semilla del repositorio. La exposición pública debe usar una proyección de campos aprobada, nunca entregar el archivo de datos privado.

## Pruebas de aceptación para el backend

- Invitación válida, ausente, manipulada, expirada, anulada y reutilizada; destinatario incorrecto y activaciones concurrentes.
- Usuario no autenticado, integrante y administrador: comprobar la matriz de acceso en servidor para cada operación.
- Intentos de leer/editar otro perfil, asignarse proyectos, modificar autoría o elevar privilegios cambiando IDs o campos enviados.
- Recuperación, cierre de sesión, expiración, invalidación y cambios de permisos según la solución revisada.
- Peticiones de cambio de estado con protección CSRF ausente/incorrecta y solicitudes de origen no autorizado.
- Validación de entradas y salida segura; consultas parametrizadas; límite de intentos y controles contra abuso.
- Guardado, recarga y recuperación de perfiles; cambios concurrentes; migración, respaldo y restauración sin perder datos.
- Confirmar que no aparezcan secretos, datos privados ni identificadores de acceso en HTML estático, cachés, Git o logs.
- Idiomas, móvil, teclado, lector de pantalla y estados vacíos/de error. Confirmar que proyectos ilustrativos no se muestren como asignaciones reales.

## Criterio de paso a producción

La maqueta solo debe conectarse a cuentas reales después de aprobar las decisiones anteriores, implementar el backend fuera de esta entrega, completar las pruebas y obtener revisión de seguridad y del responsable de UINIK. Hasta entonces debe conservar su aviso de prototipo y no recibir credenciales.
