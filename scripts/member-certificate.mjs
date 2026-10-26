/** Personalized UINIK recognition. All PDF work stays in the visitor's browser. */
const ASSET_ROOT = '/membership/';
const scriptPromises = new Map();
let sourcePromise;

const copy = {
 es: {
  intro: 'Por medio de la presente, UINIK, organización académica multidisciplinaria sin fines de lucro, hace constar la incorporación de',
  joining: 'quien, a partir del día {date}, pasa a formar parte de nuestra organización, participando en las actividades, proyectos e iniciativas relacionadas con la investigación científica, el desarrollo tecnológico, la innovación y la divulgación del conocimiento.',
  paragraphs: [
   'El integrante asume el compromiso de participar responsablemente en los proyectos y actividades que acepte desarrollar, cumpliendo con los objetivos, responsabilidades y acuerdos establecidos en colaboración con los demás miembros de la organización.',
   'Asimismo, durante su participación, podrá acceder a los recursos, apoyos, herramientas y oportunidades que UINIK ponga a su disposición, conforme a las necesidades de cada proyecto y las condiciones previamente acordadas. Dichos recursos deberán utilizarse exclusivamente para los fines autorizados y, cuando corresponda, comprobarse su correcta aplicación.',
   'UINIK reconoce y respeta la autoría y propiedad intelectual de los proyectos desarrollados por sus integrantes, sin adquirir derechos sobre ellos por el simple hecho de brindar apoyo institucional. Por su parte, el integrante deberá reconocer la participación de UINIK en los créditos y publicaciones de aquellos proyectos que se desarrollen con su respaldo o dentro de la organización.',
   'La presente constancia tiene como finalidad formalizar la incorporación del integrante a UINIK, así como dejar constancia de su aceptación de los principios de responsabilidad, colaboración, ética y respeto que rigen las actividades de la organización.',
   'Este documento no constituye por sí mismo un contrato de trabajo ni establece obligaciones de remuneración. La naturaleza de la relación entre las partes se determinará conforme a las actividades efectivamente realizadas y la legislación aplicable.',
  ],
  closing: 'Se expide la presente constancia para los fines que al interesado convengan.',
  dateLocale: 'es-MX',
  title: 'Constancia de integración a UINIK',
 },
 en: {
  intro: 'UINIK, a nonprofit multidisciplinary academic organization, hereby certifies the admission of',
  joining: 'who, as of {date}, becomes a member of our organization, participating in activities, projects, and initiatives related to scientific research, technological development, innovation, and the dissemination of knowledge.',
  paragraphs: [
   'The member commits to participating responsibly in the projects and activities they agree to undertake, fulfilling the objectives, responsibilities, and agreements established in collaboration with the other members of the organization.',
   'During their participation, the member may also access the resources, support, tools, and opportunities that UINIK makes available, according to the needs of each project and the conditions previously agreed upon. These resources must be used exclusively for authorized purposes and, where applicable, their proper use must be documented.',
   'UINIK recognizes and respects the authorship and intellectual property of projects developed by its members, without acquiring rights to them merely by providing institutional support. In turn, the member must acknowledge UINIK’s participation in the credits and publications of projects developed with its support or within the organization.',
   'This certificate is intended to formalize the member’s admission to UINIK and to record their acceptance of the principles of responsibility, collaboration, ethics, and respect that govern the organization’s activities.',
   'This document does not in itself constitute an employment contract or establish any obligation to provide remuneration. The nature of the relationship between the parties will be determined according to the activities actually performed and the applicable law.',
  ],
  closing: 'This certificate is issued for any purposes the interested party may deem appropriate.',
  dateLocale: 'en-US',
  title: 'UINIK membership recognition',
 },
};

function fail(code, message) {
 const error = new Error(message);
 error.code = code;
 return error;
}

function loadScript(file, globalName) {
 if (globalThis[globalName]) return Promise.resolve(globalThis[globalName]);
 if (!scriptPromises.has(file)) {
  scriptPromises.set(file, new Promise((resolve, reject) => {
   const script = document.createElement('script');
   script.src = ASSET_ROOT + file;
   script.async = true;
   script.onload = () => {
    if (globalThis[globalName]) resolve(globalThis[globalName]);
    else { scriptPromises.delete(file); script.remove(); reject(fail('pdf-load', 'PDF library unavailable.')); }
   };
   script.onerror = () => { scriptPromises.delete(file); script.remove(); reject(fail('pdf-load', 'Could not load the PDF tools.')); };
   document.head.append(script);
  }));
 }
 return scriptPromises.get(file);
}

async function fetchBytes(file) {
 const response = await fetch(ASSET_ROOT + file);
 if (!response.ok) throw fail('pdf-load', 'Could not load the certificate template or font.');
 return new Uint8Array(await response.arrayBuffer());
}

function validateName(value) {
 if (typeof value !== 'string') throw fail('invalid-name', 'Enter your full name.');
 const name = value.normalize('NFC').replace(/\s+/gu, ' ').trim();
 if ([...name].length < 3 || [...name].length > 180 || /[\p{Cc}\p{Cf}]/u.test(name) || !/\p{L}/u.test(name)) {
  throw fail('invalid-name', 'Enter a full name between 3 and 180 characters.');
 }
 return name;
}

