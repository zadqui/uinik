import { mkdir, copyFile, readFile, cp } from 'node:fs/promises';
import { Script } from 'node:vm';
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
for (const page of ['index.html', 'participa.html', 'nosotros.html']) {
 const html = await readFile(new URL('../' + page, import.meta.url), 'utf8');
 const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 if (!scripts.length) throw new Error('No se encontró el script de ' + page);
 for (const [, script] of scripts) new Script(script, { filename: page + '.js' });
 if (/@@[A-Z]+@@/.test(html)) throw new Error('Hay recursos pendientes en ' + page);
 await copyFile(new URL('../' + page, import.meta.url), new URL('../dist/' + page, import.meta.url));
}
await cp(new URL('../public/merch/', import.meta.url), new URL('../dist/merch/', import.meta.url), { recursive: true });
console.log('UINIK: páginas validadas y catálogo de merch copiados a dist.');
