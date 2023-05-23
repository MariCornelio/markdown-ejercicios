const { marked } = require('marked');
const fs = require('fs');


const archivo = fs.readFileSync('./miArchivo.md', 'utf8');
const arrayTokens = marked.lexer(archivo, {
  gfm: true,
  location: true,
});
// console.log();
const loopTokens = (tokens) => {
  const linksComplejos = [];
  for (let i = 0; i < tokens.length; i++) {
    console.log(tokens[i]);

    if (tokens[i].tokens) {
      linksComplejos.push(...loopTokens(tokens[i].tokens));
    };
    // obtener tokens de tipo links y que no sean enlaces de tipo id
    if (tokens[i].type === 'link') {
      linksComplejos.push({
        href: tokens[i].href,
        text: tokens[i].text,
        loc: tokens[i].loc,
      })
    }


  }
  return linksComplejos;

}
console.log(loopTokens(arrayTokens));