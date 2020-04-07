let memory = new Map();

const load = (data) => {
    memory = new Map(data);
};

const storage = {
    get: (key) => memory.get(key),
    set: (key, value) => memory.set(key, value),
    delete: (key) => memory.delete(key),
};

module.exports = {
    storage,
    load,
};
