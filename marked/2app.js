const { marked } = require('marked');
// const marked = require('marked');
// const result = marked(markdownText, { renderer });

const fs = require('fs');

console.log(marked)


const renderer = new marked.Renderer();
console.log(renderer)



let lineNumber = 1;
const lines = [];

renderer.link = function (href, title, text) {
  const lineCount = (lines[lineNumber - 1].match(/\n/g) || []).length;
  const line = { lineNumber, href, title, text, lineCount };
  lines.push(line);
  lineNumber += lineCount + 1;
  return '';
};

const markdownText = fs.readFileSync('./miArchivo.md', 'utf8');
lines.push(`${markdownText.trimEnd()}\n`); // Agregamos un salto de línea al final de la primera línea

marked(markdownText, { renderer });

console.log(lines.filter(l => l.href));





