const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

const source = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(
  destination,
  '',
  err => {
    console.error(err);
  }
);

try {
  const files = readdir(source, {withFileTypes: true});
  files.then(function (files) {
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        fs.readFile(path.join(source, file.name), (err, data) => {
          if (err) throw err;
          fs.appendFile(
            destination,
            data.toString(),
            err => {
              if (err) throw err;
            }
          );
        });
      };
    }
  });
} catch (err) {
  console.error(err);
}