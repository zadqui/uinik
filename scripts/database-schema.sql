PRAGMA foreign_keys = ON;
PRAGMA user_version = 1;

CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE categories (
 id TEXT PRIMARY KEY,
 name_es TEXT NOT NULL UNIQUE,
 name_en TEXT NOT NULL UNIQUE
);
CREATE TABLE projects (
 id INTEGER PRIMARY KEY CHECK(id > 0),
 category_id TEXT NOT NULL REFERENCES categories(id),
 title_es TEXT NOT NULL, title_en TEXT NOT NULL,
 description_es TEXT NOT NULL, description_en TEXT NOT NULL,
 phase TEXT CHECK(phase IN ('proposal','development','final') OR phase IS NULL),
 team_size INTEGER CHECK(team_size > 0 OR team_size IS NULL),
 metadata_type TEXT NOT NULL CHECK(metadata_type IN ('illustrative','confirmed'))
);
-- Public profile information only. No passwords, sessions, private contact details or consent records.
CREATE TABLE members (
 id TEXT PRIMARY KEY,
 full_name TEXT NOT NULL,
 bio_es TEXT NOT NULL DEFAULT '', bio_en TEXT NOT NULL DEFAULT '',
 institution TEXT NOT NULL DEFAULT '',
 discipline TEXT NOT NULL DEFAULT '',
 role TEXT NOT NULL DEFAULT 'member',
 orcid TEXT UNIQUE
);
CREATE TABLE skills (id TEXT PRIMARY KEY, label TEXT NOT NULL UNIQUE);
CREATE TABLE member_skills (
 member_id TEXT NOT NULL REFERENCES members(id),
 skill_id TEXT NOT NULL REFERENCES skills(id),
 level TEXT NOT NULL CHECK(level IN ('learning','intermediate','advanced')),
 PRIMARY KEY(member_id,skill_id)
);
CREATE TABLE member_links (
 member_id TEXT NOT NULL REFERENCES members(id),
 label TEXT NOT NULL, url TEXT NOT NULL,
 PRIMARY KEY(member_id,label)
);
CREATE TABLE project_members (
 project_id INTEGER NOT NULL REFERENCES projects(id),
 member_id TEXT NOT NULL REFERENCES members(id),
 role TEXT NOT NULL,
 PRIMARY KEY(project_id,member_id)
);
CREATE TABLE publications (
 id TEXT PRIMARY KEY, title TEXT NOT NULL,
 doi TEXT UNIQUE, url TEXT,
 publication_date TEXT,
 kind TEXT NOT NULL DEFAULT 'article'
);
CREATE TABLE publication_authors (
 publication_id TEXT NOT NULL REFERENCES publications(id),
 member_id TEXT NOT NULL REFERENCES members(id),
 author_order INTEGER NOT NULL CHECK(author_order > 0),
 PRIMARY KEY(publication_id,member_id),
 UNIQUE(publication_id,author_order)
);
CREATE TABLE project_publications (
 project_id INTEGER NOT NULL REFERENCES projects(id),
 publication_id TEXT NOT NULL REFERENCES publications(id),
 PRIMARY KEY(project_id,publication_id)
);
CREATE INDEX project_category_index ON projects(category_id);
CREATE INDEX project_member_index ON project_members(member_id);
CREATE INDEX publication_author_index ON publication_authors(member_id);
INSERT INTO metadata VALUES ('schema_version','1');
INSERT INTO metadata VALUES ('content_policy','public-only');
