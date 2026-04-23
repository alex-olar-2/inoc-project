/**
 * HomeUI – actualizează vizual interfața casei în funcție de HomeState.
 */
const HomeUI = {

    update() {
        // Becuri camere
        ['living', 'dormitor', 'baie', 'bucatarie'].forEach(room => {
            const deviceId = `bec_${room}`;
            const isOn = HomeState.getState(deviceId);
            const roomEl    = document.getElementById(`room-${room}`);
            const glowEl    = document.getElementById(`glow-${room}`);
            const statusEl  = document.getElementById(`status-${deviceId}`);
            const bulbEl    = document.getElementById(`bulb-${room}`);

            if (roomEl)   roomEl.classList.toggle('room-on', isOn);
            if (glowEl)   glowEl.classList.toggle('glow-active', isOn);
            if (statusEl) { statusEl.textContent = isOn ? 'APRINS' : 'STINS'; statusEl.className = `device-status ${isOn ? 'status-on' : 'status-off'}`; }
            if (bulbEl)   bulbEl.classList.toggle('bulb-on', isOn);
        });

        // Centrală
        const centralaOn = HomeState.getState('centrala');
        document.getElementById('sys-centrala')?.classList.toggle('sys-on', centralaOn);
        document.getElementById('sys-centrala')?.classList.toggle('sys-heating', centralaOn);
        const cStatus = document.getElementById('status-centrala');
        if (cStatus) cStatus.textContent = centralaOn ? 'PORNITĂ' : 'OPRITĂ';
        const cIcon = document.getElementById('centrala-icon');
        if (cIcon) cIcon.textContent = centralaOn ? '🔥' : '🌡️';
        document.getElementById('ind-centrala')?.classList.toggle('ind-on', centralaOn);
        document.getElementById('ind-centrala')?.classList.toggle('ind-heating', centralaOn);

        // Alarmă
        const alarmaOn = HomeState.getState('alarma');
        document.getElementById('sys-alarma')?.classList.toggle('sys-on', alarmaOn);
        document.getElementById('sys-alarma')?.classList.toggle('sys-alarm-active', alarmaOn);
        const aStatus = document.getElementById('status-alarma');
        if (aStatus) aStatus.textContent = alarmaOn ? 'ARMATĂ ⚠️' : 'DEZARMATĂ';
        const aIcon = document.getElementById('alarma-icon');
        if (aIcon) aIcon.textContent = alarmaOn ? '🔒' : '🔓';
        document.getElementById('ind-alarma')?.classList.toggle('ind-on', alarmaOn);
        document.getElementById('ind-alarma')?.classList.toggle('ind-alarm', alarmaOn);

        // Overlay alarmă pe cameră
        const overlay = document.getElementById('alarm-overlay');
        if (overlay) overlay.classList.toggle('alarm-overlay-active', alarmaOn);

        // Jurnal acțiuni
        this.updateLog();
    },

    updateLog() {
        const logEl = document.getElementById('action-log');
        const countEl = document.getElementById('log-count');
        if (!logEl) return;

        const logs = HomeState.actionLog;
        if (countEl) countEl.textContent = `${logs.length} acțiuni`;

        if (logs.length === 0) {
            logEl.innerHTML = '<div class="log-empty">Nicio acțiune încă. Arată un gest!</div>';
            return;
        }

        logEl.innerHTML = logs.map(entry => `
            <div class="log-entry">
                <span class="log-time">${entry.time}</span>
                <span class="log-gesture">${entry.gesture}</span>
                <span class="log-msg">${entry.message}</span>
            </div>
        `).join('');
    },

    setConfirmProgress(pct) {
        const circle = document.getElementById('confirm-fill-circle');
        if (circle) circle.setAttribute('stroke-dasharray', `${pct} 100`);
        const statusEl = document.getElementById('confirm-status');
        if (pct > 0 && statusEl) statusEl.textContent = 'Se confirmă gestul...';
    },

    resetConfirm(label = 'Arată un gest...') {
        const circle = document.getElementById('confirm-fill-circle');
        if (circle) circle.setAttribute('stroke-dasharray', '0 100');
        const statusEl = document.getElementById('confirm-status');
        if (statusEl) statusEl.textContent = label;
    },

    showCooldown(durationMs) {
        const wrapper = document.getElementById('cooldown-bar-wrapper');
        const bar     = document.getElementById('cooldown-progress');
        if (!wrapper || !bar) return;
        wrapper.style.display = 'block';
        bar.style.transition = 'none';
        bar.style.width = '100%';
        requestAnimationFrame(() => {
            bar.style.transition = `width ${durationMs}ms linear`;
            bar.style.width = '0%';
        });
        setTimeout(() => { wrapper.style.display = 'none'; }, durationMs);
    }
};
