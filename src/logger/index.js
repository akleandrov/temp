
const {
    createLogger, format, transports, config: winstonConfig,
} = require('winston');

const { combine, timestamp, json } = format;

const errorStackFormat = format((info) => {
    if (info instanceof Error) {
        return {
            ...info,
            stack: info.stack,
            message: info.message,
        };
    }
    return info;
});

const logger = createLogger({
    levels: winstonConfig.npm.levels,
    format: combine(
        errorStackFormat(),
        timestamp(),
        json(),
    ),
    transports: [
        new transports.Console({ level: 'debug' }),
    ],
});

module.exports = logger;
