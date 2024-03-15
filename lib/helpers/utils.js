'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
// Delete Folder
async function removeDir(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function (entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        removeDir(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}

// Delete Files in folder
async function emptyDir(directory, folderName) {
  if (!fs.existsSync(`${directory}`)) {
    console.log(`>Pasta ${directory} não existe, criando a pasta.`);
    await fs.mkdirSync(`${directory}`);
  }
  console.log(`>> Apagando arquivos de ${folderName} antigos.`);
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.log(err);
    }

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

// ForEach Synchronous
function forEachSync(array, callback) {
  let lastIndex = array.length - 1;
  let startIndex = 0;

  return new Promise((resolve, reject) => {
    // Finish all
    let functionToIterateWith = (currIndex) => {
      if (currIndex > lastIndex) {
        return resolve();
      } else {
        callback(array[currIndex])
          .then(() => {
            functionToIterateWith(currIndex + 1);
          })
          .catch((err) => reject(err));
      }
    };

    functionToIterateWith(startIndex);
  });
}

// Set cokies in temp file and load
async function setCookiesAndSave(page) {
  const previousSession = fs.existsSync('./cokiesSaved.json');
  if (previousSession) {
    // If file exist load the cookies
    const cookiesString = fs.readFileSync('./cokiesSaved.json');
    const parsedCookies = JSON.parse(cookiesString);
    if (parsedCookies.length !== 0) {
      for (let cookie of parsedCookies) {
        await page.setCookie(cookie);
      }
      console.log('Session has been loaded in the browser');
    }
  } else {
    // Save Session Cookies
    const cookiesObject = await page.cookies();
    // Write cookies to temp file to be used in other profile pages
    fs.writeFile(
      'cokiesSaved.json',
      JSON.stringify(cookiesObject),
      function (err) {
        if (err) {
          console.log('The file could not be written.', err);
        }
        console.log('Session has been successfully saved');
      }
    );
  }
}

// Set Cokies in Puppeter
async function setCookies(page, cookiePath) {
  let cookies = [];

  if (fs.existsSync(cookiePath)) {
    cookies = JSON.parse(fs.readFileSync(cookiePath));
  }

  cookies = cookies.map((cookie) => {
    cookie.url = `https://${cookie.domain}:3002`;
    delete cookie.domain;
    return cookie;
  });

  return Promise.all(
    cookies.map(async (cookie) => {
      await page.setCookie(cookie);
    })
  );
}

async function listAllFilesInDir(dir, fileList = []) {
  const files = await fs.promises.readdir(dir);

  try {
    for (const file of files) {
      const stat = await fs.promises.stat(path.join(dir, file));
      if (stat.isDirectory()) {
        fileList = await listAllFilesInDir(path.join(dir, file), fileList);
      } else {
        fileList.push(path.join(dir, file));
      }
    }
  } catch (error) {
    console.log(
      '🚀 ~ file: utils.js ~ line 141 ~ listAllFilesInDir ~ error',
      error
    );
  }

  return fileList;
}

// get a full list off directories
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

// Compare dates
// type de = decreasing / in = increase
function dateCompare(a, b, type = 'de') {
  const d1 = moment(a, 'DD/MM/YYYY');
  const d2 = moment(b, 'DD/MM/YYYY');
  if (d1.isAfter(d2)) {
    return type === 'in' ? 1 : -1;
  } else if (d1.isBefore(d2)) {
    return type === 'in' ? -1 : 1;
  }
  return 0;
}

function readAllJsonFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => path.extname(name) === '.json')
    .map((name) => require(path.join(dir, name)));
}

module.exports = {
  emptyDir,
  forEachSync,
  setCookies,
  listAllFilesInDir,
  setCookiesAndSave,
  removeDir,
  deleteFolderRecursive,
  getDirectories,
  dateCompare,
  readAllJsonFiles,
};
