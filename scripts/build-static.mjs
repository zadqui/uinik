import { mkdir, copyFile, readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
for (const page of ['index.html', 'participa.html']) {
 const html = await readFile(new URL('../' + page, import.meta.url), 'utf8');
 const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 if (!scripts.length) throw new Error('No se encontró el script de ' + page);
 for (const [, script] of scripts) new Script(script, { filename: page + '.js' });
 if (/@@[A-Z]+@@/.test(html)) throw new Error('Hay recursos pendientes en ' + page);
 await copyFile(new URL('../' + page, import.meta.url), new URL('../dist/' + page, import.meta.url));
}
console.log('UINIK: páginas validadas y copiadas a dist.');
