const path = require('path');
const { unlink } = require('fs');
const { copyFile, mkdir, readdir } = require('fs/promises');

const sourcePath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');
mkdir(destinationPath, {recursive: true});

function removeFiles() {
  try {
    const files = readdir(destinationPath);
    files.then(function (files) {
      for (const file of files) {
        unlink(path.join(destinationPath, file), (err) => {
          if (err) throw err;
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function copyDir() {
  removeFiles();
  try {
    const files = readdir(sourcePath, {
      withFileTypes: true
    });
    files.then(function (files) {
      for (const file of files) {
        let source = path.join(sourcePath, file.name);
        let destination = path.join(destinationPath, file.name);
        copyFile(source, destination);
      }
      console.log('Файлы дублированы');
    });
  } catch (err) {
    console.error(err);
  }
}

copyDir();