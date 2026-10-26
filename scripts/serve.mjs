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
 if (!productImage && !['/', '/index.html', '/participa.html', '/nosotros.html','/es/index.html','/es/participa.html','/es/nosotros.html'].includes(path)) {res.writeHead(404);res.end('Not found');return;}
 if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try {const base=productImage&&!args.includes('--production')?'../public/':root;const content=await readFile(new URL(base + (path === '/' ? 'index.html' : path.slice(1)), import.meta.url));res.writeHead(200,{'Content-Type':productImage?'image/png':'text/html; charset=utf-8','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);}
 catch {res.writeHead(500);res.end('Ejecuta npm run build antes de la vista previa.');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
