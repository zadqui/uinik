import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const args = process.argv.slice(2);
const pi = args.indexOf('--port');
const port = Number(pi >= 0 ? args[pi + 1] : process.env.PORT || 5173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto inválido.');
const file = new URL(args.includes('--production') ? '../dist/index.html' : '../index.html', import.meta.url);
createServer(async (req, res) => {
 const path = new URL(req.url || '/', 'http://localhost').pathname;
 if (path !== '/' && path !== '/index.html') {res.writeHead(404);res.end('No encontrado');return;}
 if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try {const html=await readFile(file);res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:html);}
 catch {res.writeHead(500);res.end('Ejecuta npm run build antes de la vista previa.');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