function dateValue(value, locale) {
 if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw fail('invalid-date', 'Use a valid date in YYYY-MM-DD format.');
 const date = new Date(value + 'T12:00:00Z');
 if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== value) throw fail('invalid-date', 'Use a valid calendar date.');
 return {
  date,
  display: new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date),
 };
}

function wrapText(text, font, size, width) {
 const lines = [];
 let line = '';
 for (const word of text.split(' ')) {
  const candidate = line ? line + ' ' + word : word;
  if (font.widthOfTextAtSize(candidate, size) <= width) { line = candidate; continue; }
  if (line) { lines.push(line); line = ''; }
  if (font.widthOfTextAtSize(word, size) <= width) { line = word; continue; }
  // Long names may contain unspaced compound names; keep every Unicode codepoint.
  for (const letter of [...word]) {
   if (line && font.widthOfTextAtSize(line + letter, size) > width) { lines.push(line); line = ''; }
   line += letter;
  }
 }
 if (line) lines.push(line);
 return lines;
}

function requireGlyphs(font, text) {
 const available = new Set(font.getCharacterSet());
 if ([...text].some(letter => !available.has(letter.codePointAt(0)))) {
  throw fail('unsupported-name', 'This name contains characters not supported by the certificate font. Contact UINIK for assistance.');
 }
}

function wrapParagraph(text, emphasis, regular, bold, size, width) {
 const start = text.indexOf(emphasis), end = start + emphasis.length;
 const lines = [];
 let line = [], lineWidth = 0, offset = 0;
 for (const word of text.split(' ')) {
  const font = start >= 0 && offset >= start && offset < end ? bold : regular;
  const segment = { text: word, font };
  const gap = line.length ? regular.widthOfTextAtSize(' ',size) : 0;
  const wordWidth = font.widthOfTextAtSize(word,size);
  if (line.length && lineWidth + gap + wordWidth > width) { lines.push(line); line = []; lineWidth = 0; }
  segment.x = lineWidth + (line.length ? regular.widthOfTextAtSize(' ',size) : 0);
  line.push(segment); lineWidth = segment.x + wordWidth; offset += word.length + 1;
 }
 if (line.length) lines.push(line);
 return lines;
}

/**
 * @param {{fullName:string,date:string,language?:'es'|'en'}} options
 * @returns {Promise<Uint8Array>} A one-page personalized PDF, ready for a Blob.
 */
export async function createMembershipPdf({ fullName, date, language = 'es' } = {}) {
 const name = validateName(fullName);
 const content = copy[language === 'en' ? 'en' : 'es'];
 const issued = dateValue(date, content.dateLocale);
 const [PDFLib, fontkit] = await Promise.all([
  loadScript('pdf-lib.min.js', 'PDFLib'),
  loadScript('fontkit.umd.min.js', 'fontkit'),
 ]);
 if (!sourcePromise) sourcePromise = Promise.all(['template.pdf', 'NotoSans-Regular.ttf'].map(fetchBytes)).catch(error => { sourcePromise = null; throw error; });
 const [template, regularBytes] = await sourcePromise;
 const pdf = await PDFLib.PDFDocument.load(template.slice());
 pdf.registerFontkit(fontkit);
 const regular = await pdf.embedFont(regularBytes, { subset: true });
 requireGlyphs(regular, name);
 const page = pdf.getPage(0);
 const width = page.getWidth();
 const left = 59.5, usable = width - left * 2;
 const ink = PDFLib.rgb(0,0,0);
 const top = 596, bottom = 245;
 const text = [content.intro,name+',',content.joining.replace('{date}',issued.display),...content.paragraphs,content.closing].join(' ');
 let layout;
 for (let size = 12; size >= 9.5; size -= .25) {
  const leading=size*1.35,lines=wrapText(text,regular,size,usable);
  if(lines.length*leading<=top-bottom){layout={size,leading,lines};break;}
 }
 if (!layout) throw fail('text-overflow', 'The certificate text does not fit this name.');
 const drawLines = (lines, y, font, size, leading, color = ink) => {
  for (const line of lines) { page.drawText(line, { x:left, y, size, font, color }); y -= leading; }
  return y;
 };
 // Date is right-aligned above the existing orange rule; signatures remain untouched.
 const dateSize = layout.size;
 page.drawText(issued.display, { x:width-left-regular.widthOfTextAtSize(issued.display,dateSize), y:686, size:dateSize, font:regular, color:ink });
 const y = drawLines(layout.lines, top, regular, layout.size, layout.leading);
 if (y < bottom - 1) throw fail('text-overflow', 'The certificate text exceeds its safe area.');
 pdf.setTitle(content.title);
 pdf.setSubject(content.title + ': ' + name);
 pdf.setAuthor('UINIK');
 pdf.setCreator('UINIK');
 pdf.setProducer('UINIK membership recognition');
 pdf.setCreationDate(issued.date);
 pdf.setModificationDate(issued.date);
 return pdf.save();
}
