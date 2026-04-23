/**
 * HomeController – leagă gesturile detectate de acțiunile smart home.
 * Debounce: 1.5s confirmare + 2s cooldown după execuție.
 */
const HomeController = {
    CONFIRM_DELAY: 1500,
    COOLDOWN_DELAY: 2000,

    gestureBuffer: null,
    bufferTimer: null,
    rafId: null,
    bufferStart: null,
    cooldownActive: false,

    actions: {
        'palm': {
            label: 'Bec Living aprins',
            gesture: '🖐️ Open Palm',
            fn() { HomeState.setState('bec_living', true); }
        },
        'fist': {
            label: 'Bec Living stins',
            gesture: '✊ Fist',
            fn() { HomeState.setState('bec_living', false); }
        },
        'thumbsup': {
            label: 'Centrală termică pornită',
            gesture: '👍 Thumbs Up',
            fn() { HomeState.setState('centrala', true); }
        },
        'peace': {
            label: 'Alarmă armată',
            gesture: '✌️ Peace',
            fn() { HomeState.setState('alarma', true); }
        },
        'point': {
            label: 'Alarmă dezarmată',
            gesture: '👆 Point',
            fn() { HomeState.setState('alarma', false); }
        },
        'pinch': {
            label: 'Centrală termică oprită',
            gesture: '🤙 Pinch',
            fn() { HomeState.setState('centrala', false); }
        },
        'surprised': {
            label: 'Bec Dormitor aprins',
            gesture: '😲 Surprised',
            fn() { HomeState.setState('bec_dormitor', true); }
        },
        'happy': {
            label: 'Mod Seară activat – toate becurile aprinse',
            gesture: '😄 Happy',
            fn() {
                ['bec_living', 'bec_dormitor', 'bec_baie', 'bec_bucatarie']
                    .forEach(id => HomeState.setState(id, true));
            }
        },
        'blink': {
            label: '⚠️ Oprire urgență – totul stins',
            gesture: '😑 Blink',
            fn() {
                Object.keys(HomeState.devices).forEach(k => HomeState.setState(k, false));
            }
        }
    },

    processGesture(className) {
        if (this.cooldownActive) return;
        if (className === 'none' || !this.actions[className]) {
            this.clearBuffer();
            HomeUI.resetConfirm('Arată un gest...');
            return;
        }

        if (this.gestureBuffer !== className) {
            this.clearBuffer();
            this.gestureBuffer = className;
            this.bufferStart = Date.now();
            this._animateRing();
            this.bufferTimer = setTimeout(() => {
                this._execute(className);
            }, this.CONFIRM_DELAY);
        }
    },

    _animateRing() {
        const tick = () => {
            if (!this.bufferStart || !this.gestureBuffer) return;
            const pct = Math.min((Date.now() - this.bufferStart) / this.CONFIRM_DELAY * 100, 100);
            HomeUI.setConfirmProgress(pct);
            if (pct < 100) this.rafId = requestAnimationFrame(tick);
        };
        this.rafId = requestAnimationFrame(tick);
    },

    _execute(className) {
        const action = this.actions[className];
        if (!action) return;
        action.fn();
        HomeState.addLog(action.label, action.gesture);
        HomeUI.update();
        HomeUI.resetConfirm('✅ Acțiune executată!');
        this.gestureBuffer = null;
        this.bufferStart = null;
        this.cooldownActive = true;
        HomeUI.showCooldown(this.COOLDOWN_DELAY);
        setTimeout(() => {
            this.cooldownActive = false;
            HomeUI.resetConfirm('Arată un gest...');
        }, this.COOLDOWN_DELAY);
    },

    clearBuffer() {
        if (this.bufferTimer) { clearTimeout(this.bufferTimer); this.bufferTimer = null; }
        if (this.rafId)       { cancelAnimationFrame(this.rafId); this.rafId = null; }
        this.gestureBuffer = null;
        this.bufferStart   = null;
        HomeUI.setConfirmProgress(0);
    },

    reset() {
        this.clearBuffer();
        this.cooldownActive = false;
        HomeState.resetAll();
        HomeState.addLog('🔄 Resetare manuală', '🔄 Reset');
        HomeUI.update();
        HomeUI.resetConfirm('Arată un gest...');
    }
};
