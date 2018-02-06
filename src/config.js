const PORT = process.env.PORT || 8080
const cacheDb = `mongodb://localhost:27017/cacheAPI`;
const cacheTTL = 10000; //10 sec
const maxCacheCount = 5;

export {
    PORT,
    cacheDb,
    cacheTTL,
    maxCacheCount,
};