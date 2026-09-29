const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

// Change the button attributes
appJS = appJS.replace(
    /onmousedown="window\.startSOSHold\(\)" onmouseup="window\.cancelSOSHold\(\)" onmouseleave="window\.cancelSOSHold\(\)"/,
    'onclick="window.triggerSOSSequence()"'
);

// Change the instructions text
appJS = appJS.replace(
    'CLICK AND HOLD FOR 3 SECONDS TO TRANSMIT DISTRESS',
    'CLICK TO TRANSMIT DISTRESS SIGNAL'
);

// Remove the progress container HTML
appJS = appJS.replace(
    /<div id="sos-progress-container"[\s\S]*?<\/div>\s*<\/div>/,
    ''
);

// We don't necessarily need to remove the javascript functions from the bottom, they won't be called.
// But we can just to be clean, or leave them. Let's just leave them, they are harmless.

fs.writeFileSync('js/app.js', appJS);
console.log("Updated SOS button to be 1 tap!");
