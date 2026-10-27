import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { databasePath, openDatabase, validateDatabase, snapshot, fromSnapshot, saveDatabase, rows } from './database.mjs';

const [command='validate',argument]=process.argv.slice(2);
let db;
try{
 if(command==='import'){
  if(!argument)throw Error('Usage: npm run db:import -- path/to/public-snapshot.json');
  db=await fromSnapshot(JSON.parse(await readFile(resolve(argument),'utf8')));await saveDatabase(db);console.log('Validated database imported. Previous file backed up in data/backups/.');
 }else{
  db=await openDatabase();const counts=validateDatabase(db);
  if(command==='validate')console.log(JSON.stringify({file:'data/uinik.sqlite',schemaVersion:1,contentPolicy:'public-only',counts},null,2));
  else if(command==='export'){
   if(!argument)throw Error('Usage: npm run db:export -- path/to/public-snapshot.json');
   const target=resolve(argument);await mkdir(dirname(target),{recursive:true});await writeFile(target,JSON.stringify(snapshot(db),null,2)+'\n',{flag:'wx'});console.log('Public data exported.');
  }else if(command==='backup'){
   if(!argument)throw Error('Usage: npm run db:backup -- path/to/uinik.sqlite');
   const target=resolve(argument);await mkdir(dirname(target),{recursive:true});await copyFile(databasePath,target,1);console.log('SQLite copy created.');
  }else if(command==='query'){
   if(!argument)throw Error('Usage: npm run db:query -- "SELECT * FROM projects"');
   db.run('PRAGMA query_only=ON');console.log(JSON.stringify(rows(db,argument),null,2));
  }else throw Error('Unknown database command.');
 }
}catch(error){console.error(error.message);process.exitCode=1;}finally{db?.close();}
