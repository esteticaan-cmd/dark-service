// audio.js — Procedural audio engine using Web Audio API
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
        }
        return buffer;
    }

    function startDrone(mood) {
        if (!initialized || mood === currentMood) return;
        stopDrone();
        currentMood = mood;

        const moods = {
            dark: { freqs: [55, 82.5, 110], vol: 0.15, type: 'sawtooth' },
            tension: { freqs: [65.4, 98, 130.8], vol: 0.12, type: 'sawtooth' },
            calm: { freqs: [73.4, 110, 146.8], vol: 0.08, type: 'sine' },
            dread: { freqs: [49, 73.5, 98], vol: 0.18, type: 'sawtooth' },
            hope: { freqs: [82.4, 123.5, 164.8], vol: 0.1, type: 'triangle' },
            ending: { freqs: [55, 73.4, 110], vol: 0.1, type: 'sine' },
        };

        const m = moods[mood] || moods.dark;
        const nodes = [];

        m.freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = m.type;
            osc.frequency.value = freq;

            // Slow LFO for movement
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.1 + i * 0.07;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = freq * 0.01;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.gain.setTargetAtTime(m.vol / m.freqs.length, ctx.currentTime, 2);

            // Low-pass filter for warmth
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200 + i * 60;
            filter.Q.value = 0.7;

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(musicGain);

            osc.start();
            lfo.start();

            nodes.push({ osc, lfo, gain, filter });
        });

        // Add noise layer
        const noiseBuffer = createNoiseBuffer(4, 'brown');
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0;
        noiseGain.gain.setTargetAtTime(m.vol * 0.3, ctx.currentTime, 2);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 150;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(musicGain);
        noise.start();

        currentDrone = { nodes, noise, noiseGain };
    }

    function stopDrone() {
        if (!currentDrone) return;
        const now = ctx.currentTime;

        currentDrone.nodes.forEach(n => {
            n.gain.gain.setTargetAtTime(0, now, 1);
            setTimeout(() => {
                try { n.osc.stop(); n.lfo.stop(); } catch (e) {}
            }, 4000);
        });

        currentDrone.noiseGain.gain.setTargetAtTime(0, now, 1);
        setTimeout(() => {
            try { currentDrone.noise.stop(); } catch (e) {}
        }, 4000);

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

        // Sharp attack noise
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

        // Low thud
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
