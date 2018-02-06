import {maxCacheCount, cacheTTL} from '../config';

const cacheServiceGenerator = (cacheDB) => {
    const cacheValueGenerator = () => Math.random().toString();
    const extractKeys = arr => arr.map(({key}) => key);
    const newOrError = (key, value) => doc => {
        if (doc === null) {
            return newCache({key, value}).save() 
        } else {
            throw `Key does already exist. Use put method instead`;
        }
    }
    const ifNotExistCreate = key => doc => {
        if (doc === null) {
            console.log(`Cache miss`);
            return newCache({key, value: cacheValueGenerator()}).save().then(validateDocNumbers);
        } else {
            console.log(`Cache hit`);
            return doc;
        }
    }
    const validateDocNumbers = doc => {
        return cacheDB.count({}).then(n => {
            if (n > maxCacheCount) {
                // remove the oldest doc
                return cacheDB
                    .findOne()
                    .sort({'created_at' : -1})
                    .then(d => d.remove())
                    .then(_ => doc);
            } else {
                return doc;
            }
        });
    }
    const validateTTL = doc => {
        const expiredDate = new Date(doc.lastUsage.getTime() + cacheTTL);
        const now = new Date();
        const updateDoc = () => now > expiredDate 
            ? doc.update({ $set: { value: cacheValueGenerator(), lastUsage: new Date() } })
            : doc.update({ $set: { lastUsage: new Date() } });
        
        return updateDoc().then(_ => cacheDB.findOne({key: doc.key}));
    }
    const newCache = ({key, value}) => new cacheDB({key, value, lastUsage: new Date()});
    // methods to work with cache DB
    const get = key => cacheDB.findOne({key})
        .then(ifNotExistCreate(key))
        .then(validateTTL);
    const getAllKeys = () => cacheDB.find({}).then(extractKeys);
    const create = (key, value) => newCache({key, value}).save()
        .then(validateDocNumbers);
    const update = (key, value) => cacheDB.update({key}, {$set: { value }}).then(validateTTL);
    const remove = key => cacheDB.find({ key }).remove();
    const removeAll = () => cacheDB.remove({});

    return {
        get,
        getAllKeys,
        create,
        update,
        remove,
        removeAll,
    }
}

export default cacheServiceGenerator;
