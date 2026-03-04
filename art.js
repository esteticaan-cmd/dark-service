// art.js — Canvas rendering for backgrounds and character silhouettes
const ArtRenderer = (() => {
    let canvas, ctx;
    let w, h;
    let animFrame = null;
    let currentBg = null;
    let currentChars = [];
    let flickerEnabled = true;
    let flickerIntensity = 0;
    let time = 0;

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        render();
    }

    function setEffects(enabled) {
        flickerEnabled = enabled;
    }

    // === COLOR PALETTES — VIBRANT & UNIQUE PER LOCATION ===
    const palettes = {
        barracks: {
            sky: '#1a1508',
            walls: '#2e2818',
            floor: '#221c0e',
            accent: '#4a3d20',
            light: 'rgba(200, 170, 80, 0.15)',
            lampColor: '#d4a840',
        },
        parade: {
            sky: '#1a2230',
            ground: '#1e2428',
            horizon: '#2a3540',
            accent: '#3a4858',
            light: 'rgba(120, 160, 200, 0.08)',
        },
        mess: {
            sky: '#1a1208',
            walls: '#2e2215',
            floor: '#201810',
            accent: '#4a3520',
            light: 'rgba(220, 150, 60, 0.18)',
            lampColor: '#e89030',
        },
        range: {
            sky: '#2a1510',
            ground: '#2e2018',
            horizon: '#4a2515',
            accent: '#6a3520',
            light: 'rgba(230, 100, 40, 0.12)',
            sunColor: '#e85020',
        },
        guardpost: {
            sky: '#0a1510',
            walls: '#182820',
            floor: '#102018',
            accent: '#204030',
            light: 'rgba(100, 220, 150, 0.1)',
            lampColor: '#60d890',
        },
        medbay: {
            sky: '#0e1218',
            walls: '#202830',
            floor: '#181e25',
            accent: '#303e50',
            light: 'rgba(130, 180, 220, 0.1)',
        },
        night: {
            sky: '#060818',
            walls: '#0e1028',
            floor: '#0a0c1e',
            accent: '#182040',
            light: 'rgba(80, 100, 180, 0.08)',
            moonColor: '#6080c0',
        },
        outside: {
            sky: '#1e1520',
            ground: '#201a18',
            horizon: '#3a2530',
            accent: '#4a3040',
            light: 'rgba(200, 130, 100, 0.08)',
            sunColor: '#e08060',
        },
        office: {
            sky: '#1a1510',
            walls: '#302518',
            floor: '#251c12',
            accent: '#4a3825',
            light: 'rgba(180, 140, 80, 0.15)',
            lampColor: '#c8a050',
        },
        road: {
            sky: '#201518',
            ground: '#1e1815',
            horizon: '#3a2028',
            accent: '#5a3038',
            light: 'rgba(230, 150, 100, 0.12)',
            sunColor: '#e89060',
        },
        factory: {
            sky: '#18180e',
            walls: '#282818',
            floor: '#1e1e10',
            accent: '#3e3e20',
            light: 'rgba(200, 200, 80, 0.1)',
            lampColor: '#c8c840',
        },
    };

    // === BACKGROUND RENDERERS ===
    function drawBarracks() {
        const p = palettes.barracks;

        // Ceiling — warm tones
        const ceilGrad = ctx.createLinearGradient(0, 0, 0, h * 0.15);
        ceilGrad.addColorStop(0, '#12100a');
        ceilGrad.addColorStop(1, p.sky);
        ctx.fillStyle = ceilGrad;
        ctx.fillRect(0, 0, w, h * 0.15);

        // Back wall — warm yellow lamp light
        const wallGrad = ctx.createLinearGradient(0, h * 0.1, 0, h * 0.65);
        wallGrad.addColorStop(0, '#3a3020');
        wallGrad.addColorStop(1, p.walls);
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, h * 0.1, w, h * 0.55);

        // Wall texture - horizontal lines
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 1;
        for (let y = h * 0.15; y < h * 0.6; y += 18) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Window (dim warm light)
        const winX = w * 0.65;
        const winY = h * 0.18;
        const winW = w * 0.12;
        const winH = h * 0.18;
        ctx.fillStyle = 'rgba(40, 35, 20, 0.9)';
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = 'rgba(60, 50, 30, 0.5)';
        ctx.fillRect(winX + 2, winY + 2, winW - 4, winH - 4);
        ctx.strokeStyle = '#4a4030';
        ctx.lineWidth = 2;
        ctx.strokeRect(winX, winY, winW, winH);
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.stroke();

        // Floor
        const floorGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
        floorGrad.addColorStop(0, '#2e2818');
        floorGrad.addColorStop(1, p.floor);
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);

        // Floor planks
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        for (let x = 0; x < w; x += w / 8) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.6);
            ctx.lineTo(x - 20, h);
            ctx.stroke();
        }

        // Bunk beds
        drawBunkBed(w * 0.05, h * 0.25, w * 0.2, h * 0.38);
        drawBunkBed(w * 0.28, h * 0.25, w * 0.2, h * 0.38);

        // Warm overhead lamp glow
        const lightGrad = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, h * 0.6);
        lightGrad.addColorStop(0, 'rgba(200, 170, 80, 0.15)');
        lightGrad.addColorStop(0.5, 'rgba(180, 140, 50, 0.06)');
        lightGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, w, h);

        // Lamp fixture
        ctx.fillStyle = p.lampColor;
        ctx.globalAlpha = 0.3 + Math.sin(time * 2) * 0.05;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.08, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawBunkBed(x, y, bw, bh) {
        ctx.strokeStyle = '#3a3528';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x, y + bh);
        ctx.moveTo(x + bw, y); ctx.lineTo(x + bw, y + bh);
        ctx.stroke();
        ctx.fillStyle = 'rgba(50, 45, 30, 0.6)';
        ctx.fillRect(x, y + bh * 0.1, bw, bh * 0.08);
        ctx.fillRect(x, y + bh * 0.55, bw, bh * 0.08);
        ctx.fillStyle = 'rgba(55, 48, 35, 0.5)';
        ctx.fillRect(x + 2, y + bh * 0.18, bw - 4, bh * 0.1);
        ctx.fillRect(x + 2, y + bh * 0.63, bw - 4, bh * 0.1);
    }

    function drawParade() {
        const p = palettes.parade;

        // Cold blue-grey sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        skyGrad.addColorStop(0, '#152030');
        skyGrad.addColorStop(1, '#253545');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.45);

        // Distant buildings silhouette — bluish
        ctx.fillStyle = '#1a2838';
        const buildings = [0.08, 0.15, 0.12, 0.18, 0.1, 0.14, 0.16, 0.09, 0.13];
        let bx = 0;
        buildings.forEach(bh2 => {
            const bw2 = w / buildings.length;
            ctx.fillRect(bx, h * 0.45 - h * bh2, bw2 - 2, h * bh2);
            bx += bw2;
        });

        // Ground — cold grey
        const groundGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
        groundGrad.addColorStop(0, p.horizon);
        groundGrad.addColorStop(1, p.ground);
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Ground texture - cracks
        ctx.strokeStyle = 'rgba(100,130,160,0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
            const sx = Math.random() * w;
            const sy = h * 0.5 + Math.random() * h * 0.4;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + (Math.random() - 0.5) * 60, sy + Math.random() * 30);
            ctx.stroke();
        }

        // Flag pole
        const fpX = w * 0.8;
        ctx.strokeStyle = '#4a5868';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fpX, h * 0.45);
        ctx.lineTo(fpX, h * 0.12);
        ctx.stroke();

        // Flag — faded blue
        ctx.fillStyle = 'rgba(80, 110, 140, 0.4)';
        ctx.beginPath();
        ctx.moveTo(fpX, h * 0.14);
        ctx.lineTo(fpX + w * 0.06, h * 0.16 + Math.sin(time * 0.5) * 3);
        ctx.lineTo(fpX + w * 0.05, h * 0.22 + Math.sin(time * 0.5 + 1) * 2);
        ctx.lineTo(fpX, h * 0.22);
        ctx.fill();

        // Cold atmosphere haze
        const hazeGrad = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.5);
        hazeGrad.addColorStop(0, 'rgba(120, 150, 180, 0.04)');
        hazeGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(0, 0, w, h);
    }

    function drawMessHall() {
        const p = palettes.mess;

        // Ceiling
        ctx.fillStyle = '#15100a';
        ctx.fillRect(0, 0, w, h * 0.12);

        // Walls — warm orange tint
        const wallGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.55);
        wallGrad.addColorStop(0, '#3a2815');
        wallGrad.addColorStop(1, p.walls);
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, h * 0.08, w, h * 0.47);

        // Dirty wall stains
        for (let i = 0; i < 5; i++) {
            const sx = Math.random() * w;
            const sy = h * 0.15 + Math.random() * h * 0.3;
            const sr = 20 + Math.random() * 40;
            const stainGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
            stainGrad.addColorStop(0, 'rgba(40, 30, 15, 0.3)');
            stainGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = stainGrad;
            ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
        }

        // Floor — warm
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        // Floor tiles
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        const tileSize = 40;
        for (let tx = 0; tx < w; tx += tileSize) {
            for (let ty = h * 0.55; ty < h; ty += tileSize) {
                ctx.strokeRect(tx, ty, tileSize, tileSize);
            }
        }

        // Tables
        drawTable(w * 0.1, h * 0.5, w * 0.3, h * 0.06);
        drawTable(w * 0.55, h * 0.5, w * 0.3, h * 0.06);

        // Warm overhead lamp glow — orange
        const lampX = w * 0.35;
        const lampGrad = ctx.createRadialGradient(lampX, h * 0.08, 0, lampX, h * 0.08, h * 0.5);
        lampGrad.addColorStop(0, 'rgba(220, 150, 60, 0.18)');
        lampGrad.addColorStop(0.4, 'rgba(200, 120, 40, 0.08)');
        lampGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(0, 0, w, h * 0.7);

        // Second lamp
        const lamp2X = w * 0.7;
        const lamp2Grad = ctx.createRadialGradient(lamp2X, h * 0.08, 0, lamp2X, h * 0.08, h * 0.4);
        lamp2Grad.addColorStop(0, 'rgba(220, 150, 60, 0.12)');
        lamp2Grad.addColorStop(1, 'transparent');
        ctx.fillStyle = lamp2Grad;
        ctx.fillRect(w * 0.3, 0, w * 0.7, h * 0.6);

        // Lamp dots
        ctx.fillStyle = p.lampColor;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(lampX, h * 0.06, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lamp2X, h * 0.06, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawTable(x, y, tw, th) {
        ctx.fillStyle = '#3a3020';
        ctx.fillRect(x, y, tw, th);
        ctx.strokeStyle = '#2a2015';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tw, th);
        ctx.fillStyle = '#302818';
        ctx.fillRect(x + 4, y + th, 4, h * 0.12);
        ctx.fillRect(x + tw - 8, y + th, 4, h * 0.12);
    }

    function drawRange() {
        const p = palettes.range;

        // Sunset sky — red-orange gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        skyGrad.addColorStop(0, '#1a0a10');
        skyGrad.addColorStop(0.3, '#3a1510');
        skyGrad.addColorStop(0.7, '#5a2818');
        skyGrad.addColorStop(1, '#6a3520');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Sun glow on horizon
        const sunGrad = ctx.createRadialGradient(w * 0.7, h * 0.35, 0, w * 0.7, h * 0.35, h * 0.3);
        sunGrad.addColorStop(0, 'rgba(230, 100, 40, 0.25)');
        sunGrad.addColorStop(0.5, 'rgba(200, 70, 20, 0.1)');
        sunGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, w, h * 0.5);

        // Clouds — reddish
        ctx.fillStyle = 'rgba(80, 30, 20, 0.35)';
        for (let i = 0; i < 4; i++) {
            const cx = w * (0.1 + i * 0.25);
            const cy = h * (0.08 + Math.sin(i) * 0.05);
            const cw2 = w * 0.15;
            const ch2 = h * 0.04;
            ctx.beginPath();
            ctx.ellipse(cx, cy, cw2, ch2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Treeline — dark silhouette against sunset
        ctx.fillStyle = '#1a0e0a';
        for (let tx = 0; tx < w; tx += 25) {
            const th2 = h * (0.06 + Math.sin(tx * 0.1) * 0.03);
            ctx.beginPath();
            ctx.moveTo(tx, h * 0.4);
            ctx.lineTo(tx + 12, h * 0.4 - th2);
            ctx.lineTo(tx + 25, h * 0.4);
            ctx.fill();
        }

        // Ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
        groundGrad.addColorStop(0, '#302018');
        groundGrad.addColorStop(1, p.ground);
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.4, w, h * 0.6);

        // Shooting lanes
        ctx.strokeStyle = 'rgba(80, 50, 30, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const lx = w * (i / 5);
            ctx.beginPath();
            ctx.moveTo(lx, h * 0.45);
            ctx.lineTo(lx, h);
            ctx.stroke();
        }

        // Targets — visible against sunset
        for (let i = 1; i <= 4; i++) {
            const tx = w * (i / 5) - w * 0.05;
            const ty = h * 0.42;
            drawTarget(tx, ty, 16);
        }

        // Sandbag line
        ctx.fillStyle = '#3a3020';
        for (let sx = 0; sx < w; sx += 30) {
            ctx.beginPath();
            ctx.ellipse(sx + 15, h * 0.7, 16, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawTarget(x, y, r) {
        ctx.fillStyle = '#3a2a18';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#5a4a30';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        // Center red dot
        ctx.fillStyle = 'rgba(180, 50, 30, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawGuardpost() {
        const p = palettes.guardpost;

        // Night sky — green-tinted
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
        skyGrad.addColorStop(0, '#050e08');
        skyGrad.addColorStop(1, '#0e2018');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.5);

        // Stars
        ctx.fillStyle = 'rgba(150, 200, 170, 0.4)';
        for (let i = 0; i < 20; i++) {
            const sx = Math.random() * w;
            const sy = Math.random() * h * 0.35;
            ctx.fillRect(sx, sy, 1.5, 1.5);
        }

        // Guard booth
        const bx2 = w * 0.3;
        const by2 = h * 0.2;
        const bw2 = w * 0.4;
        const bh2 = h * 0.4;
        ctx.fillStyle = '#142820';
        ctx.fillRect(bx2, by2, bw2, bh2);
        // Roof
        ctx.fillStyle = '#0e2018';
        ctx.beginPath();
        ctx.moveTo(bx2 - 10, by2);
        ctx.lineTo(bx2 + bw2 / 2, by2 - h * 0.06);
        ctx.lineTo(bx2 + bw2 + 10, by2);
        ctx.fill();
        // Window — green fluorescent glow
        ctx.fillStyle = 'rgba(80, 200, 120, 0.2)';
        ctx.fillRect(bx2 + bw2 * 0.2, by2 + bh2 * 0.15, bw2 * 0.6, bh2 * 0.35);

        // Fluorescent light spill from window
        const fluGrad = ctx.createRadialGradient(
            bx2 + bw2 * 0.5, by2 + bh2 * 0.3, 0,
            bx2 + bw2 * 0.5, by2 + bh2 * 0.3, h * 0.4
        );
        fluGrad.addColorStop(0, 'rgba(80, 200, 120, 0.08)');
        fluGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fluGrad;
        ctx.fillRect(0, 0, w, h);

        // Ground — greenish tint
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        // Fence
        ctx.strokeStyle = '#2a4035';
        ctx.lineWidth = 2;
        for (let fx = 0; fx < w; fx += 40) {
            ctx.beginPath();
            ctx.moveTo(fx, h * 0.42);
            ctx.lineTo(fx, h * 0.55);
            ctx.stroke();
        }
        // Wire
        ctx.strokeStyle = '#1e3830';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.44);
        for (let fx = 0; fx < w; fx += 10) {
            ctx.lineTo(fx, h * 0.44 + Math.sin(fx * 0.1) * 2);
        }
        ctx.stroke();

        // Flickering lamp
        ctx.fillStyle = p.lampColor;
        ctx.globalAlpha = 0.3 + Math.sin(time * 8) * 0.1;
        ctx.beginPath();
        ctx.arc(bx2 + bw2 * 0.5, by2 - h * 0.02, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawMedbay() {
        const p = palettes.medbay;

        ctx.fillStyle = '#0e1520';
        ctx.fillRect(0, 0, w, h * 0.1);

        // Walls — cold blue-white
        const wallGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.55);
        wallGrad.addColorStop(0, '#253040');
        wallGrad.addColorStop(1, '#1e2830');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, h * 0.08, w, h * 0.52);

        // Floor — cold tiles
        ctx.fillStyle = '#181e28';
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        // Tiles
        ctx.strokeStyle = 'rgba(50,70,90,0.2)';
        const ts = 35;
        for (let tx = 0; tx < w; tx += ts) {
            for (let ty = h * 0.55; ty < h; ty += ts) {
                ctx.strokeRect(tx, ty, ts, ts);
            }
        }

        // Bed
        ctx.fillStyle = '#2a3040';
        ctx.fillRect(w * 0.15, h * 0.38, w * 0.35, h * 0.05);
        ctx.fillRect(w * 0.16, h * 0.43, 3, h * 0.12);
        ctx.fillRect(w * 0.48, h * 0.43, 3, h * 0.12);
        ctx.fillStyle = '#303848';
        ctx.fillRect(w * 0.16, h * 0.33, w * 0.33, h * 0.06);

        // Red cross on wall
        ctx.fillStyle = 'rgba(180, 40, 40, 0.5)';
        ctx.fillRect(w * 0.72, h * 0.18, w * 0.02, h * 0.1);
        ctx.fillRect(w * 0.68, h * 0.22, w * 0.1, h * 0.02);

        // Harsh fluorescent light
        const lampGrad = ctx.createRadialGradient(w * 0.4, h * 0.05, 0, w * 0.4, h * 0.05, h * 0.5);
        lampGrad.addColorStop(0, 'rgba(130, 180, 220, 0.1)');
        lampGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(0, 0, w, h);
    }

    function drawNightBarracks() {
        const p = palettes.night;

        // Deep blue sky
        ctx.fillStyle = p.sky;
        ctx.fillRect(0, 0, w, h * 0.15);

        // Walls — deep blue
        ctx.fillStyle = p.walls;
        ctx.fillRect(0, h * 0.1, w, h * 0.55);

        // Floor
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);

        // Bunk outlines in blue moonlight
        ctx.strokeStyle = 'rgba(40, 50, 80, 0.3)';
        ctx.lineWidth = 1;
        drawBunkBed(w * 0.05, h * 0.25, w * 0.2, h * 0.38);
        drawBunkBed(w * 0.28, h * 0.25, w * 0.2, h * 0.38);

        // Moon through window — strong blue light
        const winX = w * 0.65;
        const winY = h * 0.18;
        ctx.fillStyle = 'rgba(40, 50, 80, 0.5)';
        ctx.fillRect(winX, winY, w * 0.12, h * 0.18);

        // Moon circle
        ctx.fillStyle = 'rgba(140, 170, 220, 0.15)';
        ctx.beginPath();
        ctx.arc(winX + w * 0.04, winY + h * 0.06, 12, 0, Math.PI * 2);
        ctx.fill();

        // Moonlight beam across floor
        const moonGrad = ctx.createRadialGradient(
            winX + w * 0.06, winY + h * 0.09, 0,
            winX + w * 0.06, winY + h * 0.09, h * 0.5
        );
        moonGrad.addColorStop(0, 'rgba(80, 100, 180, 0.12)');
        moonGrad.addColorStop(0.5, 'rgba(60, 80, 150, 0.05)');
        moonGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = moonGrad;
        ctx.fillRect(0, 0, w, h);

        // Light streak on floor
        ctx.fillStyle = 'rgba(60, 80, 140, 0.06)';
        ctx.beginPath();
        ctx.moveTo(winX, winY + h * 0.18);
        ctx.lineTo(winX - w * 0.15, h);
        ctx.lineTo(winX + w * 0.12 + w * 0.05, h);
        ctx.lineTo(winX + w * 0.12, winY + h * 0.18);
        ctx.fill();
    }

    function drawOutside() {
        const p = palettes.outside;

        // Dawn sky — pink-orange
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        skyGrad.addColorStop(0, '#1a1020');
        skyGrad.addColorStop(0.4, '#2a1520');
        skyGrad.addColorStop(0.8, '#3a2028');
        skyGrad.addColorStop(1, '#4a2830');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.45);

        // Dawn glow on horizon
        const dawnGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, w * 0.5);
        dawnGrad.addColorStop(0, 'rgba(200, 120, 80, 0.15)');
        dawnGrad.addColorStop(0.5, 'rgba(180, 90, 60, 0.06)');
        dawnGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = dawnGrad;
        ctx.fillRect(0, 0, w, h * 0.5);

        // Building silhouettes — dark against dawn
        ctx.fillStyle = '#1a1218';
        ctx.fillRect(w * 0.05, h * 0.25, w * 0.2, h * 0.2);
        ctx.fillRect(w * 0.3, h * 0.2, w * 0.15, h * 0.25);
        ctx.fillRect(w * 0.7, h * 0.28, w * 0.25, h * 0.17);

        // Ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
        groundGrad.addColorStop(0, '#2a2020');
        groundGrad.addColorStop(1, p.ground);
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Path
        ctx.fillStyle = 'rgba(30, 22, 18, 0.5)';
        ctx.beginPath();
        ctx.moveTo(w * 0.35, h);
        ctx.lineTo(w * 0.45, h * 0.45);
        ctx.lineTo(w * 0.55, h * 0.45);
        ctx.lineTo(w * 0.65, h);
        ctx.fill();
    }

    function drawOffice() {
        const p = palettes.office;

        // Ceiling
        ctx.fillStyle = '#15100a';
        ctx.fillRect(0, 0, w, h * 0.12);

        // Walls — warm brown wood-paneled
        const wallGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.55);
        wallGrad.addColorStop(0, '#3a2a18');
        wallGrad.addColorStop(1, p.walls);
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, h * 0.08, w, h * 0.47);

        // Wood paneling lines
        ctx.strokeStyle = 'rgba(80, 60, 30, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += w * 0.15) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.08);
            ctx.lineTo(x, h * 0.55);
            ctx.stroke();
        }

        // Desk
        ctx.fillStyle = '#3a2a18';
        ctx.fillRect(w * 0.25, h * 0.45, w * 0.5, h * 0.06);
        ctx.fillStyle = '#302215';
        ctx.fillRect(w * 0.28, h * 0.51, 4, h * 0.12);
        ctx.fillRect(w * 0.72, h * 0.51, 4, h * 0.12);

        // Items on desk
        ctx.fillStyle = 'rgba(60, 50, 30, 0.6)';
        ctx.fillRect(w * 0.35, h * 0.41, w * 0.08, h * 0.04); // papers
        ctx.fillStyle = 'rgba(100, 60, 30, 0.4)';
        ctx.fillRect(w * 0.55, h * 0.42, w * 0.03, h * 0.03); // glass

        // Floor — carpet
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        // Warm desk lamp glow
        const lampGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, h * 0.35);
        lampGrad.addColorStop(0, 'rgba(180, 140, 80, 0.2)');
        lampGrad.addColorStop(0.5, 'rgba(160, 120, 60, 0.08)');
        lampGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(0, 0, w, h);

        // Window behind desk — dark
        ctx.fillStyle = 'rgba(20, 15, 10, 0.8)';
        ctx.fillRect(w * 0.4, h * 0.12, w * 0.2, h * 0.2);
        ctx.strokeStyle = '#4a3820';
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.4, h * 0.12, w * 0.2, h * 0.2);
    }

    function drawRoad() {
        const p = palettes.road;

        // Dawn sky — pink-orange-rose
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
        skyGrad.addColorStop(0, '#1e1018');
        skyGrad.addColorStop(0.3, '#3a1820');
        skyGrad.addColorStop(0.6, '#5a2828');
        skyGrad.addColorStop(1, '#6a3830');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.5);

        // Sun rising
        const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, h * 0.3);
        sunGrad.addColorStop(0, 'rgba(230, 150, 80, 0.3)');
        sunGrad.addColorStop(0.3, 'rgba(220, 120, 60, 0.15)');
        sunGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, h * 0.1, w, h * 0.5);

        // Hills silhouette
        ctx.fillStyle = '#201518';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.48);
        for (let x = 0; x <= w; x += 30) {
            ctx.lineTo(x, h * 0.45 + Math.sin(x * 0.005) * h * 0.04 + Math.sin(x * 0.012) * h * 0.02);
        }
        ctx.lineTo(w, h * 0.5);
        ctx.lineTo(0, h * 0.5);
        ctx.fill();

        // Ground
        ctx.fillStyle = p.ground;
        ctx.fillRect(0, h * 0.48, w, h * 0.52);

        // Road — perspective
        ctx.fillStyle = 'rgba(40, 35, 30, 0.7)';
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h);
        ctx.lineTo(w * 0.48, h * 0.48);
        ctx.lineTo(w * 0.52, h * 0.48);
        ctx.lineTo(w * 0.7, h);
        ctx.fill();

        // Road center line — dashed
        ctx.strokeStyle = 'rgba(200, 180, 100, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 20]);
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.48);
        ctx.lineTo(w * 0.5, h);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawFactory() {
        const p = palettes.factory;

        // Yellowish industrial sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        skyGrad.addColorStop(0, '#141208');
        skyGrad.addColorStop(1, '#2a280e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Factory building — large block
        ctx.fillStyle = '#222218';
        ctx.fillRect(w * 0.1, h * 0.15, w * 0.5, h * 0.3);
        // Smokestack
        ctx.fillStyle = '#2a2a1e';
        ctx.fillRect(w * 0.5, h * 0.05, w * 0.04, h * 0.15);
        // Smoke
        ctx.fillStyle = 'rgba(80, 80, 40, 0.15)';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(
                w * 0.52 + Math.sin(time + i) * 10,
                h * 0.04 - i * h * 0.03,
                15 + i * 8, 8 + i * 4, 0, 0, Math.PI * 2
            );
            ctx.fill();
        }

        // Windows — yellow lit
        for (let wx = 0; wx < 4; wx++) {
            for (let wy = 0; wy < 2; wy++) {
                const wPosX = w * 0.15 + wx * w * 0.1;
                const wPosY = h * 0.2 + wy * h * 0.1;
                ctx.fillStyle = 'rgba(200, 200, 80, 0.15)';
                ctx.fillRect(wPosX, wPosY, w * 0.05, h * 0.06);
            }
        }

        // Ground — industrial
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Pipes and debris
        ctx.strokeStyle = '#3a3a20';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.6, h * 0.3);
        ctx.lineTo(w * 0.8, h * 0.3);
        ctx.lineTo(w * 0.8, h * 0.5);
        ctx.stroke();

        // Industrial light
        const lampGrad = ctx.createRadialGradient(w * 0.3, h * 0.15, 0, w * 0.3, h * 0.15, h * 0.4);
        lampGrad.addColorStop(0, 'rgba(200, 200, 80, 0.1)');
        lampGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(0, 0, w, h);
    }

    // === BACKGROUND MAP ===
    const bgRenderers = {
        barracks: drawBarracks,
        parade: drawParade,
        mess: drawMessHall,
        range: drawRange,
        guardpost: drawGuardpost,
        medbay: drawMedbay,
        night_barracks: drawNightBarracks,
        outside: drawOutside,
        office: drawOffice,
        road: drawRoad,
        factory: drawFactory,
    };

    // === CHARACTER SILHOUETTES ===
    function drawCharacter(charId, x, scale) {
        const chars = {
            marko: { height: 0.55, width: 0.12, headR: 0.035, color: '#1a1c1a' },
            goran: { height: 0.6, width: 0.15, headR: 0.038, color: '#181a18', hat: true, broad: true },
            dragan: { height: 0.58, width: 0.14, headR: 0.036, color: '#1c1e1c', broad: true },
            luka: { height: 0.52, width: 0.11, headR: 0.033, color: '#1a1c1a', thin: true },
            zoran: { height: 0.56, width: 0.14, headR: 0.037, color: '#1e201e', hat: true },
            milosh: { height: 0.57, width: 0.13, headR: 0.036, color: '#1c1e1c' },
            soldier: { height: 0.54, width: 0.12, headR: 0.034, color: '#1a1c1a' },
            nenad: { height: 0.53, width: 0.11, headR: 0.034, color: '#1b1d1b' },
            colonel: { height: 0.58, width: 0.14, headR: 0.037, color: '#1e201e', hat: true, broad: true },
        };

        const c = chars[charId] || chars.soldier;
        const cx = w * x;
        const baseY = h * 0.65;
        const ch = h * c.height * (scale || 1);
        const cw = w * c.width * (scale || 1);
        const headR = w * c.headR * (scale || 1);

        // Shadow
        const shadowGrad = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, cw);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.3)');
        shadowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(cx - cw, baseY - 5, cw * 2, 20);

        // Body
        const bodyGrad = ctx.createLinearGradient(cx - cw / 2, baseY - ch, cx + cw / 2, baseY);
        bodyGrad.addColorStop(0, c.color);
        bodyGrad.addColorStop(0.5, 'rgba(20, 22, 20, 0.95)');
        bodyGrad.addColorStop(1, c.color);
        ctx.fillStyle = bodyGrad;

        ctx.beginPath();
        if (c.broad) {
            ctx.moveTo(cx - cw * 0.15, baseY);
            ctx.lineTo(cx - cw * 0.55, baseY - ch * 0.35);
            ctx.lineTo(cx - cw * 0.5, baseY - ch * 0.7);
            ctx.lineTo(cx - cw * 0.2, baseY - ch * 0.82);
            ctx.lineTo(cx + cw * 0.2, baseY - ch * 0.82);
            ctx.lineTo(cx + cw * 0.5, baseY - ch * 0.7);
            ctx.lineTo(cx + cw * 0.55, baseY - ch * 0.35);
            ctx.lineTo(cx + cw * 0.15, baseY);
        } else if (c.thin) {
            ctx.moveTo(cx - cw * 0.12, baseY);
            ctx.lineTo(cx - cw * 0.35, baseY - ch * 0.35);
            ctx.lineTo(cx - cw * 0.35, baseY - ch * 0.7);
            ctx.lineTo(cx - cw * 0.15, baseY - ch * 0.82);
            ctx.lineTo(cx + cw * 0.15, baseY - ch * 0.82);
            ctx.lineTo(cx + cw * 0.35, baseY - ch * 0.7);
            ctx.lineTo(cx + cw * 0.35, baseY - ch * 0.35);
            ctx.lineTo(cx + cw * 0.12, baseY);
        } else {
            ctx.moveTo(cx - cw * 0.13, baseY);
            ctx.lineTo(cx - cw * 0.45, baseY - ch * 0.35);
            ctx.lineTo(cx - cw * 0.42, baseY - ch * 0.7);
            ctx.lineTo(cx - cw * 0.18, baseY - ch * 0.82);
            ctx.lineTo(cx + cw * 0.18, baseY - ch * 0.82);
            ctx.lineTo(cx + cw * 0.42, baseY - ch * 0.7);
            ctx.lineTo(cx + cw * 0.45, baseY - ch * 0.35);
            ctx.lineTo(cx + cw * 0.13, baseY);
        }
        ctx.fill();

        // Head
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(cx, baseY - ch * 0.82 - headR, headR, 0, Math.PI * 2);
        ctx.fill();

        // Hat/cap
        if (c.hat) {
            ctx.fillStyle = 'rgba(15, 17, 15, 0.9)';
            const hatY = baseY - ch * 0.82 - headR * 1.8;
            ctx.fillRect(cx - headR * 1.5, hatY, headR * 3, headR * 0.6);
            ctx.fillRect(cx - headR * 0.9, hatY - headR * 0.8, headR * 1.8, headR * 0.85);
        }

        // Edge highlight (rim light)
        ctx.strokeStyle = 'rgba(80, 90, 70, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, baseY - ch * 0.82 - headR, headR, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
    }

    // === RENDER ===
    function render() {
        if (!ctx) return;
        time += 0.016;

        ctx.clearRect(0, 0, w, h);

        // Draw background
        if (currentBg && bgRenderers[currentBg]) {
            bgRenderers[currentBg]();
        } else {
            ctx.fillStyle = '#0a0c0a';
            ctx.fillRect(0, 0, w, h);
        }

        // Draw characters
        currentChars.forEach(c => {
            drawCharacter(c.id, c.x, c.scale);
        });

        // Flicker effect
        if (flickerEnabled && flickerIntensity > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${flickerIntensity * 0.3})`;
            ctx.fillRect(0, 0, w, h);
        }
    }

    function setScene(bg, chars) {
        currentBg = bg;
        currentChars = chars || [];
        render();
    }

    function triggerFlicker(intensity, duration) {
        flickerIntensity = intensity || 0.5;
        render();
        setTimeout(() => {
            flickerIntensity = 0;
            render();
        }, duration || 100);
    }

    function startRenderLoop() {
        function loop() {
            time += 0.016;
            render();
            animFrame = requestAnimationFrame(loop);
        }
        if (!animFrame) loop();
    }

    function stopRenderLoop() {
        if (animFrame) {
            cancelAnimationFrame(animFrame);
            animFrame = null;
        }
    }

    return {
        init,
        resize,
        setEffects,
        setScene,
        render,
        triggerFlicker,
        startRenderLoop,
        stopRenderLoop,
    };
})();
