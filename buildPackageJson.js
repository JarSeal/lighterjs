import fs from 'fs';

const buildPackageJson = () => {
  const JSON_INDENTATION_VALUE = 2;

  // Read package.json file
  let pack;
  const packageJson = './package.json';
  try {
    if (fs.existsSync(packageJson)) {
      pack = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error while checking/reading package.json file.');
  }

  // Keep only certain properties
  const keepProperties = [
    'name',
    'version',
    'description',
    'main',
    'repository',
    'author',
    'license',
    'private',
  ];
  const trimmedPack = {};
  keepProperties.forEach((prop) => {
    if (pack[prop]) trimmedPack[prop] = pack[prop];
  });

  // Add main prop
  trimmedPack.main = 'index.mjs';

  // Save build package.json
  const path = './src/dist/package.json';
  try {
    fs.writeFileSync(path, JSON.stringify(trimmedPack, null, JSON_INDENTATION_VALUE) + '\n', {
      encoding: 'utf8',
      flag: 'w',
    });
  } catch (err) {
    console.error(err);
    throw new Error('Error while writing build package.json file.');
  }

  console.log('Created build package.json file.');
};

buildPackageJson();
