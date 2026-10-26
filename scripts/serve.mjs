import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const args = process.argv.slice(2);
const pi = args.indexOf('--port');
const port = Number(pi >= 0 ? args[pi + 1] : process.env.PORT || 5173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto inválido.');
const root = args.includes('--production') ? '../dist/' : '../';
createServer(async (req, res) => {
 let path = new URL(req.url || '/', 'http://localhost').pathname;
 if(path==='/es/')path='/es/index.html';
 const productImage = /^\/merch\/(camiseta|polo|taza|alfombrilla)\.png$/.test(path);
 const membershipAsset = /^\/membership\/[a-zA-Z0-9_.-]+\.(pdf|mjs|js|ttf|woff2?)$/.test(path);
 if (!productImage && !membershipAsset && !['/', '/index.html', '/participa.html', '/nosotros.html','/afiliados.html','/es/index.html','/es/participa.html','/es/nosotros.html','/es/afiliados.html'].includes(path)) {res.writeHead(404);res.end('Not found');return;}
 if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try {
 const production=args.includes('--production');
 const base=(productImage||membershipAsset)&&!production?'../public/':root;
 const file=membershipAsset&&!production&&path==='/membership/member-certificate.mjs'?new URL('./member-certificate.mjs',import.meta.url):new URL(base+(path==='/'?'index.html':path.slice(1)),import.meta.url);
 const content=await readFile(file);
 const contentType=productImage?'image/png':membershipAsset?(path.endsWith('.pdf')?'application/pdf':path.endsWith('.ttf')?'font/ttf':path.endsWith('.woff2')?'font/woff2':path.endsWith('.woff')?'font/woff':'text/javascript; charset=utf-8'):'text/html; charset=utf-8';
 res.writeHead(200,{'Content-Type':contentType,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);
 }
 catch {res.writeHead(500);res.end('Ejecuta npm run build antes de la vista previa.');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
