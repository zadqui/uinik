# UINIK

Prototipo editorial en español construido con React, TypeScript y Vite. Incluye las siete secciones del encargo, collage original y formulario de demostración sin transmisión ni persistencia.

## Ejecutar

```sh
npm ci
npm run dev
```

Para revisar la versión de producción:

```sh
npm run build
npm run preview -- --port 5173
```

## Verificación en navegador

La prueba utiliza Chrome instalado y Playwright Core como herramienta opcional de desarrollo. No está incorporado a las dependencias de la aplicación:

```sh
npm install --no-save --package-lock=false playwright-core
node scripts/verify-browser.mjs
```

Ejecutar con la vista previa en `http://127.0.0.1:5173`. El script admite `UINIK_QA_URL` y `UINIK_CHROME_PATH` para cambiar la dirección y el ejecutable. Genera capturas en `artifacts/`. Comprueba siete anchos, recortes tipográficos, menú, Escape, foco, filtros, desplegables, validación, ausencia de transmisión y almacenamiento, movimiento reducido y enlaces directos.

## Estado

Compilación y pruebas en Chrome aprobadas. No publicado. Los proyectos y conceptos de divulgación son ejemplos de demostración señalados en la página; se deben sustituir por contenidos revisados antes de una publicación oficial. El formulario no incorpora a nadie ni envía mensajes. No hay recursos visuales esenciales pendientes.

Dirección y arquitectura: `DESIGN.md`. Registro de imágenes: `ASSETS_PENDING.md`.
