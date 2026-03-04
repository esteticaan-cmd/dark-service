// game.js — Main initialization, event listeners, UI management
(function () {
    'use strict';

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize subsystems
        ArtRenderer.init(document.getElementById('game-canvas'));
        GameEngine.init();

        // Draw initial menu background
        ArtRenderer.setScene('night_barracks', []);

        // === MAIN MENU BUTTONS ===
        document.getElementById('btn-new-game').addEventListener('click', () => {
            AudioManager.init();
            AudioManager.resume();
            AudioManager.playClick();
            GameEngine.newGame();
        });

        document.getElementById('btn-continue').addEventListener('click', () => {
            AudioManager.init();
            AudioManager.resume();
            AudioManager.playClick();
            if (!GameEngine.loadGame()) {
                alert('Нет сохранённой игры');
            }
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            AudioManager.playClick();
            openSettings();
        });

        // === GAME SCREEN INTERACTIONS ===
        // Click/tap on text box to advance
        document.getElementById('text-box').addEventListener('click', (e) => {
            e.stopPropagation();
            GameEngine.advanceText();
        });

        // Click on canvas also advances (for mobile tap)
        document.getElementById('game-canvas').addEventListener('click', () => {
            const choiceBox = document.getElementById('choice-box');
            if (!choiceBox.classList.contains('visible')) {
                GameEngine.advanceText();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                const gameScreen = document.getElementById('game-screen');
                if (gameScreen.classList.contains('active')) {
                    const choiceBox = document.getElementById('choice-box');
                    if (!choiceBox.classList.contains('visible')) {
                        e.preventDefault();
                        GameEngine.advanceText();
                    }
                }
            }
            if (e.key === 'Escape') {
                const gameScreen = document.getElementById('game-screen');
                if (gameScreen.classList.contains('active')) {
                    toggleIngameMenu();
                }
            }
        });

        // === IN-GAME MENU BUTTON ===
        document.getElementById('btn-game-menu').addEventListener('click', (e) => {
            e.stopPropagation();
            AudioManager.playClick();
            toggleIngameMenu();
        });

        // === IN-GAME MENU BUTTONS ===
        document.getElementById('btn-resume').addEventListener('click', () => {
            AudioManager.playClick();
            GameEngine.hideOverlay('ingame-menu');
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            AudioManager.playClick();
            GameEngine.saveGame();
            showNotification('Игра сохранена');
        });

        document.getElementById('btn-load').addEventListener('click', () => {
            AudioManager.playClick();
            GameEngine.hideOverlay('ingame-menu');
            if (!GameEngine.loadGame()) {
                showNotification('Нет сохранённой игры');
            }
        });

        document.getElementById('btn-settings-ingame').addEventListener('click', () => {
            AudioManager.playClick();
            GameEngine.hideOverlay('ingame-menu');
            openSettings();
        });

        document.getElementById('btn-to-menu').addEventListener('click', () => {
            AudioManager.playClick();
            GameEngine.saveGame();
            GameEngine.hideOverlay('ingame-menu');
            AudioManager.stopAll();
            GameEngine.showScreen('menu-screen');
            GameEngine.checkContinue();
        });

        // === SETTINGS ===
        document.getElementById('btn-settings-close').addEventListener('click', () => {
            AudioManager.playClick();
            GameEngine.hideOverlay('settings-screen');
        });

        document.getElementById('setting-text-speed').addEventListener('input', (e) => {
            GameEngine.updateSetting('textSpeed', parseInt(e.target.value));
        });

        document.getElementById('setting-music-vol').addEventListener('input', (e) => {
            GameEngine.updateSetting('musicVolume', parseInt(e.target.value));
        });

        document.getElementById('setting-sfx-vol').addEventListener('input', (e) => {
            GameEngine.updateSetting('sfxVolume', parseInt(e.target.value));
        });

        document.getElementById('setting-effects').addEventListener('change', (e) => {
            GameEngine.updateSetting('effects', e.target.checked);
        });

        // === ENDING SCREEN ===
        document.getElementById('btn-ending-menu').addEventListener('click', () => {
            AudioManager.playClick();
            AudioManager.stopAll();
            GameEngine.showScreen('menu-screen');
            localStorage.removeItem('darkservice_save');
            GameEngine.checkContinue();
        });

        // === HELPERS ===
        function toggleIngameMenu() {
            const menu = document.getElementById('ingame-menu');
            if (menu.classList.contains('visible')) {
                GameEngine.hideOverlay('ingame-menu');
            } else {
                GameEngine.showOverlay('ingame-menu');
            }
        }

        function openSettings() {
            const s = GameEngine.getSettings();
            document.getElementById('setting-text-speed').value = s.textSpeed;
            document.getElementById('setting-music-vol').value = s.musicVolume;
            document.getElementById('setting-sfx-vol').value = s.sfxVolume;
            document.getElementById('setting-effects').checked = s.effects;
            GameEngine.showOverlay('settings-screen');
        }

        function showNotification(text) {
            let notif = document.getElementById('game-notification');
            if (!notif) {
                notif = document.createElement('div');
                notif.id = 'game-notification';
                notif.style.cssText = `
                    position: fixed;
                    top: 60px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(30, 35, 25, 0.9);
                    border: 1px solid rgba(80, 90, 60, 0.4);
                    color: #c8c0b0;
                    padding: 10px 24px;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                    z-index: 200;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                `;
                document.body.appendChild(notif);
            }
            notif.textContent = text;
            notif.style.opacity = '1';
            setTimeout(() => {
                notif.style.opacity = '0';
            }, 1500);
        }

        // === TOUCH PREVENTION (prevent zoom on double tap) ===
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // === AMBIENT START ON MENU ===
        document.body.addEventListener('click', function initAudio() {
            AudioManager.init();
            AudioManager.resume();
            document.body.removeEventListener('click', initAudio);
        }, { once: true });
    });
})();
