export const pageFiles=['index.html','nosotros.html','participa.html','afiliados.html','portal.html'];

export function pageRoute(page,lang='en'){
 const base=lang==='es'?'/es/':'/';
 return page==='index.html'?base:base+page.replace(/\.html$/,'')+'/';
}

export function pageForPath(path){
 for(const lang of ['en','es'])for(const page of pageFiles){
  const canonical=pageRoute(page,lang),prefix=lang==='es'?'/es/':'/';
  if(path===canonical||path===prefix+page||(canonical!=='/'&&path===canonical.slice(0,-1))||path===canonical+'index.html')return{page,lang,canonical,file:(lang==='es'?'es/':'')+page};
 }
 return null;
}
