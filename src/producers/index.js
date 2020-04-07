const outcome = require('./outcome');
const logger = require('../logger');

const init = async () => {
    await outcome.init();
    logger.info('producers initialized');
};

module.exports = {
    init,

    outcome,
};
