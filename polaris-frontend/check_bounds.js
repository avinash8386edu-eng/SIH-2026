const fs = require('fs');
const appJS = fs.readFileSync('js/app.js', 'utf8');
const startIndex = appJS.indexOf("'#cargo-scan': `");
console.log(appJS.substring(startIndex, startIndex + 1500));
