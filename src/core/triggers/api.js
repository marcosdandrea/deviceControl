const { globals } = require("../../globals")

class TriggerApi {

    name = "API"

    constructor({ method, endpoint }) {
        this.method = method;
        this.expressApp = globals.EXPRESS_APP;
        this.endpoint = endpoint;
        this.triggerHistory = [];
        this.armed = false;
    }

    arm(callback) {
        this.armed = true

        const handleOnTrigger = (req, res) => {
            if (!this.armed) {
                res.send({error: "trigger not armed"})
                return
            }
            const thisTrigger = {
                timestamp: new Date(),
                method: req.method,
                endpoint: req.originalUrl
            }
            this.triggerHistory.push(thisTrigger)
            res.send(thisTrigger)
            callback(thisTrigger)
            this.armed = false
        }

        this.expressApp[this.method.toLowerCase()](this.endpoint, handleOnTrigger)

    }

    clearHistory() {
        this.triggerHistory = []
    }

    toJSON(){
        return {
            name: this.name,
            method: this.method,
            endpoint: this.endpoint,
            triggerHistory: this.triggerHistory
        }
    }

}

module.exports = { TriggerApi };