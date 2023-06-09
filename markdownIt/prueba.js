// let MarkdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');
// console.log(path.isAbsolute('https://live.hsmob.io/storage/images/wakyma.com/wakyma.com_blog_wp-co_estres-en-loros.jpg'))
// const md = new MarkdownIt({ source: true });
const pathAbsolute = (pathi) => path.isAbsolute(pathi) ? path : path.resolve(pathi);
const md = require('markdown-it')();
const archivo = fs.readFileSync('./miArchivo.md', 'utf8');
let result = md.render(archivo);
let arrayTokens = md.parse(archivo, {});
// console.log(Tokens[1])
// console.log(result);
// console.log(md.render(tokens[13].content));
// tokens[13].children.forEach(element => {
//   if (element.type === 'link_open') {
//     console.log(element)
//   }
// });
const loopTokens = (tokens) => {
  const linksComplejos = [];
  for (let i = 0; i < tokens.length; i++) {
    // console.log(tokens[i]);
    // propagar información de la propiedad map en los hijos
    if (tokens[i].children && tokens[i].children.length > 0) {
      // Recorrer los hijos del token
      for (let j = 0; j < tokens[i].children.length; j++) {
        const child = tokens[i].children[j];

        // Si el hijo no tiene información de ubicación
        if (child.map === null) {
          // Propagar la información de ubicación del token padre
          child.map = tokens[i].map;
        }
      }
    }
    // implentando función recursiva
    // console.log(tokens[i]);
    if (tokens[i].children) {
      linksComplejos.push(...loopTokens(tokens[i].children));
    };
    // obtener tokens de tipo links y que no sean enlaces de tipo id
    if (tokens[i].type === 'link_open' && !tokens[i].attrs[0][1].startsWith('#')) {
      let nextToken = tokens[i + 1];
      if (nextToken.type === 'text' && tokens[i + 2].type === 'link_close') {
        linksComplejos.push({
          href: tokens[i].attrs[0][1],
          text: nextToken.content,
          line: tokens[i].map[0] + 1 === tokens[i].map[1] ? tokens[i].map[1] : `${tokens[i].map[0] + 1}-${tokens[i].map[1]}`,
        })
      }
    }

    if (tokens[i].type === 'image') {
      const srcAttr = tokens[i].attrs.find(a => a[0] === 'src');
      const regex = /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:[\w\/\+=%&_\.~?\-]*[^\.\s])?$/;
      if (regex.test(srcAttr[1])) {
        linksComplejos.push({
          href: srcAttr[1],
          text: tokens[i].content,
          line: tokens[i].map[0] + 1 === tokens[i].map[1] ? tokens[i].map[1] : `${tokens[i].map[0] + 1}-${tokens[i].map[1]}`,
        })
      }
    }
  }
  return linksComplejos;
  // tokens.forEach(token => {
  //   if (token.children) {
  //     linksComplejos.push(...recorrerTokens(token.children));
  //   };

  //   if (token.type === 'link_open') {
  //     linksComplejos.push({
  //       href: token.attrs[0][1],
  //       text: linkContent,
  //     })
  //   }
  // });
  // return linksComplejos;
}
console.log(loopTokens(arrayTokens));
// console.log(result);