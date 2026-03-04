// audio.js — Procedural audio engine using Web Audio API
// Rich mood-specific drones with smooth crossfading
const AudioManager = (() => {
    let ctx = null;
    let masterGain = null;
    let musicGain = null;
    let sfxGain = null;
    let currentDrone = null;
    let currentMood = null;
    let rainNode = null;
    let windNode = null;
    let initialized = false;
    const CROSSFADE_TIME = 3; // seconds for smooth crossfade

    function init() {
        if (initialized) return;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 1.0;
            masterGain.connect(ctx.destination);

            musicGain = ctx.createGain();
            musicGain.gain.value = 0.3;
            musicGain.connect(masterGain);

            sfxGain = ctx.createGain();
            sfxGain.gain.value = 0.5;
            sfxGain.connect(masterGain);

            initialized = true;
        } catch (e) {
            console.warn('Web Audio API not available:', e);
        }
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    function setMusicVolume(v) {
        if (musicGain) {
            musicGain.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
        }
    }

    function setSfxVolume(v) {
        if (sfxGain) {
            sfxGain.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
        }
    }

    function createNoiseBuffer(duration, type) {
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < length; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'brown') {
            let last = 0;
            for (let i = 0; i < length; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (last + 0.02 * white) / 1.02;
                last = data[i];
                data[i] *= 3.5;
            }
        } else if (type === 'pink') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < length; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }
        }
        return buffer;
    }

    // === MOOD DRONE DEFINITIONS ===
    // Each mood creates a unique sonic atmosphere

    function createDarkDrone(outputNode) {
        // Мрачный гул для дедовщины — deep, ominous, oppressive
        const nodes = [];
        const now = ctx.currentTime;

        // Deep bass drone
        const bass = ctx.createOscillator();
        bass.type = 'sawtooth';
        bass.frequency.value = 36.7; // D1 — very deep
        const bassGain = ctx.createGain();
        bassGain.gain.value = 0;
        bassGain.gain.setTargetAtTime(0.06, now, CROSSFADE_TIME);
        const bassFilter = ctx.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.value = 120;
        bassFilter.Q.value = 2;
        bass.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(outputNode);
        bass.start();
        nodes.push(bass);

        // Sub-bass rumble
        const sub = ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.value = 27.5; // A0
        const subGain = ctx.createGain();
        subGain.gain.value = 0;
        subGain.gain.setTargetAtTime(0.08, now, CROSSFADE_TIME);
        // Slow pitch wobble
        const subLfo = ctx.createOscillator();
        subLfo.frequency.value = 0.05;
        const subLfoGain = ctx.createGain();
        subLfoGain.gain.value = 1.5;
        subLfo.connect(subLfoGain);
        subLfoGain.connect(sub.frequency);
        sub.connect(subGain);
        subGain.connect(outputNode);
        sub.start();
        subLfo.start();
        nodes.push(sub, subLfo);

        // Dissonant mid-range tone
        const mid = ctx.createOscillator();
        mid.type = 'sawtooth';
        mid.frequency.value = 55.5; // Slightly detuned from A1
        const midGain = ctx.createGain();
        midGain.gain.value = 0;
        midGain.gain.setTargetAtTime(0.025, now, CROSSFADE_TIME);
        const midFilter = ctx.createBiquadFilter();
        midFilter.type = 'lowpass';
        midFilter.frequency.value = 180;
        midFilter.Q.value = 3;
        // Filter movement
        const midLfo = ctx.createOscillator();
        midLfo.frequency.value = 0.08;
        const midLfoGain = ctx.createGain();
        midLfoGain.gain.value = 40;
        midLfo.connect(midLfoGain);
        midLfoGain.connect(midFilter.frequency);
        mid.connect(midFilter);
        midFilter.connect(midGain);
        midGain.connect(outputNode);
        mid.start();
        midLfo.start();
        nodes.push(mid, midLfo);

        // Brown noise bed
        const noiseBuf = createNoiseBuffer(4, 'brown');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(0.04, now, CROSSFADE_TIME);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 100;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(outputNode);
        noise.start();
        nodes.push(noise);

        return { nodes, gains: [bassGain, subGain, midGain, noiseGain] };
    }

    function createTensionDrone(outputNode) {
        // Напряжённая для конфликтов — tense, anxious, pulsing
        const nodes = [];
        const now = ctx.currentTime;

        // Pulsing low tone
        const pulse = ctx.createOscillator();
        pulse.type = 'sawtooth';
        pulse.frequency.value = 48; // Between B0 and C1
        const pulseGain = ctx.createGain();
        pulseGain.gain.value = 0;
        pulseGain.gain.setTargetAtTime(0.04, now, CROSSFADE_TIME);
        const pulseLfo = ctx.createOscillator();
        pulseLfo.frequency.value = 0.8; // Heartbeat-like pulse
        const pulseLfoGain = ctx.createGain();
        pulseLfoGain.gain.value = 0.04;
        pulseLfo.connect(pulseLfoGain);
        pulseLfoGain.connect(pulseGain.gain);
        const pulseFilter = ctx.createBiquadFilter();
        pulseFilter.type = 'lowpass';
        pulseFilter.frequency.value = 200;
        pulseFilter.Q.value = 4;
        pulse.connect(pulseFilter);
        pulseFilter.connect(pulseGain);
        pulseGain.connect(outputNode);
        pulse.start();
        pulseLfo.start();
        nodes.push(pulse, pulseLfo);

        // Tense mid — minor second interval
        const tense1 = ctx.createOscillator();
        tense1.type = 'sine';
        tense1.frequency.value = 65.4; // C2
        const tense2 = ctx.createOscillator();
        tense2.type = 'sine';
        tense2.frequency.value = 69.3; // C#2 — dissonant
        const tenseGain1 = ctx.createGain();
        tenseGain1.gain.value = 0;
        tenseGain1.gain.setTargetAtTime(0.035, now, CROSSFADE_TIME);
        const tenseGain2 = ctx.createGain();
        tenseGain2.gain.value = 0;
        tenseGain2.gain.setTargetAtTime(0.03, now, CROSSFADE_TIME);
        const tenseFilter = ctx.createBiquadFilter();
        tenseFilter.type = 'lowpass';
        tenseFilter.frequency.value = 250;
        tense1.connect(tenseGain1);
        tenseGain1.connect(tenseFilter);
        tense2.connect(tenseGain2);
        tenseGain2.connect(tenseFilter);
        tenseFilter.connect(outputNode);
        tense1.start();
        tense2.start();
        nodes.push(tense1, tense2);

        // High anxiety whine
        const whine = ctx.createOscillator();
        whine.type = 'sine';
        whine.frequency.value = 440;
        const whineGain = ctx.createGain();
        whineGain.gain.value = 0;
        whineGain.gain.setTargetAtTime(0.008, now, CROSSFADE_TIME);
        const whineLfo = ctx.createOscillator();
        whineLfo.frequency.value = 0.15;
        const whineLfoGain = ctx.createGain();
        whineLfoGain.gain.value = 0.008;
        whineLfo.connect(whineLfoGain);
        whineLfoGain.connect(whineGain.gain);
        const whineFilter = ctx.createBiquadFilter();
        whineFilter.type = 'bandpass';
        whineFilter.frequency.value = 440;
        whineFilter.Q.value = 20;
        whine.connect(whineFilter);
        whineFilter.connect(whineGain);
        whineGain.connect(outputNode);
        whine.start();
        whineLfo.start();
        nodes.push(whine, whineLfo);

        // Pink noise texture
        const noiseBuf = createNoiseBuffer(4, 'pink');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(0.02, now, CROSSFADE_TIME);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 300;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(outputNode);
        noise.start();
        nodes.push(noise);

        return { nodes, gains: [pulseGain, tenseGain1, tenseGain2, whineGain, noiseGain] };
    }

    function createCalmDrone(outputNode) {
        // Тихая ночь — soft, minimal, contemplative
        const nodes = [];
        const now = ctx.currentTime;

        // Soft sine pad
        const pad1 = ctx.createOscillator();
        pad1.type = 'sine';
        pad1.frequency.value = 73.4; // D2
        const pad2 = ctx.createOscillator();
        pad2.type = 'sine';
        pad2.frequency.value = 110; // A2 — perfect fifth
        const pad3 = ctx.createOscillator();
        pad3.type = 'sine';
        pad3.frequency.value = 146.8; // D3 — octave
        const padGain1 = ctx.createGain();
        padGain1.gain.value = 0;
        padGain1.gain.setTargetAtTime(0.04, now, CROSSFADE_TIME);
        const padGain2 = ctx.createGain();
        padGain2.gain.value = 0;
        padGain2.gain.setTargetAtTime(0.025, now, CROSSFADE_TIME);
        const padGain3 = ctx.createGain();
        padGain3.gain.value = 0;
        padGain3.gain.setTargetAtTime(0.015, now, CROSSFADE_TIME);

        // Gentle movement
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.04;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(pad1.frequency);

        const padFilter = ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.value = 300;
        padFilter.Q.value = 0.5;

        pad1.connect(padGain1); padGain1.connect(padFilter);
        pad2.connect(padGain2); padGain2.connect(padFilter);
        pad3.connect(padGain3); padGain3.connect(padFilter);
        padFilter.connect(outputNode);
        pad1.start(); pad2.start(); pad3.start(); lfo.start();
        nodes.push(pad1, pad2, pad3, lfo);

        // Very soft brown noise — like distant ventilation
        const noiseBuf = createNoiseBuffer(4, 'brown');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(0.015, now, CROSSFADE_TIME);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 80;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(outputNode);
        noise.start();
        nodes.push(noise);

        return { nodes, gains: [padGain1, padGain2, padGain3, noiseGain] };
    }

    function createDreadDrone(outputNode) {
        // Кульминация / dramatic — intense, building dread, heavy
        const nodes = [];
        const now = ctx.currentTime;

        // Heavy bass cluster
        const bass1 = ctx.createOscillator();
        bass1.type = 'sawtooth';
        bass1.frequency.value = 41.2; // E1
        const bass2 = ctx.createOscillator();
        bass2.type = 'sawtooth';
        bass2.frequency.value = 43.65; // F1 — minor second
        const bassGain1 = ctx.createGain();
        bassGain1.gain.value = 0;
        bassGain1.gain.setTargetAtTime(0.05, now, CROSSFADE_TIME);
        const bassGain2 = ctx.createGain();
        bassGain2.gain.value = 0;
        bassGain2.gain.setTargetAtTime(0.04, now, CROSSFADE_TIME);
        const bassFilter = ctx.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.value = 150;
        bassFilter.Q.value = 3;
        // Slow filter sweep for building tension
        const filterLfo = ctx.createOscillator();
        filterLfo.frequency.value = 0.03;
        const filterLfoGain = ctx.createGain();
        filterLfoGain.gain.value = 50;
        filterLfo.connect(filterLfoGain);
        filterLfoGain.connect(bassFilter.frequency);
        bass1.connect(bassGain1); bassGain1.connect(bassFilter);
        bass2.connect(bassGain2); bassGain2.connect(bassFilter);
        bassFilter.connect(outputNode);
        bass1.start(); bass2.start(); filterLfo.start();
        nodes.push(bass1, bass2, filterLfo);

        // Tritone interval — "devil's interval"
        const tri1 = ctx.createOscillator();
        tri1.type = 'triangle';
        tri1.frequency.value = 82.4; // E2
        const tri2 = ctx.createOscillator();
        tri2.type = 'triangle';
        tri2.frequency.value = 116.5; // Bb2 — tritone
        const triGain1 = ctx.createGain();
        triGain1.gain.value = 0;
        triGain1.gain.setTargetAtTime(0.03, now, CROSSFADE_TIME);
        const triGain2 = ctx.createGain();
        triGain2.gain.value = 0;
        triGain2.gain.setTargetAtTime(0.025, now, CROSSFADE_TIME);
        const triFilter = ctx.createBiquadFilter();
        triFilter.type = 'lowpass';
        triFilter.frequency.value = 280;
        tri1.connect(triGain1); triGain1.connect(triFilter);
        tri2.connect(triGain2); triGain2.connect(triFilter);
        triFilter.connect(outputNode);
        tri1.start(); tri2.start();
        nodes.push(tri1, tri2);

        // Rumble noise — like distant thunder
        const noiseBuf = createNoiseBuffer(4, 'brown');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(0.06, now, CROSSFADE_TIME);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 80;
        noiseFilter.Q.value = 5;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(outputNode);
        noise.start();
        nodes.push(noise);

        // Pulsing sub
        const sub = ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.value = 30;
        const subGain = ctx.createGain();
        subGain.gain.value = 0;
        subGain.gain.setTargetAtTime(0.07, now, CROSSFADE_TIME);
        const subLfo = ctx.createOscillator();
        subLfo.frequency.value = 0.5; // Slow throb
        const subLfoGain = ctx.createGain();
        subLfoGain.gain.value = 0.07;
        subLfo.connect(subLfoGain);
        subLfoGain.connect(subGain.gain);
        sub.connect(subGain);
        subGain.connect(outputNode);
        sub.start(); subLfo.start();
        nodes.push(sub, subLfo);

        return { nodes, gains: [bassGain1, bassGain2, triGain1, triGain2, noiseGain, subGain] };
    }

    function createHopeDrone(outputNode) {
        // Надежда — warmer, slightly brighter but still melancholy
        const nodes = [];
        const now = ctx.currentTime;

        // Major-ish chord: D-A-F#
        const o1 = ctx.createOscillator();
        o1.type = 'triangle';
        o1.frequency.value = 73.4; // D2
        const o2 = ctx.createOscillator();
        o2.type = 'triangle';
        o2.frequency.value = 110; // A2
        const o3 = ctx.createOscillator();
        o3.type = 'sine';
        o3.frequency.value = 92.5; // F#2
        const g1 = ctx.createGain();
        g1.gain.value = 0;
        g1.gain.setTargetAtTime(0.04, now, CROSSFADE_TIME);
        const g2 = ctx.createGain();
        g2.gain.value = 0;
        g2.gain.setTargetAtTime(0.03, now, CROSSFADE_TIME);
        const g3 = ctx.createGain();
        g3.gain.value = 0;
        g3.gain.setTargetAtTime(0.025, now, CROSSFADE_TIME);

        // Gentle vibrato
        const vib = ctx.createOscillator();
        vib.frequency.value = 0.12;
        const vibGain = ctx.createGain();
        vibGain.gain.value = 1;
        vib.connect(vibGain);
        vibGain.connect(o1.frequency);
        vibGain.connect(o2.frequency);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 0.5;

        o1.connect(g1); g1.connect(filter);
        o2.connect(g2); g2.connect(filter);
        o3.connect(g3); g3.connect(filter);
        filter.connect(outputNode);
        o1.start(); o2.start(); o3.start(); vib.start();
        nodes.push(o1, o2, o3, vib);

        // Soft noise
        const noiseBuf = createNoiseBuffer(4, 'brown');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(0.01, now, CROSSFADE_TIME);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 120;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(outputNode);
        noise.start();
        nodes.push(noise);

        return { nodes, gains: [g1, g2, g3, noiseGain] };
    }

    function createEndingDrone(outputNode) {
        // Безнадёжная / hopeless — empty, fading, hollow
        const nodes = [];
        const now = ctx.currentTime;

        // Hollow fifth — empty sound
        const o1 = ctx.createOscillator();
        o1.type = 'sine';
        o1.frequency.value = 55; // A1
        const o2 = ctx.createOscillator();
        o2.type = 'sine';
        o2.frequency.value = 82.4; // E2
        const g1 = ctx.createGain();
        g1.gain.value = 0;
        g1.gain.setTargetAtTime(0.04, now, CROSSFADE_TIME);
        const g2 = ctx.createGain();
        g2.gain.value = 0;
        g2.gain.setTargetAtTime(0.03, now, CROSSFADE_TIME);

        // Very slow pitch drift — like losing grip
        const drift = ctx.createOscillator();
        drift.frequency.value = 0.02;
        const driftGain = ctx.createGain();
        driftGain.gain.value = 2;
        drift.connect(driftGain);
        driftGain.connect(o1.frequency);
        driftGain.connect(o2.frequency);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        o1.connect(g1); g1.connect(filter);
        o2.connect(g2); g2.connect(filter);
        filter.connect(outputNode);
        o1.start(); o2.start(); drift.start();
        nodes.push(o1, o2, drift);

        // Ghost harmonics — very quiet high tones
        const ghost = ctx.createOscillator();
        ghost.type = 'sine';
        ghost.frequency.value = 880;
        const ghostGain = ctx.createGain();
        ghostGain.gain.value = 0;
        ghostGain.gain.setTargetAtTime(0.004, now, CROSSFADE_TIME);
        const ghostLfo = ctx.createOscillator();
        ghostLfo.frequency.value = 0.07;
        const ghostLfoGain = ctx.createGain();
        ghostLfoGain.gain.value = 0.004;
        ghostLfo.connect(ghostLfoGain);
        ghostLfoGain.connect(ghostGain.gain);
        ghost.connect(ghostGain);
        ghostGain.connect(outputNode);
        ghost.start(); ghostLfo.start();
        nodes.push(ghost, ghostLfo);

        // Quiet noise — emptiness
        const noiseBuf = createNoiseBuffer(4, 'brown');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(0.025, now, CROSSFADE_TIME);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 60;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(outputNode);
        noise.start();
        nodes.push(noise);

        return { nodes, gains: [g1, g2, ghostGain, noiseGain] };
    }

    const droneCreators = {
        dark: createDarkDrone,
        tension: createTensionDrone,
        calm: createCalmDrone,
        dread: createDreadDrone,
        hope: createHopeDrone,
        ending: createEndingDrone,
    };

    function startDrone(mood) {
        if (!initialized || mood === currentMood) return;

        // Crossfade: fade out old drone while fading in new one
        if (currentDrone) {
            fadeOutDrone(currentDrone);
            currentDrone = null;
        }
        currentMood = mood;

        const creator = droneCreators[mood] || droneCreators.dark;
        currentDrone = creator(musicGain);
    }

    function fadeOutDrone(drone) {
        const now = ctx.currentTime;
        drone.gains.forEach(g => {
            g.gain.setTargetAtTime(0, now, CROSSFADE_TIME * 0.5);
        });
        // Clean up after fade
        setTimeout(() => {
            drone.nodes.forEach(n => {
                try { n.stop(); } catch (e) {}
            });
        }, CROSSFADE_TIME * 1000 * 2);
    }

    function stopDrone() {
        if (!currentDrone) return;
        fadeOutDrone(currentDrone);
        currentDrone = null;
        currentMood = null;
    }

    function startRain() {
        if (!initialized || rainNode) return;

        const buffer = createNoiseBuffer(4, 'white');
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.5;

        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.gain.setTargetAtTime(0.06, ctx.currentTime, 2);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(sfxGain);
        source.start();

        rainNode = { source, gain };
    }

    function stopRain() {
        if (!rainNode) return;
        rainNode.gain.gain.setTargetAtTime(0, ctx.currentTime, 1);
        setTimeout(() => {
            try { rainNode.source.stop(); } catch (e) {}
            rainNode = null;
        }, 3000);
    }

    function startWind() {
        if (!initialized || windNode) return;

        const buffer = createNoiseBuffer(4, 'brown');
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.gain.setTargetAtTime(0.08, ctx.currentTime, 2);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(sfxGain);

        source.start();
        lfo.start();

        windNode = { source, gain, lfo };
    }

    function stopWind() {
        if (!windNode) return;
        windNode.gain.gain.setTargetAtTime(0, ctx.currentTime, 1);
        setTimeout(() => {
            try { windNode.source.stop(); windNode.lfo.stop(); } catch (e) {}
            windNode = null;
        }, 3000);
    }

    function playClick() {
        if (!initialized) return;
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 800;
        const gain = ctx.createGain();
        gain.gain.value = 0.08;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    }

    function playChoiceClick() {
        if (!initialized) return;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 600;
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        const gain = ctx.createGain();
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    function playImpact() {
        if (!initialized) return;
        const buffer = createNoiseBuffer(0.3, 'white');
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        const gain = ctx.createGain();
        gain.gain.value = 0.3;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(sfxGain);
        source.start();
    }

    function playGunshot() {
        if (!initialized) return;

        const buffer = createNoiseBuffer(0.5, 'white');
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        const gain = ctx.createGain();
        gain.gain.value = 0.6;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(sfxGain);
        source.start();

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 80;
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.5;
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(oscGain);
        oscGain.connect(sfxGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }

    function playFootsteps() {
        if (!initialized) return;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const buffer = createNoiseBuffer(0.08, 'brown');
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const gain = ctx.createGain();
                gain.gain.value = 0.1;
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                source.connect(gain);
                gain.connect(sfxGain);
                source.start();
            }, i * 350);
        }
    }

    function playSiren() {
        if (!initialized) return;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 400;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        const gain = ctx.createGain();
        gain.gain.value = 0.08;
        gain.gain.setTargetAtTime(0.001, ctx.currentTime + 2, 0.5);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(sfxGain);
        osc.start();
        lfo.start();
        osc.stop(ctx.currentTime + 3);
        lfo.stop(ctx.currentTime + 3);
    }

    function setAmbience(type) {
        stopRain();
        stopWind();
        if (type === 'rain' || type === 'rain_wind') startRain();
        if (type === 'wind' || type === 'rain_wind') startWind();
    }

    function stopAll() {
        stopDrone();
        stopRain();
        stopWind();
    }

    return {
        init,
        resume,
        setMusicVolume,
        setSfxVolume,
        startDrone,
        stopDrone,
        setAmbience,
        stopAll,
        playClick,
        playChoiceClick,
        playImpact,
        playGunshot,
        playFootsteps,
        playSiren,
    };
})();
