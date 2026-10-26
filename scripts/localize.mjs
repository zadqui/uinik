import { readFile, writeFile } from 'node:fs/promises';
import { copy } from './translations.mjs';
import { categories, projects } from './project-translations.mjs';
import { membershipCopy } from './membership-translations.mjs';

const pages=['index.html','nosotros.html','participa.html','afiliados.html'];
const spacing={' personas':' people',' de ':' of ',' propuestas':' projects',' (abre en otra pestaña)':' (opens in a new tab)',' con el logo de UINIK sobre fondo naranja':' with the UINIK logo on an orange background'};
const dictionary=[...copy,...membershipCopy].filter(([key])=>key!=='de').map(([key,value])=>[key,spacing[key]??value]).sort((a,b)=>b[0].length-a[0].length);
function translate(html){
 const assets=[];
 html=html.replace(/data:[^\s"']+/g,value=>`__ASSET_${assets.push(value)-1}__`);
 const catalog=html.match(/const projectCatalog=(\[[\s\S]*?\]);/);
 if(catalog){
  const records=JSON.parse(catalog[1]).map(p=>{
   if(!projects[p.id]||!categories[p.category])throw Error('Missing project translation: '+p.id+' '+p.category);
   return{...p,title:projects[p.id][0],description:projects[p.id][1],category:categories[p.category]};
  });
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
 html=html.replace(/<script data-language-routing>[\s\S]*?<\/script>/g,'').replace(/<nav class="language-switch"[\s\S]*?<\/nav>/g,'');
 const route=`<script data-language-routing>(function(){const language=${JSON.stringify(lang)},page=${JSON.stringify(page)};try{const saved=localStorage.getItem('uinik-language');if(saved&&saved!==language&&['en','es'].includes(saved))location.replace((saved==='es'?'/es/':'/')+page+location.search+location.hash)}catch{}document.addEventListener('click',function(event){const link=event.target.closest('[data-language]');if(!link)return;try{localStorage.setItem('uinik-language',link.dataset.language)}catch{}const target=new URL(link.href);target.search=location.search;target.hash=location.hash;link.href=target.href;});})();</script>`;
 html=html.replace('</head>',`<link rel="alternate" hreflang="en" href="https://uinik.onrender.com/${page}"><link rel="alternate" hreflang="es" href="https://uinik.onrender.com/es/${page}">${route}</head>`);
 const label=lang==='es'?'Idioma':'Language';
 const nav=`<nav class="language-switch" aria-label="${label}"><a href="/${page}" data-language="en" lang="en"${lang==='en'?' aria-current="true"':''}>EN</a><span aria-hidden="true">/</span><a href="/es/${page}" data-language="es" lang="es"${lang==='es'?' aria-current="true"':''}>Español</a></nav>`;
 html=html.replace('</header>',nav+'</header>');
 html=html.replace('</style>',`\n.language-switch{display:flex;align-items:center;gap:8px;flex-shrink:0;font:14px 'DM Sans',Arial,sans-serif;margin-left:18px;color:#eee7da}.language-switch a{padding:7px 2px;text-decoration:none;opacity:.65}.language-switch a[aria-current]{opacity:1;border-bottom:2px solid #e85b3b}.language-switch a:hover{opacity:1}.site-nav{gap:12px}.nav-links{margin-left:auto}.language-switch span{opacity:.4}@media(min-width:761px) and (max-width:1300px){.nav-links{gap:10px;font-size:11px}.nav-cta{padding:10px}.language-switch{font-size:12px;margin-left:6px}header.site-nav{padding-left:3%;padding-right:3%}}@media(max-width:760px){.language-switch{font-size:13px;margin-left:0}.site-nav .menu{margin-left:auto}.site-nav .logo{margin-right:auto}header.site-nav{gap:12px}header>a.text-link{font-size:12px;max-width:130px}}\n</style>`);
 return html.replaceAll('src="merch/','src="/merch/');
}
for(const page of pages){
 const sourceUrl=new URL('../locales/es/'+page,import.meta.url);
 let source=await readFile(sourceUrl,'utf8');
 source=source.replace('tama?os de equipo son estimaciones seg?n','tamaños de equipo son estimaciones según').replaceAll(' ? ilustrativa',' · ilustrativa');
 await writeFile(new URL('../'+page,import.meta.url),decorate(translate(source),page,'en'));
 await writeFile(new URL('../es/'+page,import.meta.url),decorate(source,page,'es'));
}
console.log('English default and Spanish pages generated.');
