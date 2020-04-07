const { dataPath } = require('config');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const logger = require('../logger');

const walPath = path.resolve(dataPath, 'wal');

if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

const write = (command) => {
    try {
        const date = Date.now();
        const log = `${date}\t${JSON.stringify(command)}\n`;
        fs.appendFileSync(walPath, log);
    } catch (error) {
        logger.error('fail write wal', { error });
    }
};

const reader = () => {
    if (!fs.existsSync(walPath)) {
        return null;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(walPath),
    });

    return rl;
};

module.exports = {
    write,
    reader,
};
