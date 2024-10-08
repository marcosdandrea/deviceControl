const {TriggerApi} = require("./api")
const { TriggerCron } = require("./cron")
const {TriggerEvent} = require("./event")
const { TriggerUDP } = require("./udp")

module.exports = {
    api: TriggerApi,
    event: TriggerEvent,
    cron: TriggerCron,
    udp: TriggerUDP
}