/** Personalized UINIK recognition. All PDF work stays in the visitor's browser. */
const ASSET_ROOT = '/membership/';
const scriptPromises = new Map();
let sourcePromise;

const copy = {
 es: {
  intro: 'Por medio de la presente, UINIK reconoce formalmente a',
  paragraphs: [
   'como integrante de nuestra organización, en reconocimiento a su compromiso de contribuir al desarrollo del conocimiento, la investigación científica, la innovación tecnológica y la divulgación.',
   'Su incorporación representa la suma de nuevas ideas, capacidades y perspectivas a una comunidad que reconoce en la colaboración humana el origen de todo avance significativo.',
   'Con este reconocimiento, damos constancia de su integración a UINIK y de su participación en una visión compartida: construir conocimiento, impulsar iniciativas y acercar la ciencia a la sociedad.',
  ],
  closing: 'Porque los grandes avances no son el resultado de una sola persona, sino de quienes deciden construirlos juntos.',
  dateLocale: 'es-MX',
  title: 'Constancia de integración a UINIK',
  emphasis: 'integrante de nuestra organización',
 },
 en: {
  intro: 'UINIK hereby formally recognizes',
  paragraphs: [
   'as a member of our organization, in recognition of their commitment to advancing knowledge, scientific research, technological innovation, and science communication.',
   'Their membership brings new ideas, skills, and perspectives to a community that recognizes human collaboration as the origin of every significant advance.',
   'Through this recognition, we attest to their membership in UINIK and their participation in a shared vision: to build knowledge, support initiatives, and bring science closer to society.',
  ],
  closing: 'Because great advances are not the result of one person, but of those who choose to build them together.',
  dateLocale: 'en-US',
  title: 'UINIK membership recognition',
  emphasis: 'a member of our organization',
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
 if (!sourcePromise) sourcePromise = Promise.all(['template.pdf', 'NotoSans-Regular.ttf', 'NotoSans-Bold.ttf'].map(fetchBytes)).catch(error => { sourcePromise = null; throw error; });
 const [template, regularBytes, boldBytes] = await sourcePromise;
 const pdf = await PDFLib.PDFDocument.load(template.slice());
 pdf.registerFontkit(fontkit);
 const [regular, bold] = await Promise.all([
  pdf.embedFont(regularBytes, { subset: true }),
  pdf.embedFont(boldBytes, { subset: true }),
 ]);
 requireGlyphs(bold, name);
 const page = pdf.getPage(0);
 const width = page.getWidth();
 const left = 59.5, usable = width - left * 2;
 const ink = PDFLib.rgb(.10,.10,.09), orange = PDFLib.rgb(.76,.24,.09);
 const top = 596, bottom = 245;
 let nameSize = 24;
 let nameLines;
 let layout;
 for (; nameSize >= 14 && !layout; nameSize -= .5) {
  nameLines = wrapText(name, bold, nameSize, usable);
  if (nameLines.length > 3) continue;
  for (let size = 12; size >= 11; size -= .25) {
   const leading = size * 1.52;
   const intro = wrapText(content.intro, regular, size, usable);
   const paragraphs = content.paragraphs.map(p => wrapParagraph(p, content.emphasis, regular, bold, size, usable));
   const closing = wrapText(content.closing, bold, size, usable);
   const total = intro.length * leading + 13 + nameLines.length * nameSize * 1.25 + 15
    + paragraphs.reduce((sum,p)=>sum+p.length*leading+13,0) + 4 + closing.length * leading;
   if (total <= top - bottom) { layout = { size, leading, intro, paragraphs, closing, nameSize }; break; }
  }
 }
 if (!layout) throw fail('text-overflow', 'The certificate text does not fit this name.');
 nameSize = layout.nameSize;
 const drawLines = (lines, y, font, size, leading, color = ink) => {
  for (const line of lines) { page.drawText(line, { x:left, y, size, font, color }); y -= leading; }
  return y;
 };
 // Date is right-aligned above the existing orange rule; signatures remain untouched.
 let dateSize = 9.5;
 const dateWidth = 190;
 while (regular.widthOfTextAtSize(issued.display, dateSize) > dateWidth) dateSize -= .25;
 page.drawText(issued.display, { x:width-left-regular.widthOfTextAtSize(issued.display,dateSize), y:686, size:dateSize, font:regular, color:ink });
 let y = drawLines(layout.intro, top, regular, layout.size, layout.leading) - 13;
 y = drawLines(nameLines, y, bold, nameSize, nameSize * 1.25, orange) - 15;
 for (const lines of layout.paragraphs) {
  for (const line of lines) {
   for (const segment of line) page.drawText(segment.text, { x:left+segment.x, y, size:layout.size, font:segment.font, color:ink });
   y -= layout.leading;
  }
  y -= 13;
 }
 y = drawLines(layout.closing, y - 4, bold, layout.size, layout.leading);
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
