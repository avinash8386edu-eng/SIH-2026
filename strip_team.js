const fs = require('fs');
let readme = fs.readFileSync('README.md', 'utf8');

// Remove item from TOC
readme = readme.replace('7. [Team YantraMinds](#7-team-yantraminds)\n', '');

// Remove section 7
readme = readme.replace(/## 7\. Team YantraMinds[\s\S]*$/, '');

// Ensure we still have the footer at the very end
readme += `---
<div align="center">
  <p><b>Team ID: 120559 | SIH 2026 Grand Finale</b></p>
</div>
`;

fs.writeFileSync('README.md', readme);
