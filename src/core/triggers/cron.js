class TriggerCron {

    name = "cron"

    constructor({ day, time }) {
        this.day = day;
        this.time = time;
        this.triggerHistory = []
        this.armed = false
    }

    arm(callback) {
        const now = new Date();
        const [hours, minutes] = this.time.split(':').map(Number);

        // Encuentra el próximo día y hora objetivo
        const nextTrigger = new Date(now);
        nextTrigger.setHours(hours, minutes, 0, 0); // Establece la hora

        // Calcula la diferencia de días hasta el próximo día deseado
        const dayDiff = (this.day - now.getDay() + 7) % 7;
        nextTrigger.setDate(now.getDate() + dayDiff);

        // Si el tiempo objetivo ya pasó hoy, ajusta al próximo día de la semana
        if (nextTrigger < now) {
            nextTrigger.setDate(nextTrigger.getDate() + 7);
        }

        // Calcula el tiempo restante hasta la próxima ejecución
        const timeUntilTrigger = nextTrigger - now;

        const callbackTrigger = () => {
            this.triggerHistory.push({
                timestamp: new Date(),
                day: this.day,
                time: this.time
            });
            this.armed = false
            callback();
        }

        // Ejecuta el callback cuando se alcance el momento objetivo
        setTimeout(callbackTrigger, timeUntilTrigger);
        this.armed = true;


    }

    clearHistory(){
        this.triggerHistory = [];
    }

    toJSON(){
        return {
            day: this.day,
            time: this.time,
            triggerHistory: this.triggerHistory,
            armed: this.armed
        }
    }
}

module.exports = { TriggerCron };
