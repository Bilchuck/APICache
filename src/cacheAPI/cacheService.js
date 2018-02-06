import Cache from './cache.model';
import mongoose from 'mongoose';

const database = 'mongodb://localhost:27017/cacheAPI';
const MAX_CACHE_COUNT = 5;
const TTL = 10000; //10 sec

mongoose.connect(database, {
    useMongoClient: true,
  }, () => {
    console.log(`Connected to db: ${database}`);
});

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
        const cache = {key, value: cacheValueGenerator()};
        return newCache(cache).save().then(_ => cache).then(validateDocNumbers);
    } else {
        console.log(`Cache hit`);
        return doc;
    }
}
const validateDocNumbers = doc => {
    return Cache.count({}).then(n => {
        if (n > MAX_CACHE_COUNT) {
            // remove the oldest doc
            return Cache
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
    const expiredDate = new Date(doc.lastUsage.getTime() + TTL);
    const now = new Date();
    const updateDoc = () => {
        if (now > expiredDate) {
            return doc.update({ $set: { value: cacheValueGenerator(), lastUsage: new Date() } });
        } else {
            return doc.update({ $set: { lastUsage: new Date() } });
        }
    }
    return updateDoc().then(_ => {
        return Cache.findOne({key: doc.key}).then(r => {
            return r;
        })
    })
}
const newCache = ({key, value}) => new Cache({key, value, lastUsage: new Date()});
// methods to work with cache DB
const get = key => Cache.findOne({key})
    .then(ifNotExistCreate(key))
    .then(validateTTL);
const getAllKeys = () => Cache.find({}).then(extractKeys);
const create = (key, value) => get(key)
    .then(newOrError(key, value))
    .then(validateDocNumbers);
const update = (key, value) => Cache.update({key}, {$set: { value }});
const remove = key => Cache.find({ key }).remove();
const removeAll = () => Cache.remove({});

export {
    create,
    update,
    remove,
    removeAll,
    get,
    getAllKeys,
}