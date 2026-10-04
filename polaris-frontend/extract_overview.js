const fs = require('fs');
const code = fs.readFileSync('js/app.js', 'utf8');
const start = code.indexOf("'#overview': `");
const end = code.indexOf("`,", start);
fs.writeFileSync('overview.html', code.substring(start, end));
