
module.exports = {
    snapshotOffset: 100,
    dataPath: process.env.DATA_PATH || '/var/data',
    rabbitmq: {
        connection: {
            user: process.env.RABBIT_USER,
            password: process.env.RABBIT_PASS,
            host: process.env.RABBIT_HOST,
            port: process.env.RABBIT_PORT,
        },
        queues: {
            INCOME_QUEUE: 'INCOME_QUEUE',
            OUTCOME_QUEUE: 'OUTCOME_QUEUE',
        },
    },
};
