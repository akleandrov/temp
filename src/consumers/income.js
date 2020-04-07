const amqp = require('amqplib');
const { rabbitmq: config } = require('config');
const logger = require('../logger');
const storage = require('../storage');
const producers = require('../producers');

const {
    user, password, host, port,
} = config.connection;

const url = `amqp://${user}:${password}@${host}:${port}`;
let channel;

const handler = async (msg) => {
    const buf = Buffer.from(msg.content);
    let id;
    try {
        const data = JSON.parse(buf.toString('utf8'));
        const { command, key, value } = data;
        id = data.id;
        const response = await storage.execute({ command, key, value });
        if (id) {
            producers.outcome.publish({
                id,
                result: {
                    success: true,
                    data: response,
                },
            });
        }
        channel.ack(msg);
    } catch (error) {
        logger.error('fail processing message', { error, buf });
        channel.ack(msg);
        if (id) {
            producers.outcome.publish({
                id,
                result: {
                    success: false,
                },
            });
        }
    }
};

const consume = async () => {
    try {
        const conn = await amqp.connect(url);
        channel = await conn.createChannel();
        await channel.assertQueue(config.queues.INCOME_QUEUE);
        await channel.consume(config.queues.INCOME_QUEUE, handler);
        logger.info('income consumer started');
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const stop = async () => {
    try {
        await channel.close();
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = {
    consume,
    stop,
};
