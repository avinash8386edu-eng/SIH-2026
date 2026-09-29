const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

const targetStr = `onmouseout="this.style.background='transparent'">ACCESS COMMAND HUB`;
const replacementStr = `onmouseout="this.style.background='transparent'" onclick="window.location.hash='#overview'">ACCESS COMMAND HUB`;

if (appJS.includes(targetStr)) {
    appJS = appJS.replace(targetStr, replacementStr);
    fs.writeFileSync('js/app.js', appJS);
    console.log("Button linked successfully to #overview");
} else {
    console.log("Could not find the target string.");
}
