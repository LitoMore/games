import {readFile} from 'node:fs/promises';

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

console.log(readme.replaceAll(/<h1.+h1>/gv, '').replaceAll('<h2', '<h3').replaceAll('</h2', '</h3'));
