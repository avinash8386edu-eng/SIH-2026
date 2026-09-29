const fs = require('fs');

let content = fs.readFileSync('js/app.js', 'utf-8');

const newCargoScanView = "        '#cargo-scan': `\n" +
"            <div>\n" +
"                <h2 style=\"font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);\">QR ENGINE & CHAIN OF CUSTODY</h2>\n" +
"                <p style=\"color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;\">Optical inspection and tamper-evident cryptographic tracking.</p>\n" +
"                \n" +
"                <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 30px;\">\n" +
"                    <!-- Scanner Module -->\n" +
"                    <div class=\"glass-panel\" style=\"padding: 30px; text-align: center;\">\n" +
"                        <h3 style=\"margin-bottom: 20px; color: var(--accent-cyan);\">OPTICAL SCANNER</h3>\n" +
"                        <div class=\"scanner-container\" style=\"background: rgba(0,0,0,0.5); border-radius: 8px; padding: 20px; border: 1px solid rgba(0,229,255,0.2);\">\n" +
"                            <div class=\"scanner-reticle\" style=\"margin: 0 auto 20px;\">\n" +
"                                <div class=\"laser\"></div>\n" +
"                                <video id=\"qr-video\" style=\"width: 100%; height: 100%; object-fit: cover; display: none;\"></video>\n" +
"                            </div>\n" +
"                            \n" +
"                            <div style=\"display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;\">\n" +
"                                <button class=\"btn-cyber\" id=\"btn-start-camera\" style=\"flex: 1; padding: 12px; font-size: 0.9rem;\"><i class=\"fa-solid fa-camera\"></i> START CAMERA</button>\n" +
"                                <button class=\"btn-cyber\" id=\"btn-upload-qr\" style=\"flex: 1; padding: 12px; font-size: 0.9rem;\"><i class=\"fa-solid fa-upload\"></i> UPLOAD IMAGE</button>\n" +
"                            </div>\n" +
"                            \n" +
"                            <div style=\"display: flex; gap: 10px; align-items: center; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 20px;\">\n" +
"                                <input type=\"text\" id=\"manual-qr-input\" placeholder=\"Enter Unique Cargo ID...\" style=\"flex: 2; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);\">\n" +
"                                <button class=\"btn-cyber\" id=\"btn-manual-lookup\" style=\"flex: 1; padding: 12px;\"><i class=\"fa-solid fa-magnifying-glass\"></i> LOOKUP</button>\n" +
"                            </div>\n" +
"                        </div>\n" +
"                    </div>\n" +
"\n" +
"                    <!-- Chain of Custody Timeline -->\n" +
"                    <div class=\"glass-panel\" id=\"custody-panel\" style=\"padding: 30px; display: none;\">\n" +
"                        <h3 style=\"margin-bottom: 10px; color: var(--accent-cyan);\">CUSTODY AUDIT LOG</h3>\n" +
"                        <p id=\"cargo-title\" style=\"font-family: var(--font-mono); color: white; font-size: 1.2rem; margin-bottom: 20px;\">CRG-WAITING</p>\n" +
"                        \n" +
"                        <div class=\"timeline\" id=\"cargo-timeline\" style=\"flex-direction: column; max-width: 100%; margin: 0;\">\n" +
"                            <!-- Timeline nodes injected dynamically -->\n" +
"                        </div>\n" +
"                        \n" +
"                        <button class=\"btn-cyber\" id=\"btn-verify-hash\" style=\"margin-top: 20px; width: 100%; border-color: #FFCC00; color: #FFCC00;\">VERIFY CRYPTOGRAPHIC INTEGRITY (SHA-256)</button>\n" +
"                        <div id=\"hash-result\" style=\"margin-top: 15px; font-family: var(--font-mono); font-size: 0.9rem; word-break: break-all;\"></div>\n" +
"                    </div>\n" +
"                </div>\n" +
"                \n" +
"                <!-- Generator Module -->\n" +
"                <div class=\"glass-panel\" style=\"margin-top: 30px; padding: 30px;\">\n" +
"                    <h3 style=\"margin-bottom: 20px; color: var(--accent-cyan);\">GENERATE NEW CARGO TAG</h3>\n" +
"                    <div style=\"display: flex; gap: 20px; align-items: center; margin-bottom: 15px;\">\n" +
"                        <input type=\"text\" id=\"new-cargo-name\" placeholder=\"Cargo Description (e.g. Ice Core Samples)\" style=\"flex: 2; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);\">\n" +
"                        <select id=\"new-cargo-base\" style=\"flex: 1; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);\">\n" +
"                            <option value=\"Goa\">Origin: Goa Depot</option>\n" +
"                            <option value=\"Cape Town\">Origin: Cape Town</option>\n" +
"                        </select>\n" +
"                        <select id=\"new-cargo-dest\" style=\"flex: 1; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);\">\n" +
"                            <option value=\"Bharati\">Dest: Bharati</option>\n" +
"                            <option value=\"Maitri\">Dest: Maitri</option>\n" +
"                        </select>\n" +
"                        <button class=\"btn-cyber\" id=\"btn-generate-qr\" style=\"padding: 12px;\"><i class=\"fa-solid fa-qrcode\"></i> GENERATE SECURE TAG</button>\n" +
"                    </div>\n" +
"                    \n" +
"                    <div id=\"generated-qr-result\" style=\"display: none; padding: 20px; background: rgba(0, 255, 102, 0.1); border-left: 4px solid #00FF66; margin-top: 20px;\">\n" +
"                        <h4 style=\"color: #00FF66; margin-bottom: 10px;\">SUCCESS: CARGO SECURED</h4>\n" +
"                        <p style=\"font-family: var(--font-mono); color: white;\">Unique Tracking ID: <strong id=\"generated-cargo-id\" style=\"font-size: 1.5rem; letter-spacing: 2px; user-select: all; background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 4px; margin-left: 10px;\"></strong></p>\n" +
"                        <p style=\"font-size: 0.85rem; color: var(--text-muted); margin-top: 10px;\">* Use this Unique ID in the Optical Scanner manual lookup above to test the Chain of Custody.</p>\n" +
"                    </div>\n" +
"                </div>\n" +
"            </div>\n" +
"        `,";

