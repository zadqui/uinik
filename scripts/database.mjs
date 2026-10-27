import initSqlJs from 'sql.js';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, rename, copyFile, open, unlink } from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const databasePath=fileURLToPath(new URL('../data/uinik.sqlite',import.meta.url));
const require=createRequire(import.meta.url);
const engine=initSqlJs({locateFile:()=>require.resolve('sql.js/dist/sql-wasm.wasm')});
export const tables=['metadata','categories','projects','members','skills','member_skills','member_links','project_members','publications','publication_authors','project_publications'];
const columns={
 metadata:['key','value'],categories:['id','name_es','name_en'],
 projects:['id','category_id','title_es','title_en','description_es','description_en','phase','team_size','metadata_type'],
 members:['id','full_name','bio_es','bio_en','institution','discipline','role','orcid'],
 skills:['id','label'],member_skills:['member_id','skill_id','level'],member_links:['member_id','label','url'],
 project_members:['project_id','member_id','role'],publications:['id','title','doi','url','publication_date','kind'],
 publication_authors:['publication_id','member_id','author_order'],project_publications:['project_id','publication_id'],
};

export function rows(db,sql,params=[]){
 const statement=db.prepare(sql);try{statement.bind(params);const records=[];while(statement.step())records.push(statement.getAsObject());return records;}finally{statement.free();}
}

export async function emptyDatabase(){const SQL=await engine;const db=new SQL.Database();db.run(await readFile(new URL('./database-schema.sql',import.meta.url),'utf8'));return db;}
export async function openDatabase(path=databasePath){
 const SQL=await engine;const bytes=await readFile(path);
 if(bytes.subarray(0,16).toString()!=='SQLite format 3\0')throw Error('The data file is not a SQLite database.');
 const db=new SQL.Database(bytes);db.run('PRAGMA foreign_keys = ON');return db;
}

function isOrcid(value){
 if(!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(value))return false;
 const digits=value.replaceAll('-','');let total=0;for(const digit of digits.slice(0,15))total=(total+Number(digit))*2;
 const check=(12-total%11)%11;return digits[15]===(check===10?'X':String(check));
}
function https(value){try{return new URL(value).protocol==='https:';}catch{return false;}}
export function validateDatabase(db){
 if(rows(db,'PRAGMA integrity_check')[0].integrity_check!=='ok')throw Error('SQLite integrity check failed.');
 if(rows(db,'PRAGMA user_version')[0].user_version!==1)throw Error('Unsupported database schema version.');
 const actual=rows(db,"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").map(r=>r.name).sort();
 if(JSON.stringify(actual)!==JSON.stringify([...tables].sort()))throw Error('Unexpected database tables. Only the public data schema can be versioned.');
 for(const table of tables){const actualColumns=rows(db,`PRAGMA table_info(${table})`).map(c=>c.name);if(JSON.stringify(actualColumns)!==JSON.stringify(columns[table]))throw Error('Unexpected columns in '+table+'. Private fields must not be committed.');}
 if(rows(db,'PRAGMA foreign_key_check').length)throw Error('Broken database relationships.');
 const metadata=Object.fromEntries(rows(db,'SELECT * FROM metadata').map(row=>[row.key,row.value]));
 if(Object.keys(metadata).some(key=>!['schema_version','content_policy','created_at','updated_at'].includes(key)))throw Error('Unknown metadata keys. Do not store private data in this file.');
 if(metadata.schema_version!=='1'||metadata.content_policy!=='public-only')throw Error('Missing public data policy or schema metadata.');
 for(const p of rows(db,'SELECT * FROM projects')){
  if(!Number.isInteger(p.id)||p.id<=0||!['illustrative','confirmed'].includes(p.metadata_type)||!([null,'proposal','development','final'].includes(p.phase))||(p.team_size!==null&&(!Number.isInteger(p.team_size)||p.team_size<1)))throw Error('Invalid project record: '+p.id);
  for(const key of ['title_es','title_en','description_es','description_en'])if(!p[key]?.trim())throw Error('Missing '+key+' in project '+p.id);
 }
 for(const member of rows(db,'SELECT * FROM members')){
  if(!member.id?.trim()||!member.full_name?.trim())throw Error('A member is missing an ID or public name.');
  if(member.orcid!==null&&!isOrcid(member.orcid))throw Error('Invalid ORCID in member '+member.id);
 }
 for(const publication of rows(db,'SELECT * FROM publications')){
  if(!publication.id?.trim()||!publication.title?.trim())throw Error('Publication ID and title are required.');
  if(publication.doi!==null&&!/^10\.\d{4,9}\/\S+$/i.test(publication.doi))throw Error('Invalid DOI in publication '+publication.id);
  if(publication.url!==null&&!https(publication.url))throw Error('Publication URLs must use HTTPS.');
  if(publication.publication_date!==null){const date=publication.publication_date;if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('Invalid publication date.');}
 }
 for(const link of rows(db,'SELECT * FROM member_links'))if(!https(link.url))throw Error('Member links must use HTTPS.');
 return Object.fromEntries(tables.map(table=>[table,rows(db,`SELECT COUNT(*) AS total FROM ${table}`)[0].total]));
}

