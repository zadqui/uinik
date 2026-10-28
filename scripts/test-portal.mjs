import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

for(const language of ['en','es']){
 const html=await readFile(new URL('../'+(language==='es'?'es/':'')+'portal.html',import.meta.url),'utf8');
 const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
 assert(!/\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie/.test(script));
 assert(!html.includes('action="/api/'));
 assert(html.includes('name="robots" content="noindex, nofollow, noarchive"'));
 const views=['access','invitation','activation','profile','dashboard'];
 function element(dataset={}){return{dataset,hidden:false,value:'',checked:false,textContent:'',children:[],handlers:{},attributes:{},addEventListener(type,callback){this.handlers[type]=callback},setAttribute(key,value){this.attributes[key]=value},removeAttribute(key){delete this.attributes[key]},replaceChildren(...children){this.children=children},focus(){this.focused=true}};}
 const panels=views.map(view=>element({panel:view})),steps=views.map(view=>element({view})),actions=views.map(view=>element({next:view}));
 const extras=['location','semester','degree','contact','linkedin','github','social'];
 const ids=['profile-name','profile-institution','profile-field','profile-bio','profile-orcid','profile-card-name','profile-card-field','profile-card-bio','profile-card-skills','dashboard-name','dashboard-institution','dashboard-field','dashboard-orcid','dashboard-skills-count','dashboard-skills','dashboard-skills-empty','profile-preview','reset-preview','clear-dashboard','member-heading','member-summary','member-tags','profile-avatar','dashboard-avatar','profile-papers','member-papers','papers-count','papers-empty','trial-email','trial-code','trial-enter',...extras.flatMap(id=>['profile-'+id,'dashboard-'+id])];
 const nodes=Object.fromEntries(ids.map(id=>['#'+id,element()]));
 const skills=[...html.matchAll(/<input type="checkbox" value="[^"]+" name="skill">([^<]+)/g)].map(match=>({...element(),parentElement:{textContent:match[1]}}));
 assert.equal(skills.length,6);
 const avatars=[1,2,3,4,5].map(n=>({...element(),value:String(n),checked:n===1}));
 nodes['#profile-preview'].reset=()=>{for(const id of ids.filter(id=>id.startsWith('profile-')))nodes['#'+id].value='';skills.forEach(input=>input.checked=false);avatars.forEach((input,i)=>input.checked=i===0);};
 const document={querySelector(selector){if(selector.startsWith('[data-panel='))return element();assert(nodes[selector],selector);return nodes[selector];},querySelectorAll(selector){if(selector==='[data-panel]')return panels;if(selector==='[data-view]')return steps;if(selector==='input[name="skill"]')return skills;if(selector==='input[name="avatar"]')return avatars;if(selector==='[data-view],[data-next]')return[...steps,...actions];throw Error(selector);},createElement:()=>element()};
 vm.runInNewContext(script,{document,URLSearchParams,location:{hash:'#nombre=Orlando+Zadquiel+Chan+Villanueva'}});
 assert.equal(nodes['#profile-name'].value,'Orlando Zadquiel Chan Villanueva');
 assert.equal(nodes['#trial-email'].value,'orlandochan@uinik.org');
 nodes['#trial-enter'].handlers.click();assert(!panels.find(panel=>panel.dataset.panel==='profile').hidden);
 steps[0].handlers.click();
 assert.deepEqual(panels.filter(panel=>!panel.hidden).map(panel=>panel.dataset.panel),['access']);
 for(const view of views){steps.find(step=>step.dataset.view===view).handlers.click();assert.deepEqual(panels.filter(panel=>!panel.hidden).map(panel=>panel.dataset.panel),[view]);}
 nodes['#profile-name'].value='Test <img src=x>';nodes['#profile-field'].value='Research';nodes['#profile-bio'].value='Preview text';skills[0].checked=true;skills[1].checked=true;
 nodes['#profile-papers'].value='Paper one | 2026 | 10.1234/example\n<img src=x onerror=alert(1)>';
 nodes['#profile-location'].value='Merida';avatars[0].checked=false;avatars[4].checked=true;
 nodes['#profile-preview'].handlers.input();assert.equal(nodes['#profile-card-name'].textContent,'Test <img src=x>');assert.equal(nodes['#dashboard-skills-count'].textContent,2);assert.equal(nodes['#dashboard-skills'].children.length,2);
 assert.equal(nodes['#papers-count'].textContent,2);assert.equal(nodes['#member-papers'].children[1].textContent,'<img src=x onerror=alert(1)>');assert.equal(nodes['#dashboard-location'].textContent,'Merida');assert.equal(nodes['#dashboard-avatar'].attributes.src,'/icons/member-5.svg');
 let prevented=false;nodes['#profile-preview'].handlers.submit({preventDefault(){prevented=true}});assert(prevented);assert(!panels.find(panel=>panel.dataset.panel==='dashboard').hidden);
 nodes['#clear-dashboard'].handlers.click();assert.equal(nodes['#profile-name'].value,'');assert.equal(nodes['#dashboard-skills-count'].textContent,0);assert.equal(nodes['#dashboard-skills'].children.length,0);assert(!panels.find(panel=>panel.dataset.panel==='profile').hidden);
 assert.equal(nodes['#papers-count'].textContent,0);
 console.log(language+': certificate name handoff, trial identifier, academic profile, publications, five avatars, reset, safe text rendering and no transmission/persistence: OK');
}

for(const language of ['en','es']){
 const html=await readFile(new URL('../'+(language==='es'?'es/':'')+'afiliados.html',import.meta.url),'utf8');
 const script=html.match(/<script>\s*const membershipForm=([\s\S]*?)<\/script>/)[0].replace(/^<script>/,'').replace(/<\/script>$/,'');
 const nodes=new Map();const node=()=>({value:'',checked:false,dataset:{},handlers:{},addEventListener(type,fn){this.handlers[type]=fn},removeAttribute(){},dispatchEvent(event){this.handlers[event.type]?.(event)}});
 const document={documentElement:{lang:language},querySelector(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
 let destination=null;const timers=[];
 const context=vm.createContext({document,URLSearchParams,Intl,Date,Event,location:{search:'?nombre=Orlando+Zadquiel+Chan+Villanueva',assign(url){destination=url;}},addEventListener(){},setTimeout(fn){timers.push(fn);},URL:{revokeObjectURL(){}}});
 vm.runInContext(script,context);
 let prevented=false;nodes.get('#download-certificate').handlers.click({preventDefault(){prevented=true;}});assert(prevented);assert.equal(timers.length,0);
 vm.runInContext("certificateUrl='blob:test';consentInput.checked=true;",context);
 prevented=false;nodes.get('#download-certificate').handlers.click({preventDefault(){prevented=true;}});assert(!prevented);assert.equal(destination,null);timers[0]();
 assert.equal(destination,(language==='es'?'/es/portal/':'/portal/')+'#nombre=Orlando%20Zadquiel%20Chan%20Villanueva');
 console.log(language+': download handoff requires generated certificate and consent; native download allowed before redirect: OK');
}
