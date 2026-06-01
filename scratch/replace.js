const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (dir.includes('node_modules') || dir.includes('.git')) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory()
        ? walkSync(dirFile, filelist)
        : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return filelist;
      }
      throw err;
    }
  });
  return filelist;
};

const dirs = [
  path.join(__dirname, '../FrontEnd/src'),
  path.join(__dirname, '../BackEnd'),
  path.join(__dirname, '../knowledge-base') // optional, but good for consistency
];

let files = [];
dirs.forEach(d => {
  if (fs.existsSync(d)) files = files.concat(walkSync(d));
});

let updatedCount = 0;

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') || file.endsWith('.css') || file.endsWith('.md')) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Case-preserving replacements
    content = content.replace(/Navdhaaga/g, 'Bunbun Clothing');
    content = content.replace(/navdhaaga/g, 'bunbunclothing');
    content = content.replace(/NAVDHAAGA/g, 'BUNBUN CLOTHING');
    content = content.replace(/Nadhaaga/g, 'BunbunClothing'); // catch typo in App.jsx

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      console.log(`Updated: ${file}`);
    }
  }
});

console.log(`\nReplaced Navdhaaga with Bunbun Clothing in ${updatedCount} files.`);
