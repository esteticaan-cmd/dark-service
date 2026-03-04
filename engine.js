// engine.js — Core game engine: state, scene flow, typewriter, save/load, transitions
const GameEngine = (() => {
    // === STATE ===
    let state = {
        currentScene: null,
        spirit: 50,
        chapter: 0,
        choicesMade: {},
        flags: {},
        scenesVisited: [],
    };

    let settings = {
        textSpeed: 3,
        musicVolume: 50,
        sfxVolume: 70,
        effects: true,
    };

    // === DOM REFERENCES ===
    let els = {};
    let typewriterTimer = null;
    let typewriterDone = false;
    let fullText = '';
    let charIndex = 0;
    let isTransitioning = false;
    let onSceneReady = null;

    function init() {
        els = {
            menuScreen: document.getElementById('menu-screen'),
            gameScreen: document.getElementById('game-screen'),
            endingScreen: document.getElementById('ending-screen'),
            textBox: document.getElementById('text-box'),
            speakerName: document.getElementById('speaker-name'),
            textContent: document.getElementById('text-content'),
            textContinue: document.getElementById('text-continue'),
            choiceBox: document.getElementById('choice-box'),
            choiceList: document.getElementById('choice-list'),
            spiritBar: document.getElementById('spirit-bar'),
            chapterTitle: document.getElementById('chapter-title'),
            fadeOverlay: document.getElementById('fade-overlay'),
            ingameMenu: document.getElementById('ingame-menu'),
            settingsScreen: document.getElementById('settings-screen'),
            endingTitle: document.getElementById('ending-title'),
            endingText: document.getElementById('ending-text'),
            grain: document.getElementById('grain'),
            vignette: document.getElementById('vignette'),
        };

        loadSettings();
        applySettings();
        checkContinue();
    }

    function checkContinue() {
        const save = localStorage.getItem('darkservice_save');
        const btn = document.getElementById('btn-continue');
        if (btn) {
            btn.disabled = !save;
        }
    }

    // === SETTINGS ===
    function loadSettings() {
        try {
            const saved = localStorage.getItem('darkservice_settings');
            if (saved) {
                Object.assign(settings, JSON.parse(saved));
            }
        } catch (e) {}
    }

    function saveSettings() {
        localStorage.setItem('darkservice_settings', JSON.stringify(settings));
    }

    function applySettings() {
        AudioManager.setMusicVolume(settings.musicVolume / 100 * 0.5);
        AudioManager.setSfxVolume(settings.sfxVolume / 100 * 0.7);

        if (els.grain) {
            els.grain.classList.toggle('disabled', !settings.effects);
        }
        if (els.vignette) {
            els.vignette.classList.toggle('disabled', !settings.effects);
        }
        ArtRenderer.setEffects(settings.effects);
    }

    function updateSetting(key, value) {
        settings[key] = value;
        applySettings();
        saveSettings();
    }

    function getSettings() {
        return { ...settings };
    }

    // === SCREEN MANAGEMENT ===
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    // === GAME STATE ===
    function newGame() {
        state = {
            currentScene: 'ch1_s1',
            spirit: 50,
            chapter: 1,
            choicesMade: {},
            flags: {},
            scenesVisited: [],
        };
        showScreen('game-screen');
        AudioManager.init();
        AudioManager.resume();
        showChapterTitle(1, 'Прибытие', () => {
            loadScene('ch1_s1');
        });
    }

    function saveGame() {
        localStorage.setItem('darkservice_save', JSON.stringify(state));
        checkContinue();
    }

    function loadGame() {
        try {
            const saved = localStorage.getItem('darkservice_save');
            if (saved) {
                state = JSON.parse(saved);
                showScreen('game-screen');
                AudioManager.init();
                AudioManager.resume();
                loadScene(state.currentScene);
                return true;
            }
        } catch (e) {}
        return false;
    }

    function getState() {
        return state;
    }

    // === SPIRIT ===
    function modifySpirit(amount) {
        state.spirit = Math.max(0, Math.min(100, state.spirit + amount));
        updateSpiritBar();
    }

    function updateSpiritBar() {
        if (els.spiritBar) {
            els.spiritBar.style.width = state.spirit + '%';
        }
    }

    // === CHAPTER TITLE ===
    function showChapterTitle(num, name, callback) {
        const el = els.chapterTitle;
        el.querySelector('.chapter-label').textContent = 'Глава ' + num;
        el.querySelector('.chapter-name').textContent = name;
        el.classList.remove('hidden');
        el.classList.add('visible');

        setTimeout(() => {
            el.classList.remove('visible');
            setTimeout(() => {
                el.classList.add('hidden');
                if (callback) callback();
            }, 1000);
        }, 2500);
    }

    // === SCENE LOADING ===
    function loadScene(sceneId) {
        if (isTransitioning) return;

        const scene = SCENES[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return;
        }

        state.currentScene = sceneId;
        if (!state.scenesVisited.includes(sceneId)) {
            state.scenesVisited.push(sceneId);
        }

        // Auto-save periodically
        if (state.scenesVisited.length % 3 === 0) {
            saveGame();
        }

        // Check for chapter change
        if (scene.chapter && scene.chapter !== state.chapter) {
            state.chapter = scene.chapter;
            const chapterNames = {
                1: 'Прибытие',
                2: 'Первые недели',
                3: 'Точка кипения',
                4: 'Решение',
                5: 'Финал',
            };
            fadeTransition(() => {
                setupScene(scene);
                showChapterTitle(scene.chapter, chapterNames[scene.chapter] || '', null);
            });
            return;
        }

        // Regular scene transition
        fadeTransition(() => {
            setupScene(scene);
        });
    }

    function setupScene(scene) {
        // Set background and characters
        ArtRenderer.setScene(scene.bg || 'barracks', scene.chars || []);

        // Set mood
        if (scene.mood) {
            AudioManager.startDrone(scene.mood);
        }

        // Set ambience
        if (scene.ambience !== undefined) {
            AudioManager.setAmbience(scene.ambience);
        }

        // Play SFX
        if (scene.sfx) {
            setTimeout(() => {
                if (scene.sfx === 'impact') AudioManager.playImpact();
                else if (scene.sfx === 'gunshot') AudioManager.playGunshot();
                else if (scene.sfx === 'footsteps') AudioManager.playFootsteps();
                else if (scene.sfx === 'siren') AudioManager.playSiren();
            }, 300);
        }

        // Flicker
        if (scene.flicker) {
            setTimeout(() => ArtRenderer.triggerFlicker(0.6, 150), 200);
        }

        // Spirit modification on enter
        if (scene.spiritMod) {
            modifySpirit(scene.spiritMod);
        }

        // Set flags
        if (scene.setFlag) {
            Object.assign(state.flags, scene.setFlag);
        }

        updateSpiritBar();

        // Display text or choices
        if (scene.choices) {
            hideTextBox();
            if (scene.text) {
                showText(scene.speaker, scene.text, () => {
                    showChoices(scene.choices);
                });
            } else {
                showChoices(scene.choices);
            }
        } else if (scene.text) {
            hideChoices();
            showText(scene.speaker, scene.text, null);
        }

        // Handle ending scenes
        if (scene.ending) {
            // This scene triggers an ending
        }
    }

    // === FADE TRANSITION ===
    function fadeTransition(callback) {
        isTransitioning = true;
        els.fadeOverlay.classList.add('active');
        setTimeout(() => {
            if (callback) callback();
            setTimeout(() => {
                els.fadeOverlay.classList.remove('active');
                isTransitioning = false;
            }, 100);
        }, 500);
    }

    // === TEXT DISPLAY ===
    function showText(speaker, text, afterComplete) {
        onSceneReady = afterComplete;
        els.textBox.classList.remove('hidden');
        els.textBox.classList.add('visible');
        els.speakerName.textContent = speaker || '';
        // Set data-speaker for CSS coloring
        const speakerMap = {
            'Сержант Горан': 'goran', 'Горан': 'goran',
            'Драган': 'dragan',
            'Лука': 'luka',
            'Марко': 'marko',
            'Капитан Зоран': 'zoran',
            'Милош': 'milosh',
            'Ненад': 'nenad',
            'Дежурный': 'soldier',
        };
        els.speakerName.setAttribute('data-speaker', speakerMap[speaker] || (speaker ? 'narrator' : ''));
        els.textContent.innerHTML = '';
        els.textContinue.classList.remove('visible');

        fullText = text;
        charIndex = 0;
        typewriterDone = false;

        // Speed: 1=slow(60ms), 2=40ms, 3=30ms, 4=20ms, 5=10ms
        const speeds = [60, 40, 30, 20, 10];
        const speed = speeds[(settings.textSpeed || 3) - 1] || 30;

        clearInterval(typewriterTimer);
        typewriterTimer = setInterval(() => {
            if (charIndex < fullText.length) {
                els.textContent.innerHTML += fullText[charIndex] === '\n'
                    ? '<br>'
                    : escapeHtml(fullText[charIndex]);
                charIndex++;
            } else {
                clearInterval(typewriterTimer);
                typewriterDone = true;
                els.textContinue.classList.add('visible');
            }
        }, speed);
    }

    function escapeHtml(char) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return map[char] || char;
    }

    function skipText() {
        if (!typewriterDone) {
            clearInterval(typewriterTimer);
            els.textContent.innerHTML = fullText.replace(/\n/g, '<br>');
            charIndex = fullText.length;
            typewriterDone = true;
            els.textContinue.classList.add('visible');
        }
    }

    function advanceText() {
        AudioManager.resume();
        if (isTransitioning) return;

        if (!typewriterDone) {
            skipText();
            return;
        }

        // If there's a callback after text completes (e.g., show choices)
        if (onSceneReady) {
            const cb = onSceneReady;
            onSceneReady = null;
            cb();
            return;
        }

        // Move to next scene
        const scene = SCENES[state.currentScene];
        if (!scene) return;

        if (scene.next) {
            // Handle conditional next
            if (typeof scene.next === 'function') {
                const nextId = scene.next(state);
                loadScene(nextId);
            } else {
                loadScene(scene.next);
            }
        } else if (scene.ending) {
            showEnding(scene.ending);
        }

    }

    function hideTextBox() {
        els.textBox.classList.remove('visible');
        clearInterval(typewriterTimer);
    }

    // === CHOICES ===
    function showChoices(choices) {
        hideTextBox();

        // Filter choices based on conditions and flags
        const available = choices.filter(c => {
            if (c.condition && !c.condition(state)) return false;
            if (c.checkFlag) {
                for (const [key, val] of Object.entries(c.checkFlag)) {
                    if (state.flags[key] !== val) return false;
                }
            }
            return true;
        });

        els.choiceList.innerHTML = '';
        available.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => {
                AudioManager.playChoiceClick();
                makeChoice(choice);
            });
            els.choiceList.appendChild(btn);
        });

        els.choiceBox.classList.remove('hidden');
        els.choiceBox.classList.add('visible');
    }

    function hideChoices() {
        els.choiceBox.classList.remove('visible');
        els.choiceBox.classList.add('hidden');
    }

    function makeChoice(choice) {
        hideChoices();

        // Record choice
        if (choice.id) {
            state.choicesMade[choice.id] = true;
        }

        // Modify spirit
        if (choice.spirit) {
            modifySpirit(choice.spirit);
        }

        // Set flags
        if (choice.setFlag) {
            Object.assign(state.flags, choice.setFlag);
        }

        // Go to next scene
        if (choice.next) {
            loadScene(choice.next);
        }
    }

    // === ENDINGS ===
    function showEnding(endingId) {
        const endings = {
            survivor: {
                title: 'КОНЦОВКА: ВЫЖИВШИЙ',
                text: 'Марко дотерпел до конца службы. Демобилизация пришла серым ноябрьским утром — без фанфар, без прощаний. Он собрал вещи в тот же потёртый рюкзак, с которым приехал.\n\nДома мать не узнала его глаза. Отец молчал. Завод принял его без вопросов — ещё одна пара рук на конвейере.\n\nПо ночам он просыпается от звука шагов в коридоре. Иногда ему снится запах казармы — пот, сырость, страх. Шрамы на теле зажили. Шрамы на душе — нет.\n\nНо он свободен. Мрачный, сломанный — но свободен.',
            },
            system: {
                title: 'КОНЦОВКА: СИСТЕМА',
                text: 'Марко подписал контракт. Через полгода он получил лычки. Через год — стал тем, кого ненавидел.\n\nНовые призывники смотрят на него с тем же страхом, с каким он когда-то смотрел на Горана. Он научился бить так, чтобы не оставлять следов. Научился кричать так, чтобы ломать волю.\n\nИногда, глубокой ночью, он вспоминает себя — того восемнадцатилетнего парня, который приехал сюда с рюкзаком и надеждой. Но это воспоминание быстро гаснет.\n\nЦикл насилия продолжается. Система пожирает своих детей.',
            },
            lastshot: {
                title: 'КОНЦОВКА: ПОСЛЕДНИЙ ВЫСТРЕЛ',
                text: 'На полигоне тишина длится три секунды. Потом — крики, хаос, топот сапог.\n\nГоран лежит на земле. Драган — рядом. Марко стоит с автоматом в руках, и мир вокруг него замедляется.\n\nОфицер кричит что-то. Марко не слышит. Он видит только серое небо и чувствует странное спокойствие.\n\nВыстрел. Тишина.\n\nНа полигоне находят три тела. Расследование закрывают через неделю — «несчастный случай на учениях». Газеты не напишут ни строчки.\n\nКазарма продолжает жить. Новые призывники приезжают осенью.',
            },
        };

        const ending = endings[endingId];
        if (!ending) return;

        AudioManager.stopAll();
        setTimeout(() => AudioManager.startDrone('ending'), 1000);

        fadeTransition(() => {
            els.endingTitle.textContent = ending.title;
            els.endingText.textContent = ending.text;
            showScreen('ending-screen');
        });
    }

    // === OVERLAY MANAGEMENT ===
    function showOverlay(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('hidden');
            setTimeout(() => el.classList.add('visible'), 10);
        }
    }

    function hideOverlay(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('hidden'), 300);
        }
    }

    // === DETERMINE ENDING ===
    function getEndingFromSpirit() {
        if (state.spirit >= 60) return 'survivor';
        if (state.spirit >= 30) return 'system';
        return 'lastshot';
    }

    return {
        init,
        newGame,
        saveGame,
        loadGame,
        getState,
        getSettings,
        updateSetting,
        showScreen,
        loadScene,
        advanceText,
        modifySpirit,
        showOverlay,
        hideOverlay,
        showChapterTitle,
        fadeTransition,
        getEndingFromSpirit,
        checkContinue,
    };
})();
