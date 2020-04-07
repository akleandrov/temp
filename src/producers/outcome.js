const amqp = require('amqplib');
const { rabbitmq: config } = require('config');
const logger = require('../logger');

const {
    user, password, host, port,
} = config.connection;
const url = `amqp://${user}:${password}@${host}:${port}`;
let channel;

const init = async () => {
    try {
        const conn = await amqp.connect(url);
        channel = await conn.createChannel();
        await channel.assertQueue(config.queues.OUTCOME_QUEUE);
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const publish = async (data) => {
    if (!channel) {
        logger.warn('outcome producer self init');
        await init();
    }
    await channel.sendToQueue(config.queues.OUTCOME_QUEUE, Buffer.from(JSON.stringify(data)));
};

module.exports = {
    init,
    publish,
};
