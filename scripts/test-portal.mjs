import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

for(const language of ['en','es']){
 const html=await readFile(new URL('../'+(language==='es'?'es/':'')+'portal.html',import.meta.url),'utf8');
 const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
 assert(!/\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie/.test(script));
 assert(!/<input[^>]*type="password"/.test(html));
 assert(html.includes('name="robots" content="noindex, nofollow, noarchive"'));
 const views=['access','invitation','activation','profile','dashboard'];
 function element(dataset={}){return{dataset,hidden:false,value:'',checked:false,textContent:'',children:[],handlers:{},attributes:{},addEventListener(type,callback){this.handlers[type]=callback},setAttribute(key,value){this.attributes[key]=value},removeAttribute(key){delete this.attributes[key]},replaceChildren(...children){this.children=children},focus(){this.focused=true}};}
 const panels=views.map(view=>element({panel:view})),steps=views.map(view=>element({view})),actions=views.map(view=>element({next:view}));
 const ids=['profile-name','profile-institution','profile-field','profile-bio','profile-orcid','profile-initials','profile-card-name','profile-card-field','profile-card-bio','profile-card-skills','dashboard-name','dashboard-institution','dashboard-field','dashboard-orcid','dashboard-skills-count','dashboard-skills','dashboard-skills-empty','profile-preview','reset-preview','clear-dashboard'];
 const nodes=Object.fromEntries(ids.map(id=>['#'+id,element()]));
 const skills=[...html.matchAll(/<input type="checkbox" value="[^"]+" name="skill">([^<]+)/g)].map(match=>({...element(),parentElement:{textContent:match[1]}}));
 assert.equal(skills.length,6);
 nodes['#profile-preview'].reset=()=>{for(const id of ['profile-name','profile-institution','profile-field','profile-bio','profile-orcid'])nodes['#'+id].value='';skills.forEach(input=>input.checked=false);};
 const document={querySelector(selector){if(selector.startsWith('[data-panel='))return element();assert(nodes[selector],selector);return nodes[selector];},querySelectorAll(selector){if(selector==='[data-panel]')return panels;if(selector==='[data-view]')return steps;if(selector==='input[name="skill"]')return skills;if(selector==='[data-view],[data-next]')return[...steps,...actions];throw Error(selector);},createElement:()=>element()};
 vm.runInNewContext(script,{document});
 assert.deepEqual(panels.filter(panel=>!panel.hidden).map(panel=>panel.dataset.panel),['access']);
 for(const view of views){steps.find(step=>step.dataset.view===view).handlers.click();assert.deepEqual(panels.filter(panel=>!panel.hidden).map(panel=>panel.dataset.panel),[view]);}
 nodes['#profile-name'].value='Test <img src=x>';nodes['#profile-field'].value='Research';nodes['#profile-bio'].value='Preview text';skills[0].checked=true;skills[1].checked=true;
 nodes['#profile-preview'].handlers.input();assert.equal(nodes['#profile-card-name'].textContent,'Test <img src=x>');assert.equal(nodes['#dashboard-skills-count'].textContent,2);assert.equal(nodes['#dashboard-skills'].children.length,2);
 let prevented=false;nodes['#profile-preview'].handlers.submit({preventDefault(){prevented=true}});assert(prevented);assert(!panels.find(panel=>panel.dataset.panel==='dashboard').hidden);
 nodes['#clear-dashboard'].handlers.click();assert.equal(nodes['#profile-name'].value,'');assert.equal(nodes['#dashboard-skills-count'].textContent,0);assert.equal(nodes['#dashboard-skills'].children.length,0);assert(!panels.find(panel=>panel.dataset.panel==='profile').hidden);
 console.log(language+': five screens, profile preview, skills, reset, safe text rendering and no data transmission/persistence: OK');
}
