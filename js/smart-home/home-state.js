/**
 * HomeState – starea centralizată a tuturor dispozitivelor din casă.
 */
const HomeState = {
    devices: {
        bec_living:    { name: 'Bec Living',      type: 'light',    room: 'living',    state: false },
        bec_dormitor:  { name: 'Bec Dormitor',     type: 'light',    room: 'dormitor',  state: false },
        bec_baie:      { name: 'Bec Baie',         type: 'light',    room: 'baie',      state: false },
        bec_bucatarie: { name: 'Bec Bucătărie',    type: 'light',    room: 'bucatarie', state: false },
        centrala:      { name: 'Centrală Termică', type: 'heating',  room: null,        state: false },
        alarma:        { name: 'Alarmă',           type: 'security', room: null,        state: false }
    },

    actionLog: [],

    setState(deviceId, newState) {
        if (this.devices[deviceId]) {
            this.devices[deviceId].state = newState;
        }
    },

    getState(deviceId) {
        return this.devices[deviceId]?.state ?? false;
    },

    addLog(message, gesture) {
        const now = new Date();
        const time = now.toLocaleTimeString('ro-RO', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        this.actionLog.unshift({ time, message, gesture, id: Date.now() });
        if (this.actionLog.length > 20) this.actionLog.pop();
    },

    resetAll() {
        Object.keys(this.devices).forEach(key => {
            this.devices[key].state = false;
        });
        this.actionLog = [];
    }
};
