const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

// REPLACE EMERGENCY
// We know it starts at '#emergency' and ends at '#cargo-scan'
let emStart = appJS.indexOf("'#emergency': `");
let emEnd = appJS.indexOf("'#cargo-scan': `");
if (emStart !== -1 && emEnd !== -1) {
    let pre = appJS.substring(0, emStart);
    let post = appJS.substring(emEnd);
    // Let's just fix the \n in intel logic below, but here we can keep things as they were.
}

// Actually, I'll just fix app.js directly by string replace!
appJS = appJS.replace("\\n    };", "\n    };");

fs.writeFileSync('js/app.js', appJS);
console.log("Fixed the newline syntax error!");
