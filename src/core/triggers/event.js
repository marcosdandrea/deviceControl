const { globals } = require("../../globals")

class TriggerEvent {

    name = "event"

    constructor({ name }) {
        this.name = name;
        this.triggerHistory = [];
        this.armed = false;
    }

    arm(callback) {
        this.armed = true
        const triggerCallback = () => {
            callback();
            this.armed = false
            this.triggerHistory.push({
                timestamp: new Date(),
                event: this.name
            });
        }

        globals.EVENTS.on(this.name, triggerCallback)
    }

    clearHistory(){
        this.triggerHistory = [];
    }

    toJSON(){
        return {
            name: this.name,
            triggerHistory: this.triggerHistory
        }
    }
}

module.exports = { TriggerEvent };