// Safe replacement of cargo-scan view using indexOf to avoid greedy regex bugs
const startView = content.indexOf("'#cargo-scan':");
const endView = content.indexOf("'#intelligence':");
if (startView !== -1 && endView !== -1) {
    content = content.substring(0, startView) + newCargoScanView + '\n        ' + content.substring(endView);
}

// Replace the event listener
const startLogic = content.indexOf('if(e.target.id === "btn-generate-qr") {');
const endLogicStr = 'document.getElementById("new-cargo-name").value = "";\n            } catch';
const endLogic = content.indexOf(endLogicStr);

if (startLogic !== -1 && endLogic !== -1) {
    const newGenLogic = "if(e.target.id === \"btn-generate-qr\") {\n" +
    "            const name = document.getElementById(\"new-cargo-name\").value.trim();\n" +
    "            if(!name) return GlobalUI.showToast(\"Enter cargo name\", \"error\");\n" +
    "            \n" +
    "            const uniqueId = \"CRG-\" + Math.floor(Math.random()*100000);\n" +
    "            \n" +
    "            const cargo = {\n" +
    "                cargoCode: uniqueId,\n" +
    "                name: name,\n" +
    "                category: \"EQUIPMENT\",\n" +
    "                weight: 50.0,\n" +
    "                priority: \"HIGH\",\n" +
    "                status: \"GOA_DEPOT\",\n" +
    "                qrCode: uniqueId,\n" +
    "                description: \"Auto-generated from Terminal\"\n" +
    "            };\n" +
    "\n" +
    "            try {\n" +
    "                const res = await fetch(\"http://localhost:8080/api/cargo\", {\n" +
    "                    method: \"POST\",\n" +
    "                    headers: {\"Content-Type\": \"application/json\"},\n" +
    "                    body: JSON.stringify(cargo)\n" +
    "                });\n" +
    "                const saved = await res.json();\n" +
    "                GlobalUI.showToast(`Cargo ${saved.cargoCode} Generated!`, \"success\");\n" +
    "                \n" +
    "                // Add initial event\n" +
    "                await fetch(`http://localhost:8080/api/cargo/${saved.id}/scan`, {\n" +
    "                    method: \"POST\",\n" +
    "                    headers: {\"Content-Type\": \"application/json\"},\n" +
    "                    body: JSON.stringify({ location: \"Goa Depot (Origin)\", notes: \"Initial Tagging\" })\n" +
    "                });\n" +
    "\n" +
    "                // Display the unique ID so user can copy and search it!\n" +
    "                document.getElementById(\"generated-qr-result\").style.display = \"block\";\n" +
    "                document.getElementById(\"generated-cargo-id\").innerText = saved.cargoCode;\n" +
    "\n" +
    "                // Reset input\n" +
    "                document.getElementById(\"new-cargo-name\").value = \"\";\n" +
    "            } catch";

    content = content.substring(0, startLogic) + newGenLogic + content.substring(endLogic + endLogicStr.length - 7);
}

fs.writeFileSync('js/app.js', content, 'utf-8');
console.log("Safely updated QR logic");
