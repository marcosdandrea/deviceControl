
function wait() {}

wait.run = function ({ time }) {
    return new Promise(resolve => setTimeout(resolve, time))
}

wait.args = function () {
    return [{
        name: 'time',
        description: 'Tiempo de espera en milisegundos',
        type: 'number',
        required: true
    }];
}

module.exports = wait;
