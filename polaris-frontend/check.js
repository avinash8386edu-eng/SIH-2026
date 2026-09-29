const fs = require('fs');
const { spawnSync } = require('child_process');
try {
    let code = fs.readFileSync('js/app.js', 'utf8');
    code = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
    fs.writeFileSync('temp.js', code);
    
    const result = spawnSync('node', ['-c', 'temp.js'], { encoding: 'utf8' });
    console.log(result.stderr || result.stdout);
} catch(e) {}
