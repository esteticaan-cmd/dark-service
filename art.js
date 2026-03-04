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

    // === COLOR PALETTES ===
    const palettes = {
        barracks: {
            sky: '#0c0e0c',
            walls: '#1a1d18',
            floor: '#141610',
            accent: '#2a3020',
            light: 'rgba(80, 70, 40, 0.08)',
        },
        parade: {
            sky: '#101215',
            ground: '#181a14',
            horizon: '#1e2018',
            accent: '#252820',
            light: 'rgba(60, 65, 50, 0.06)',
        },
        mess: {
            sky: '#0e100e',
            walls: '#1c1e18',
            floor: '#14160f',
            accent: '#282c22',
            light: 'rgba(90, 75, 40, 0.1)',
        },
        range: {
            sky: '#12141a',
            ground: '#1a1c16',
            horizon: '#202218',
            accent: '#2e3228',
            light: 'rgba(70, 80, 60, 0.06)',
        },
        guardpost: {
            sky: '#0a0c10',
            walls: '#181a1e',
            floor: '#101214',
            accent: '#222630',
            light: 'rgba(50, 55, 70, 0.08)',
        },
        medbay: {
            sky: '#0e0e10',
            walls: '#1e1e20',
            floor: '#141416',
            accent: '#282830',
            light: 'rgba(80, 80, 90, 0.08)',
        },
        night: {
            sky: '#060608',
            walls: '#101014',
            floor: '#0a0a0e',
            accent: '#181820',
            light: 'rgba(30, 30, 50, 0.05)',
        },
        outside: {
            sky: '#0e1014',
            ground: '#161812',
            horizon: '#1a1c16',
            accent: '#222418',
            light: 'rgba(50, 55, 40, 0.05)',
        },
    };

    // === BACKGROUND RENDERERS ===
    function drawBarracks() {
        const p = palettes.barracks;

        // Ceiling
        ctx.fillStyle = p.sky;
        ctx.fillRect(0, 0, w, h * 0.15);

        // Back wall
        const wallGrad = ctx.createLinearGradient(0, h * 0.1, 0, h * 0.65);
        wallGrad.addColorStop(0, '#1e211a');
        wallGrad.addColorStop(1, p.walls);
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, h * 0.1, w, h * 0.55);

        // Wall texture - horizontal lines
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        for (let y = h * 0.15; y < h * 0.6; y += 18) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Window (dim light)
        const winX = w * 0.65;
        const winY = h * 0.18;
        const winW = w * 0.12;
        const winH = h * 0.18;
        ctx.fillStyle = 'rgba(25, 30, 35, 0.9)';
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = 'rgba(40, 45, 50, 0.5)';
        ctx.fillRect(winX + 2, winY + 2, winW - 4, winH - 4);
        // Window frame
        ctx.strokeStyle = '#2a2d25';
        ctx.lineWidth = 2;
        ctx.strokeRect(winX, winY, winW, winH);
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.stroke();

        // Floor
        const floorGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
        floorGrad.addColorStop(0, '#1a1c16');
        floorGrad.addColorStop(1, p.floor);
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);

        // Floor planks
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        for (let x = 0; x < w; x += w / 8) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.6);
            ctx.lineTo(x - 20, h);
            ctx.stroke();
        }

        // Bunk bed outlines (left side)
        drawBunkBed(w * 0.05, h * 0.25, w * 0.2, h * 0.38);
        drawBunkBed(w * 0.28, h * 0.25, w * 0.2, h * 0.38);

        // Dim overhead light glow
        const lightGrad = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, h * 0.5);
        lightGrad.addColorStop(0, p.light);
        lightGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, w, h);
    }

    function drawBunkBed(x, y, bw, bh) {
        ctx.strokeStyle = '#2a2e24';
        ctx.lineWidth = 2;
        // Posts
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x, y + bh);
        ctx.moveTo(x + bw, y); ctx.lineTo(x + bw, y + bh);
        ctx.stroke();
        // Top bunk
        ctx.fillStyle = 'rgba(30, 35, 25, 0.6)';
        ctx.fillRect(x, y + bh * 0.1, bw, bh * 0.08);
        // Bottom bunk
        ctx.fillRect(x, y + bh * 0.55, bw, bh * 0.08);
        // Mattress hints
        ctx.fillStyle = 'rgba(35, 38, 30, 0.5)';
        ctx.fillRect(x + 2, y + bh * 0.18, bw - 4, bh * 0.1);
        ctx.fillRect(x + 2, y + bh * 0.63, bw - 4, bh * 0.1);
    }

    function drawParade() {
        const p = palettes.parade;

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        skyGrad.addColorStop(0, '#0c0e12');
        skyGrad.addColorStop(1, '#161a1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.45);

        // Distant buildings silhouette
        ctx.fillStyle = '#141816';
        const buildings = [0.08, 0.15, 0.12, 0.18, 0.1, 0.14, 0.16, 0.09, 0.13];
        let bx = 0;
        buildings.forEach(bh => {
            const bw = w / buildings.length;
            ctx.fillRect(bx, h * 0.45 - h * bh, bw - 2, h * bh);
            bx += bw;
        });

        // Ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
        groundGrad.addColorStop(0, p.horizon);
        groundGrad.addColorStop(1, p.ground);
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Ground texture - cracks
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
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
        ctx.strokeStyle = '#2a2e28';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fpX, h * 0.45);
        ctx.lineTo(fpX, h * 0.12);
        ctx.stroke();

        // Tattered flag
        ctx.fillStyle = 'rgba(60, 50, 40, 0.4)';
        ctx.beginPath();
        ctx.moveTo(fpX, h * 0.14);
        ctx.lineTo(fpX + w * 0.06, h * 0.16 + Math.sin(time * 0.5) * 3);
        ctx.lineTo(fpX + w * 0.05, h * 0.22 + Math.sin(time * 0.5 + 1) * 2);
        ctx.lineTo(fpX, h * 0.22);
        ctx.fill();
    }

    function drawMessHall() {
        const p = palettes.mess;

        // Ceiling
        ctx.fillStyle = p.sky;
        ctx.fillRect(0, 0, w, h * 0.12);

        // Walls
        const wallGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.55);
        wallGrad.addColorStop(0, '#201e18');
        wallGrad.addColorStop(1, p.walls);
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, h * 0.08, w, h * 0.47);

        // Dirty wall stains
        for (let i = 0; i < 5; i++) {
            const sx = Math.random() * w;
            const sy = h * 0.15 + Math.random() * h * 0.3;
            const sr = 20 + Math.random() * 40;
            const stainGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
            stainGrad.addColorStop(0, 'rgba(25, 22, 18, 0.3)');
            stainGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = stainGrad;
            ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
        }

        // Floor
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

        // Overhead lamp glow
        const lampX = w * 0.35;
        const lampGrad = ctx.createRadialGradient(lampX, h * 0.08, 0, lampX, h * 0.08, h * 0.4);
        lampGrad.addColorStop(0, 'rgba(90, 75, 40, 0.08)');
        lampGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(0, 0, w, h * 0.6);
    }

    function drawTable(x, y, tw, th) {
        ctx.fillStyle = '#2a2820';
        ctx.fillRect(x, y, tw, th);
        ctx.strokeStyle = '#1e1c16';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tw, th);
        // Legs
        ctx.fillStyle = '#222018';
        ctx.fillRect(x + 4, y + th, 4, h * 0.12);
        ctx.fillRect(x + tw - 8, y + th, 4, h * 0.12);
    }

    function drawRange() {
        const p = palettes.range;

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        skyGrad.addColorStop(0, '#0e1016');
        skyGrad.addColorStop(1, '#1a1e22');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Clouds
        ctx.fillStyle = 'rgba(25, 28, 35, 0.4)';
        for (let i = 0; i < 4; i++) {
            const cx = w * (0.1 + i * 0.25);
            const cy = h * (0.08 + Math.sin(i) * 0.05);
            const cw = w * 0.15;
            const ch = h * 0.04;
            ctx.beginPath();
            ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Treeline
        ctx.fillStyle = '#141814';
        for (let tx = 0; tx < w; tx += 25) {
            const th = h * (0.06 + Math.sin(tx * 0.1) * 0.03);
            ctx.beginPath();
            ctx.moveTo(tx, h * 0.4);
            ctx.lineTo(tx + 12, h * 0.4 - th);
            ctx.lineTo(tx + 25, h * 0.4);
            ctx.fill();
        }

        // Ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
        groundGrad.addColorStop(0, '#1c1e16');
        groundGrad.addColorStop(1, p.ground);
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.4, w, h * 0.6);

        // Shooting lanes
        ctx.strokeStyle = 'rgba(40, 45, 35, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const lx = w * (i / 5);
            ctx.beginPath();
            ctx.moveTo(lx, h * 0.45);
            ctx.lineTo(lx, h);
            ctx.stroke();
        }

        // Targets
        for (let i = 1; i <= 4; i++) {
            const tx = w * (i / 5) - w * 0.05;
            const ty = h * 0.42;
            drawTarget(tx, ty, 16);
        }

        // Sandbag line
        ctx.fillStyle = '#252820';
        for (let sx = 0; sx < w; sx += 30) {
            ctx.beginPath();
            ctx.ellipse(sx + 15, h * 0.7, 16, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawTarget(x, y, r) {
        ctx.fillStyle = '#2a2620';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3a3630';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawGuardpost() {
        const p = palettes.guardpost;

        // Night sky
        ctx.fillStyle = p.sky;
        ctx.fillRect(0, 0, w, h * 0.5);

        // Stars
        ctx.fillStyle = 'rgba(150, 150, 170, 0.3)';
        for (let i = 0; i < 20; i++) {
            const sx = Math.random() * w;
            const sy = Math.random() * h * 0.35;
            ctx.fillRect(sx, sy, 1.5, 1.5);
        }

        // Guard booth
        const bx = w * 0.3;
        const by = h * 0.2;
        const bw = w * 0.4;
        const bh = h * 0.4;
        ctx.fillStyle = '#1a1c20';
        ctx.fillRect(bx, by, bw, bh);
        // Roof
        ctx.fillStyle = '#14161a';
        ctx.beginPath();
        ctx.moveTo(bx - 10, by);
        ctx.lineTo(bx + bw / 2, by - h * 0.06);
        ctx.lineTo(bx + bw + 10, by);
        ctx.fill();
        // Window glow
        ctx.fillStyle = 'rgba(50, 45, 30, 0.3)';
        ctx.fillRect(bx + bw * 0.2, by + bh * 0.15, bw * 0.6, bh * 0.35);

        // Ground
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        // Fence
        ctx.strokeStyle = '#2a2c30';
        ctx.lineWidth = 2;
        for (let fx = 0; fx < w; fx += 40) {
            ctx.beginPath();
            ctx.moveTo(fx, h * 0.42);
            ctx.lineTo(fx, h * 0.55);
            ctx.stroke();
        }
        // Wire
        ctx.strokeStyle = '#222428';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.44);
        for (let fx = 0; fx < w; fx += 10) {
            ctx.lineTo(fx, h * 0.44 + Math.sin(fx * 0.1) * 2);
        }
        ctx.stroke();
    }

    function drawMedbay() {
        const p = palettes.medbay;

        ctx.fillStyle = p.sky;
        ctx.fillRect(0, 0, w, h * 0.1);

        // Whitish-grey walls
        ctx.fillStyle = '#1c1c1e';
        ctx.fillRect(0, h * 0.08, w, h * 0.52);

        // Floor
        ctx.fillStyle = '#161618';
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        // Tiles
        ctx.strokeStyle = 'rgba(30,30,35,0.3)';
        const ts = 35;
        for (let tx = 0; tx < w; tx += ts) {
            for (let ty = h * 0.55; ty < h; ty += ts) {
                ctx.strokeRect(tx, ty, ts, ts);
            }
        }

        // Bed
        ctx.fillStyle = '#222225';
        ctx.fillRect(w * 0.15, h * 0.38, w * 0.35, h * 0.05);
        // Bed legs
        ctx.fillRect(w * 0.16, h * 0.43, 3, h * 0.12);
        ctx.fillRect(w * 0.48, h * 0.43, 3, h * 0.12);
        // Mattress
        ctx.fillStyle = '#28282c';
        ctx.fillRect(w * 0.16, h * 0.33, w * 0.33, h * 0.06);

        // Cross on wall
        ctx.fillStyle = 'rgba(80, 30, 30, 0.3)';
        ctx.fillRect(w * 0.72, h * 0.18, w * 0.02, h * 0.1);
        ctx.fillRect(w * 0.68, h * 0.22, w * 0.1, h * 0.02);

        // Harsh light
        const lampGrad = ctx.createRadialGradient(w * 0.4, h * 0.05, 0, w * 0.4, h * 0.05, h * 0.5);
        lampGrad.addColorStop(0, 'rgba(80, 80, 90, 0.06)');
        lampGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(0, 0, w, h);
    }

    function drawNightBarracks() {
        const p = palettes.night;

        ctx.fillStyle = p.sky;
        ctx.fillRect(0, 0, w, h * 0.15);

        ctx.fillStyle = p.walls;
        ctx.fillRect(0, h * 0.1, w, h * 0.55);

        // Almost no light
        ctx.fillStyle = p.floor;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);

        // Bunk outlines barely visible
        ctx.strokeStyle = 'rgba(30, 30, 40, 0.3)';
        ctx.lineWidth = 1;
        drawBunkBed(w * 0.05, h * 0.25, w * 0.2, h * 0.38);
        drawBunkBed(w * 0.28, h * 0.25, w * 0.2, h * 0.38);

        // Moon glow through window
        const winX = w * 0.65;
        const winY = h * 0.18;
        ctx.fillStyle = 'rgba(20, 22, 30, 0.5)';
        ctx.fillRect(winX, winY, w * 0.12, h * 0.18);
        const moonGrad = ctx.createRadialGradient(winX + w * 0.06, winY + h * 0.09, 0, winX + w * 0.06, winY + h * 0.09, h * 0.3);
        moonGrad.addColorStop(0, 'rgba(30, 35, 50, 0.1)');
        moonGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = moonGrad;
        ctx.fillRect(0, 0, w, h);
    }

    function drawOutside() {
        const p = palettes.outside;

        // Overcast sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        skyGrad.addColorStop(0, '#0e1014');
        skyGrad.addColorStop(1, '#181c1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.45);

        // Building silhouettes
        ctx.fillStyle = '#141816';
        ctx.fillRect(w * 0.05, h * 0.25, w * 0.2, h * 0.2);
        ctx.fillRect(w * 0.3, h * 0.2, w * 0.15, h * 0.25);
        ctx.fillRect(w * 0.7, h * 0.28, w * 0.25, h * 0.17);

        // Ground
        ctx.fillStyle = p.ground;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Path
        ctx.fillStyle = 'rgba(20, 22, 18, 0.5)';
        ctx.beginPath();
        ctx.moveTo(w * 0.35, h);
        ctx.lineTo(w * 0.45, h * 0.45);
        ctx.lineTo(w * 0.55, h * 0.45);
        ctx.lineTo(w * 0.65, h);
        ctx.fill();
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
            // Broader shoulders
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
        ctx.strokeStyle = 'rgba(50, 55, 45, 0.15)';
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
            // Default dark bg
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
