const path = require('path');
const fs = require('fs');
const { copyFile, mkdir, readdir } = require('fs/promises');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const assetsPath = path.join(__dirname, 'assets');
const destinationPath = path.join(__dirname, 'project-dist');
mkdir(destinationPath, {recursive: true});
mkdir(path.join(destinationPath, 'assets'), {recursive: true});

async function removeFiles(dir) {
  try {
    const files = readdir(dir, {
      withFileTypes: true
    });
    await files.then(function (files) {
      for (const file of files) {
        if (!file.isFile()) {
          let dirPath = path.join(dir, file.name);
          removeFiles(dirPath);
        } else {
          fs.unlink(path.join(dir, file.name), (err) => {
            if (err) throw err;
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function copyDir(src, dest) {
  try {
    const files = readdir(src, {
      withFileTypes: true
    });
    files.then(function (files) {
      for (const file of files) {
        if (!file.isFile()) {
          let dirDestination = path.join(dest, file.name);
          let dirSource = path.join(src, file.name);
          mkdir(dirDestination, {recursive: true});
          copyDir(dirSource, dirDestination);
        } else {
          let source = path.join(src, file.name);
          let destination = path.join(dest, file.name);
          copyFile(source, destination);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function createStyleCss() {
    const cssFile = path.join(destinationPath, 'style.css');
    const source = path.join(__dirname, 'styles');
    fs.writeFile(
      cssFile,
      '',
      err => {
        if (err) console.error(err);
      }
    );
    try {
      const files = readdir(source, {
        withFileTypes: true
      });
      files.then(function (files) {
        for (const file of files) {
          if (file.isFile() && path.extname(file.name) === '.css') {
            fs.readFile(path.join(source, file.name), (err, data) => {
              if (err) throw err;
              fs.appendFile(
                cssFile,
                data.toString(),
                err => {
                  if (err) throw err;
                }
              );
            });
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  function createHTML() {
    const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    let output = path.join(destinationPath, 'index.html');
    let str = '';
    input.on('data', chunk => str += chunk);
    input.on('end', () => {
      const regexp = /{{\w+}}/g;
      let nameTags = Array.from(str.matchAll(regexp));
      for (let i = 0; i < nameTags.length; i++) {
        let tagName = nameTags[i][0];
        let componentPath = path.join(__dirname, 'components', `${tagName.slice(2, tagName.length - 2)}.html`);
        fs.readFile(
          componentPath,
          'utf-8',
          (err, data) => {
            if (err) throw err;
            str = str.replace(nameTags[i][0], data);
            if (i === nameTags.length - 1) {
              fs.writeFile(
                output,
                str,
                (err) => {
                  if (err) throw err;
                }
              );
            }
          }
        );
      }
    });
  }

  async function start() {
    await removeFiles(destinationPath);
    emitter.emit('delete');
}
start();
  
emitter.on('delete', () => {
    copyDir(assetsPath, path.join(destinationPath, 'assets'));
    createStyleCss();
    createHTML();
  });