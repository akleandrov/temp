const { snapshotOffset } = require('config');
const commands = require('./commands');
const logger = require('../logger');
const wal = require('./wal');
const snapshot = require('./snapshot');
const { storage } = require('./memory');

let offset = 0;

const incrementOffset = async () => {
    offset += 1;
    if (offset === snapshotOffset) {
        await snapshot.create(Date.now());
        offset = 0;
    }
};

const get = (key) => storage.get(key);

const set = async (key, value) => {
    wal.write({
        command: commands.WRITE,
        key,
        value,
    });
    await incrementOffset();
    storage.set(key, value);
};

const remove = async (key) => {
    wal.write({
        command: commands.DELETE,
        key,
    });
    await incrementOffset();
    storage.delete(key);
};

const execute = async ({ command, key, value }) => {
    switch (command) {
        case commands.WRITE: return set(key, value);
        case commands.READ: return get(key);
        case commands.DELETE: return remove(key);
        default: {
            logger.warn('invalid command', { command });
            return null;
        }
    }
};

const directExecute = async ({ command, key, value }) => {
    switch (command) {
        case commands.WRITE: {
            storage.set(key, value);
            break;
        }
        case commands.DELETE: {
            storage.remove(key);
            break;
        }
        default: {
            logger.warn('invalid command', { command });
            break;
        }
    }
};


const recover = () => new Promise((resolve) => {
    const snapshotDate = snapshot.recover();
    const walReader = wal.reader();
    if (!walReader) resolve();
    walReader.on('line', (line) => {
        const [date, raw] = line.split('\t', 2);
        if (!snapshotDate || date > snapshotDate) {
            directExecute(JSON.parse(raw));
        }
    });
    walReader.on('close', () => {
        logger.info('wal processing complete');
        resolve();
    });
});

module.exports = {
    commands,
    execute,
    recover,
};
