const fs = require('fs');
const lines = fs.readFileSync('js/app.js', 'utf8').split('\n');
lines.forEach((l, i) => {
    if (l.trim().match(/^'.*': `$/)) {
        console.log(i + 1, l.trim());
    }
});
