import { readFile, writeFile } from 'node:fs/promises';
import { copy } from './translations.mjs';
import { loadCatalogues } from './database.mjs';
import { membershipCopy } from './membership-translations.mjs';
import { pageRoute } from './clean-routes.mjs';

const pages=['index.html','nosotros.html','participa.html','afiliados.html'];
const catalogues=await loadCatalogues();
const spacing={' personas':' people',' de ':' of ',' propuestas':' projects',' (abre en otra pestaña)':' (opens in a new tab)',' con el logo de UINIK sobre fondo naranja':' with the UINIK logo on an orange background'};
const dictionary=[...copy,...membershipCopy].filter(([key])=>key!=='de').map(([key,value])=>[key,spacing[key]??value]).sort((a,b)=>b[0].length-a[0].length);
function translate(html){
 const assets=[];
 html=html.replace(/data:[^\s"']+/g,value=>`__ASSET_${assets.push(value)-1}__`);
 const catalog=html.match(/const projectCatalog=(\[[\s\S]*?\]);/);
 if(catalog){
  const records=catalogues.en;
  html=html.replace(catalog[0],'__PROJECT_CATALOG__');
  assets.push('const projectCatalog='+JSON.stringify(records)+';');
 }
 for(const [es,en]of dictionary)html=html.split(es).join(en);
 html=html.replaceAll('>de<','>to<').replaceAll("toLocaleLowerCase('es')","toLocaleLowerCase('en')").replaceAll("toLocaleUpperCase('es')","toLocaleUpperCase('en')");
 html=html.replace(/__ASSET_(\d+)__/g,(_,i)=>assets[Number(i)]);
 if(catalog)html=html.replace('__PROJECT_CATALOG__',assets.at(-1));
 return html.replace('<html lang="es">','<html lang="en">');
}
function decorate(html,page,lang){
 const clean=pageRoute(page,lang);
 html=html.replace(/<script data-language-routing>[\s\S]*?<\/script>/g,'').replace(/<nav class="language-switch"[\s\S]*?<\/nav>/g,'');
 const routes={en:pageRoute(page,'en'),es:pageRoute(page,'es')};
 const route=`<script data-language-routing>(function(){const language=${JSON.stringify(lang)},routes=${JSON.stringify(routes)},clean=${JSON.stringify(clean)};let destination=clean;try{const saved=localStorage.getItem('uinik-language');if(['en','es'].includes(saved))destination=routes[saved]}catch{}if(location.pathname!==destination)location.replace(destination+location.search+location.hash);document.addEventListener('click',function(event){const link=event.target.closest('[data-language]');if(!link)return;try{localStorage.setItem('uinik-language',link.dataset.language)}catch{}const target=new URL(link.href);target.search=location.search;target.hash=location.hash;link.href=target.href;});})();</script>`;
 html=html.replace('</head>',`<link rel="canonical" href="https://uinik.onrender.com${clean}"><link rel="alternate" hreflang="en" href="https://uinik.onrender.com${routes.en}"><link rel="alternate" hreflang="es" href="https://uinik.onrender.com${routes.es}">${route}</head>`);
 const label=lang==='es'?'Idioma':'Language';
 const nav=`<nav class="language-switch" aria-label="${label}"><a href="${routes.en}" data-language="en" lang="en"${lang==='en'?' aria-current="true"':''}>EN</a><span aria-hidden="true">/</span><a href="${routes.es}" data-language="es" lang="es"${lang==='es'?' aria-current="true"':''}>Español</a></nav>`;
 html=html.replace('</header>',nav+'</header>');
 html=html.replace('</style>',`\n.language-switch{display:flex;align-items:center;gap:8px;flex-shrink:0;font:14px 'DM Sans',Arial,sans-serif;margin-left:18px;color:#eee7da}.language-switch a{padding:7px 2px;text-decoration:none;opacity:.65}.language-switch a[aria-current]{opacity:1;border-bottom:2px solid #e85b3b}.language-switch a:hover{opacity:1}.site-nav{gap:12px}.nav-links{margin-left:auto}.language-switch span{opacity:.4}@media(min-width:761px) and (max-width:1300px){.nav-links{gap:10px;font-size:11px}.nav-cta{padding:10px}.language-switch{font-size:12px;margin-left:6px}header.site-nav{padding-left:3%;padding-right:3%}}@media(max-width:760px){.language-switch{font-size:13px;margin-left:0}.site-nav .menu{margin-left:auto}.site-nav .logo{margin-right:auto}header.site-nav{gap:12px}header>a.text-link{font-size:12px;max-width:130px}}\n</style>`);
 html=html.replace(/href="(index|nosotros|participa|afiliados)\.html(?=["?#])/g,(_,name)=>'href="'+pageRoute(name+'.html',lang));
 const styleBlocks=[];
 html=html.replace(/<style>[\s\S]*?<\/style>/g,value=>`__STYLE_${styleBlocks.push(value.replace(/[\u2190\u2191\u2192\u2193\u2197\u2198\u2196\u2199]/g,''))-1}__`);
 const arrows={'\u2190':'arrow-left','\u2191':'arrow-up','\u2192':'arrow-right','\u2193':'arrow-down','\u2197':'arrow-up-right','\u2198':'arrow-down-right','\u2196':'arrow-up-right','\u2199':'arrow-down-right'};
 html=html.replace(/[\u2190\u2191\u2192\u2193\u2197\u2198\u2196\u2199]/g,character=>`<img class="ui-arrow" src="/icons/${arrows[character]}.svg" alt="" aria-hidden="true" width="20" height="20">`);
 html=html.replace(/__STYLE_(\d+)__/g,(_,i)=>styleBlocks[Number(i)]);
 html=html.replace('</style>','\n.ui-arrow{width:20px!important;height:20px;display:inline-block;object-fit:contain;vertical-align:middle;flex-shrink:0}.footer .ui-arrow,.hero .ui-arrow,header .ui-arrow,.discord-section .ui-arrow,.partner-dark .ui-arrow{filter:brightness(0) invert(1)}.hero .btn .ui-arrow,.btn .ui-arrow{filter:none}.back-link{display:flex;align-items:center;gap:8px}\n</style>');
 return html.replaceAll('src="merch/','src="/merch/');
}
for(const page of pages){
 const sourceUrl=new URL('../locales/es/'+page,import.meta.url);
 let source=await readFile(sourceUrl,'utf8');
 if(page==='index.html'){
  const marker='const projectCatalog=__UINIK_PROJECT_CATALOG__;';
  if(!source.includes(marker))throw Error('The homepage must load its project catalogue from data/uinik.sqlite.');
  source=source.replace(marker,'const projectCatalog='+JSON.stringify(catalogues.es)+';');
 }
 source=source.replace('tama?os de equipo son estimaciones seg?n','tamaños de equipo son estimaciones según').replaceAll(' ? ilustrativa',' · ilustrativa');
 await writeFile(new URL('../'+page,import.meta.url),decorate(translate(source),page,'en'));
 await writeFile(new URL('../es/'+page,import.meta.url),decorate(source,page,'es'));
}
console.log('English default and Spanish pages generated.');
