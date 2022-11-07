const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  err => {
    if (err) throw err;
  }
);

output.write('Введите текст\n');

const r1 = readline.createInterface({ input, output });

function close() {
  output.write('Текст записан в файл text.txt');
  r1.close();
}

function writeText(text) {
    if (text === 'exit') {
        close();
        return;
      }
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    text,
    err => {
      if (err) throw err;
    }
  );
}

r1.on('line', (text) => writeText(text));
r1.on('SIGINT', close);