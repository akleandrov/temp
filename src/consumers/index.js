const income = require('./income');
const logger = require('../logger');

const init = async () => {
    await income.consume();
    logger.info('consumers initialized');
};

const shutdown = async () => {
    await income.stop();
};

module.exports = {
    init,
    shutdown,

    income,
};
