import cacheServiceGenerator from './cacheService';
import Cache from './cache.model';
import mongoose from 'mongoose';

const database = 'mongodb://localhost:27017/cacheAPI';
mongoose.connect(database, {
    useMongoClient: true,
  }, () => {
    console.log(`Connected to db: ${database}`);
});
const cacheService = cacheServiceGenerator(Cache);

const CACHE_ENDPOINT = '/cache';
const KEYS_ENDPOINT = '/keys';


const registerCacheRoutes = app => {
    app.get(CACHE_ENDPOINT, (req, res) => {
        const {query: { key }} = req;
        cacheService.get(key)
            .then(beautifyResponse)
            .then(sendCacheValue(res))
            .catch(sendError(res));
    });
    app.post(CACHE_ENDPOINT, (req, res) => {
        const {key, value} = req.body;      
        cacheService.create(key, value)
            .then(sendOk(res))
            .catch(sendError(res));
    });
    app.put(`${CACHE_ENDPOINT}/:key`, (req, res) => {
        const { key } = req.params;
        const { value } = req.body
        cacheService.update(key, value)
            .then(sendOk(res))
            .catch(sendError(res));
    });
    app.delete(`${CACHE_ENDPOINT}/:key`, (req, res) => {
        const { key } = req.params;
        cacheService.remove(key)
            .then(sendOk(res))
            .catch(sendError(res));
    });
    app.get(`${KEYS_ENDPOINT}`, (req, res) => {
        cacheService.getAllKeys()
            .then(sendCacheValue(res))
            .catch(sendError(res));
    });
    app.delete(`${KEYS_ENDPOINT}`, (req, res) => {
        cacheService.removeAll()
            .then(sendOk(res))
            .catch(sendError(res));
    });
}

const sendError = res => error => res.send({error});
const sendCacheValue = res => value => res.send(value);
const beautifyResponse = ({value, key}) => ({value, key});
const sendOk = res => res.sendStatus(200);

export default registerCacheRoutes;