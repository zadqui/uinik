import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pageForPath } from './clean-routes.mjs';
const args = process.argv.slice(2);
const pi = args.indexOf('--port');
const port = Number(pi >= 0 ? args[pi + 1] : process.env.PORT || 5173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto inválido.');
const root = args.includes('--production') ? '../dist/' : '../';
createServer(async (req, res) => {
 const requestUrl=new URL(req.url || '/', 'http://localhost');
 const path = requestUrl.pathname;
 const page=pageForPath(path);
 if(page&&path!==page.canonical){res.writeHead(308,{Location:page.canonical+requestUrl.search});res.end();return;}
 const productImage = /^\/merch\/(camiseta|polo|taza|alfombrilla)\.png$/.test(path);
 const membershipAsset = /^\/membership\/[a-zA-Z0-9_.-]+\.(pdf|mjs|js|ttf|woff2?)$/.test(path);
 const iconAsset=/^\/icons\/(arrow-(left|right|up|down|up-right|down-right)|member-[1-5])\.svg$/.test(path);
 const brandAsset=path==='/images/logouinikblanco.png';
 if (!productImage && !membershipAsset && !iconAsset && !brandAsset && !page) {res.writeHead(404);res.end('Not found');return;}
 if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try {
 const production=args.includes('--production');
 const base=(productImage||membershipAsset||iconAsset||brandAsset)&&!production?'../public/':root;
 const file=membershipAsset&&!production&&path==='/membership/member-certificate.mjs'?new URL('./member-certificate.mjs',import.meta.url):new URL(base+(page?page.file:path.slice(1)),import.meta.url);
 const content=await readFile(file);
 const contentType=productImage||brandAsset?'image/png':iconAsset?'image/svg+xml':membershipAsset?(path.endsWith('.pdf')?'application/pdf':path.endsWith('.ttf')?'font/ttf':path.endsWith('.woff2')?'font/woff2':path.endsWith('.woff')?'font/woff':'text/javascript; charset=utf-8'):'text/html; charset=utf-8';
 res.writeHead(200,{'Content-Type':contentType,'Cache-Control':'no-cache',...(page?.page==='afiliados.html'?{'X-Robots-Tag':'noindex, nofollow, noarchive'}:{})});res.end(req.method==='HEAD'?undefined:content);
 }
 catch {res.writeHead(500);res.end('Ejecuta npm run build antes de la vista previa.');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
