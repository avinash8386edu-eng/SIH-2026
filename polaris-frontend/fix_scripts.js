const fs = require('fs');

let appJS = fs.readFileSync('js/app.js', 'utf8');

// Extract the script from #emergency
let sosScriptMatch = appJS.match(/<script>\s*(window\.sosHoldTimer = null;[\s\S]*?)\s*<\/script>/);
let sosScript = '';
if (sosScriptMatch) {
    sosScript = sosScriptMatch[1];
    appJS = appJS.replace(sosScriptMatch[0], ''); // Remove the script block from HTML
}

// Extract the script from #intelligence
let intelScriptMatch = appJS.match(/<script>\s*(window\.runAISimulation = function\(\) {[\s\S]*?)\s*<\/script>/);
let intelScript = '';
if (intelScriptMatch) {
    intelScript = intelScriptMatch[1];
    appJS = appJS.replace(intelScriptMatch[0], ''); // Remove the script block from HTML
}

// Add the sound logic to the SOS script!
// We'll wrap the SOS script in an IIFE or just add the audio context to window
const soundLogic = `
window.sosAudioCtx = null;
window.sosOscillator = null;

function playSiren() {
    if (!window.sosAudioCtx) {
        window.sosAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window.sosOscillator) {
        window.sosOscillator.stop();
    }
    window.sosOscillator = window.sosAudioCtx.createOscillator();
    const gainNode = window.sosAudioCtx.createGain();
    
    window.sosOscillator.type = 'square';
    window.sosOscillator.frequency.setValueAtTime(400, window.sosAudioCtx.currentTime);
    
    // Siren frequency modulation
    let time = window.sosAudioCtx.currentTime;
    for (let i = 0; i < 20; i++) {
        window.sosOscillator.frequency.linearRampToValueAtTime(800, time + 0.5);
        time += 0.5;
        window.sosOscillator.frequency.linearRampToValueAtTime(400, time + 0.5);
        time += 0.5;
    }
    
    gainNode.gain.setValueAtTime(0.1, window.sosAudioCtx.currentTime);
    
    window.sosOscillator.connect(gainNode);
    gainNode.connect(window.sosAudioCtx.destination);
    window.sosOscillator.start();
}

function stopSiren() {
    if (window.sosOscillator) {
        window.sosOscillator.stop();
        window.sosOscillator = null;
    }
}
`;

// Inject the siren into the window.triggerSOSSequence function
sosScript = sosScript.replace('window.triggerSOSSequence = function() {', 'window.triggerSOSSequence = function() {\n    playSiren();');
sosScript = sosScript.replace('window.resetSOS = function() {', 'window.resetSOS = function() {\n    stopSiren();');

// Append the scripts to the end of app.js
appJS += '\n\n// --- INJECTED MODULE LOGIC ---\n';
appJS += soundLogic + '\n';
appJS += sosScript + '\n';
appJS += intelScript + '\n';

fs.writeFileSync('js/app.js', appJS);
console.log("Moved scripts out of HTML and added siren sound!");
