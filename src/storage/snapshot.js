const { dataPath } = require('config');
const fs = require('fs');
const path = require('path');
const { storage, load } = require('./memory');
const logger = require('../logger');

const snapshotPath = path.resolve(dataPath, 'snapshot');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}


const create = async (date) => {
    try {
        const snapshot = {
            updatedAt: date,
            data: [...storage],
        };
        await fs.promises.writeFile(snapshotPath, JSON.stringify(snapshot));
    } catch (error) {
        logger.error('fail create snapshot', { error });
    }
};

const recover = () => {
    try {
        if (!fs.existsSync(snapshotPath)) {
            return null;
        }
        const raw = fs.readFileSync(snapshotPath);
        const { data, updatedAt } = JSON.parse(raw);
        load(data);
        return updatedAt;
    } catch (error) {
        logger.error('fail load snapshot', { error });
        return null;
    }
};

module.exports = {
    create,
    recover,
};
