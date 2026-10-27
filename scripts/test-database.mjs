import assert from 'node:assert/strict';
import { readFile,writeFile,mkdtemp,readdir,access } from 'node:fs/promises';
import { join } from 'node:path';
import { databasePath,openDatabase,validateDatabase,snapshot,fromSnapshot,saveDatabase,rows,loadCatalogues } from './database.mjs';

const original=await readFile(databasePath);
const db=await openDatabase();
let imported;
try{
 const counts=validateDatabase(db);assert.equal(counts.projects,46);assert.equal(counts.members,0);assert.equal(counts.publications,0);
 const languages=await loadCatalogues();assert.equal(languages.en.length,46);assert.equal(languages.es.length,46);
 assert.deepEqual(languages.en.map(p=>p.id),languages.es.map(p=>p.id));
 assert(languages.es.every(p=>p.metadataType==='illustrative'));
 db.run('INSERT INTO members (id,full_name,orcid) VALUES (?,?,?)',['test-member','Test Member','0000-0002-1825-0097']);
 db.run('INSERT INTO skills VALUES (?,?)',['test-skill','Test skill']);
 db.run('INSERT INTO member_skills VALUES (?,?,?)',['test-member','test-skill','learning']);
 db.run('INSERT INTO project_members VALUES (?,?,?)',[2,'test-member','Test contributor']);
 db.run('INSERT INTO publications (id,title,doi,url,publication_date) VALUES (?,?,?,?,?)',['test-publication','Test publication','10.1234/uinik-test','https://example.com/test','2026-10-26']);
 db.run('INSERT INTO publication_authors VALUES (?,?,?)',['test-publication','test-member',1]);
 db.run('INSERT INTO project_publications VALUES (?,?)',[2,'test-publication']);
 assert.equal(validateDatabase(db).project_members,1);
 assert.throws(()=>db.run('INSERT INTO project_members VALUES (?,?,?)',[99999,'test-member','Invalid']),/FOREIGN KEY/);
 assert.throws(()=>db.run('INSERT INTO members (id,full_name) VALUES (?,?)',['test-member','Duplicate']),/UNIQUE/);
 const exported=snapshot(db);
 imported=await fromSnapshot(exported);assert.deepEqual(snapshot(imported),exported);
 const privateData=structuredClone(exported);privateData.tables.members[0].email='private@example.com';
 await assert.rejects(fromSnapshot(privateData),/Unknown or missing fields/);
 const invalidDoi=structuredClone(exported);invalidDoi.tables.publications[0].doi='invalid-doi';
 await assert.rejects(fromSnapshot(invalidDoi),/Invalid DOI/);
 const invalidOrcid=structuredClone(exported);invalidOrcid.tables.members[0].orcid='0000-0002-1825-0098';
 await assert.rejects(fromSnapshot(invalidOrcid),/Invalid ORCID/);
 const temp=await mkdtemp(new URL('../tmp/pdfs/db-test-',import.meta.url));
 const file=join(temp,'uinik.sqlite');await saveDatabase(imported,file);
 const reopened=await openDatabase(file);try{assert.deepEqual(snapshot(reopened),exported);}finally{reopened.close();}
 await saveDatabase(imported,file);assert.equal((await readdir(join(temp,'backups'))).length,1);
 await assert.rejects(access(file+'.lock'));
 const before=await readFile(file);imported.run('ALTER TABLE members ADD COLUMN password TEXT');
 assert.throws(()=>validateDatabase(imported),/Unexpected columns/);
 await assert.rejects(saveDatabase(imported,file),/Unexpected columns/);
 assert.deepEqual(await readFile(file),before);
 const corrupt=join(temp,'corrupt.sqlite');await writeFile(corrupt,'not a database');await assert.rejects(openDatabase(corrupt),/not a SQLite/);
 assert.deepEqual(await readFile(databasePath),original);
 console.log('SQLite integrity, bilingual catalogue, relationships, DOI/ORCID validation, private-field rejection, import/export, backups and failed-write preservation: OK');
}finally{db.close();imported?.close();}
