import { mkdir, copyFile, readFile, cp } from 'node:fs/promises';
import { Script } from 'node:vm';
import { pageRoute } from './clean-routes.mjs';
await import('./localize.mjs');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await mkdir(new URL('../dist/es/', import.meta.url), { recursive: true });
for (const page of ['index.html', 'participa.html', 'nosotros.html', 'afiliados.html', 'es/index.html', 'es/participa.html', 'es/nosotros.html', 'es/afiliados.html']) {
 const html = await readFile(new URL('../' + page, import.meta.url), 'utf8');
 const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
 if (!scripts.length) throw new Error('No se encontró el script de ' + page);
 for (const [, script] of scripts) new Script(script, { filename: page + '.js' });
 if (/@@[A-Z]+@@/.test(html)) throw new Error('Hay recursos pendientes en ' + page);
 await copyFile(new URL('../' + page, import.meta.url), new URL('../dist/' + page, import.meta.url));
 const locale=page.startsWith('es/')?'es':'en';
 const name=page.split('/').at(-1);
 const directory=pageRoute(name,locale).slice(1);
 await mkdir(new URL('../dist/'+directory,import.meta.url),{recursive:true});
 await copyFile(new URL('../'+page,import.meta.url),new URL('../dist/'+directory+'index.html',import.meta.url));
}
await cp(new URL('../public/merch/', import.meta.url), new URL('../dist/merch/', import.meta.url), { recursive: true });
await cp(new URL('../public/membership/', import.meta.url), new URL('../dist/membership/', import.meta.url), { recursive: true });
await copyFile(new URL('./member-certificate.mjs', import.meta.url), new URL('../dist/membership/member-certificate.mjs', import.meta.url));
await cp(new URL('../public/icons/',import.meta.url),new URL('../dist/icons/',import.meta.url),{recursive:true});
await mkdir(new URL('../dist/images/',import.meta.url),{recursive:true});
await copyFile(new URL('../public/images/logouinikblanco.png',import.meta.url),new URL('../dist/images/logouinikblanco.png',import.meta.url));
console.log('UINIK: páginas validadas y catálogo de merch copiados a dist.');
