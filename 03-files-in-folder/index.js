const path = require('path');
const {
  readdir
} = require('fs/promises');
const {
  stat
} = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');

try {
  const files = readdir(dirPath, {
    withFileTypes: true
  });
  files.then(function (files) {
    for (const file of files) {
      if (file.isFile()) {
        checkFileInfo(file.name);
      };
    }
  });
} catch (err) {
  console.error(err);
}

function checkFileInfo(file) {
  let name = path.parse(file).name;
  let ext = path.extname(file).split('').slice(1).join('');
  stat(
    path.join(dirPath, file),
    (err, stats) => {
      if (err) throw err;
      console.log(`${name} - ${ext} - ${stats.size/ 1000} kb`);
    }
  )
}