const canvas = document.createElement('canvas');
canvas.id = 'polar-canvas';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');

// Styling canvas via JS
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none'; // Important so it doesn't block clicks

let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 };

// Resize canvas
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Track mouse for interaction (Attached to window so it tracks even over other elements)
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Touch support for mobile
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Particle configuration
const particleCount = 200;
const repulsionRadius = 180;
const repulsionForce = 0.08;

class Particle {
    constructor() {
        this.reset(true);
    }

    reset(randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : -10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.baseX = this.x;
        // Used for sine wave swaying
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.02 + 0.01;
        // Color variation (white/cyan)
        this.color = Math.random() > 0.8 ? 'rgba(0, 229, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';
    }

    update() {
        // Normal falling movement
        this.y += this.speedY;
        this.angle += this.angleSpeed;
        this.x = this.baseX + Math.sin(this.angle) * 15;

        // Mouse Repulsion Logic
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Calculate force magnitude based on distance
            let force = (repulsionRadius - distance) / repulsionRadius;
            
            // Apply repulsion
            let repulseX = forceDirectionX * force * repulsionRadius * repulsionForce;
            let repulseY = forceDirectionY * force * repulsionRadius * repulsionForce;
            
            this.x -= repulseX;
            this.baseX -= repulseX; // Shift the base X so it doesn't just snap back
            this.y -= repulseY;
        }

        // Wrap around screen
        if (this.y > height + 10) {
            this.reset(false);
        }
        if (this.x > width + 20) this.baseX = -10;
        if (this.x < -20) this.baseX = width + 10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glow effect for larger particles
        if (this.size > 1.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Aurora Variables
let time = 0;

function drawAurora() {
    time += 0.003;
    
    // Draw a deep polar sky gradient
    let bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#000000');
    bgGradient.addColorStop(0.4, '#010a15');
    bgGradient.addColorStop(1, '#00151f');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Aurora Waves
    ctx.globalCompositeOperation = 'screen';
    
    // Wave 1 - Deep Cyan/Teal
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 30) {
        let y = height * 0.3 + Math.sin(x * 0.002 + time) * 150 + Math.cos(x * 0.005 - time) * 80;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    
    let grad1 = ctx.createLinearGradient(0, height*0.1, 0, height*0.7);
    grad1.addColorStop(0, 'rgba(0, 229, 255, 0)');
    grad1.addColorStop(0.3, 'rgba(0, 229, 255, 0.15)');
    grad1.addColorStop(1, 'rgba(0, 100, 255, 0)');
    ctx.fillStyle = grad1;
    ctx.fill();

    // Wave 2 - Emerald/Green (Northern Lights)
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 30) {
        let y = height * 0.45 + Math.sin(x * 0.003 - time * 1.1) * 120 + Math.cos(x * 0.001 + time) * 90;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    
    let grad2 = ctx.createLinearGradient(0, height*0.2, 0, height*0.8);
    grad2.addColorStop(0, 'rgba(46, 204, 113, 0)');
    grad2.addColorStop(0.4, 'rgba(46, 204, 113, 0.1)');
    grad2.addColorStop(1, 'rgba(0, 50, 100, 0)');
    ctx.fillStyle = grad2;
    ctx.fill();
    
    // Starfield (Static dots in background)
    // For performance, stars should be drawn on a separate offscreen canvas, 
    // but drawing them with low opacity is fine.

    ctx.globalCompositeOperation = 'source-over';
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw Aurora Background
    drawAurora();

    // Draw Interactive Snow
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();
