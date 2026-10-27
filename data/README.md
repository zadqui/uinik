# Base de datos portable de UINIK

`uinik.sqlite` es el único archivo de datos canónico. Es una base SQLite estándar y se versiona en GitHub. Contiene los 46 proyectos públicos actuales y sus traducciones; las tablas de integrantes, habilidades y publicaciones están preparadas, sin personas ni publicaciones ficticias.

Esta copia es **solo para datos públicos**. No guardar contraseñas, sesiones, tokens, correos privados, documentos de identidad ni registros privados de aceptación en este archivo: todo lo que se suba a este repositorio puede ser leído por quien tenga acceso a él. Las constancias de afiliación siguen generándose en el navegador; no se convierten automáticamente en registros de esta base.

## Estructura

| Tabla | Contenido |
| --- | --- |
| `metadata` | Versión de esquema y política de contenido público |
| `categories` | Áreas en español e inglés |
| `projects` | Proyectos, descripciones bilingües, fase y equipo estimados |
| `members` | Perfil público: nombre, biografía, institución, disciplina, rol y ORCID |
| `skills` / `member_skills` | Stack, habilidades y nivel declarado |
| `member_links` | Enlaces públicos del integrante |
| `project_members` | Participantes y rol en cada proyecto |
| `publications` | Título, DOI, enlace, fecha y tipo de publicación |
| `publication_authors` | Autoría y orden de integrantes en publicaciones |
| `project_publications` | Relación entre publicaciones y proyectos |

Los identificadores son estables y las relaciones usan claves foráneas. Los DOI pertenecen a publicaciones y los ORCID a integrantes. La validación comprueba el formato del DOI y el dígito de control del ORCID; no certifica la existencia o autoría de una publicación. Las fases y equipos actuales conservan su marca `illustrative`.

## Uso local

Instalar las dependencias con `npm ci`. Se utiliza `sql.js` para leer SQLite durante la compilación sin instalar un servidor ni extensiones nativas.

```text
npm run db:validate
npm run db:test
npm run db:query -- "SELECT id, title_es FROM projects ORDER BY id"
npm run db:query -- "SELECT id, full_name, orcid FROM members"
```

Para editar de forma portable, exportar una copia JSON temporal, modificar sus registros y volver a importarla. El archivo SQLite sigue siendo la fuente canónica; el JSON es únicamente un formato de intercambio.

```text
npm run db:export -- tmp/pdfs/uinik-public-export.json
npm run db:import -- tmp/pdfs/uinik-public-export.json
npm run db:validate
npm run build
git add data/uinik.sqlite
git commit -m "Actualiza datos publicos de UINIK"
git push origin main
```

La exportación no sobrescribe archivos existentes. La importación valida todo antes de escribir, rechaza campos y tablas desconocidos, crea una copia anterior en `data/backups/`, usa un bloqueo de escritura y reemplaza el archivo de forma atómica. No editar simultáneamente con varios procesos. Las copias de respaldo y archivos temporales están excluidos de Git.

También puede editarse con un cliente SQLite de escritorio, conservando el esquema. Antes de subir cambios, ejecutar siempre `db:validate`, revisar los datos y volver a compilar. Los conflictos Git de este archivo binario requieren elegir una copia e integrar explícitamente los registros; Git no puede fusionar filas automáticamente.

## Respaldo y migración al VPS

```text
npm run db:backup -- data/backups/uinik-before-migration.sqlite
```

1. Conservar una copia validada de `data/uinik.sqlite` y del código.
2. Copiar el archivo al almacenamiento persistente del VPS, fuera del directorio público del sitio.
3. Abrirlo con un controlador SQLite compatible y activar `PRAGMA foreign_keys=ON` en cada conexión. El esquema inicial está en `scripts/database-schema.sql`; no ejecutarlo sobre una base ya poblada.
4. Mantener respaldos independientes de Git para la base en uso. Si más adelante se añaden datos privados, estos deben mantenerse fuera del repositorio; `data/private/` está ignorado para ese propósito.
5. Conectar el backend de autenticación y los permisos antes de permitir cambios desde cuentas de usuario.

El sitio actual es estático: genera su catálogo desde esta base al compilar y no publica el archivo SQLite dentro de `dist`. Todavía no hay inicio de sesión ni escritura de perfiles desde la web. GitHub conserva las versiones que se confirmen mediante commit/push; no recibe automáticamente los cambios de visitantes.
