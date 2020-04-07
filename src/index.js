const consumers = require('./consumers');
const producers = require('./producers');
const logger = require('./logger');
const storage = require('./storage');

process.on('uncaughtException', (error) => logger.error(error));
process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', reason);
});

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach((sig) => {
    process.on(sig, async (signal) => {
        logger.info(`graceful shutdown after ${signal}`);
        await consumers.shutdown();
        process.exit(0);
    });
});

const run = async () => {
    try {
        await storage.recover();
        await producers.init();
        await consumers.init();
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

run();