export async function loadCatalogues(){
 const db=await openDatabase();try{validateDatabase(db);const records=rows(db,'SELECT p.*,c.name_es,c.name_en FROM projects p JOIN categories c ON c.id=p.category_id ORDER BY p.id');
  return Object.fromEntries(['es','en'].map(lang=>[lang,records.map(p=>({id:p.id,title:p['title_'+lang],category:p['name_'+lang],description:p['description_'+lang],phase:p.phase,teamSize:p.team_size,metadataType:p.metadata_type}))]));
 }finally{db.close();}
}

export function snapshot(db){validateDatabase(db);return{schemaVersion:1,contentPolicy:'public-only',tables:Object.fromEntries(tables.map(table=>[table,rows(db,`SELECT * FROM ${table} ORDER BY ${columns[table][0]}`)]))};}
export async function fromSnapshot(value){
 if(value?.schemaVersion!==1||value.contentPolicy!=='public-only'||!value.tables||JSON.stringify(Object.keys(value.tables).sort())!==JSON.stringify([...tables].sort()))throw Error('Invalid public database snapshot.');
 const db=await emptyDatabase();
 try{db.run('BEGIN');db.run('DELETE FROM metadata');for(const table of tables){if(!Array.isArray(value.tables[table]))throw Error('Invalid table '+table);for(const record of value.tables[table]){
  if(!record||typeof record!=='object'||JSON.stringify(Object.keys(record).sort())!==JSON.stringify([...columns[table]].sort()))throw Error('Unknown or missing fields in '+table+'. Private fields cannot be imported.');
  db.run(`INSERT INTO ${table} (${columns[table].join(',')}) VALUES (${columns[table].map(()=>'?').join(',')})`,columns[table].map(column=>record[column]));
 }}db.run('COMMIT');validateDatabase(db);return db;
 }catch(error){db.close();throw error;}
}

export async function saveDatabase(db,path=databasePath){
 validateDatabase(db);await mkdir(dirname(path),{recursive:true});const lock=await open(path+'.lock','wx');let temporary;
 try{
  try{await readFile(path);const backups=join(dirname(path),'backups');await mkdir(backups,{recursive:true});await copyFile(path,join(backups,basename(path)+'.'+new Date().toISOString().replace(/[:.]/g,'-')+'.bak'));}catch(error){if(error.code!=='ENOENT')throw error;}
  const bytes=db.export();db.run('PRAGMA foreign_keys=ON');
  temporary=path+'.tmp';await writeFile(temporary,bytes);await rename(temporary,path);temporary=null;
 }finally{if(temporary)await unlink(temporary).catch(()=>{});await lock.close();await unlink(path+'.lock');}
}
