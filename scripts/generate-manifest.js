/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const publicDir = path.join(process.cwd(), 'public');
const files = getAllFiles(publicDir);

const relativeFiles = files.map(f => {
  let rel = f.replace(publicDir, '').replace(/\\/g, '/');
  if (!rel.startsWith('/')) rel = '/' + rel;
  return rel;
});

const content = `// This file is auto-generated. Do not edit.
export const assetManifest = new Set(${JSON.stringify(relativeFiles, null, 2)});
`;

fs.writeFileSync(path.join(process.cwd(), 'lib', 'asset-manifest.ts'), content);
console.log('Asset manifest generated.');
