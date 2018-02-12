import sinon from 'sinon';
import chai, { expect } from 'chai';
import chai_match from 'chai-match';
import cacheServiceGenerator from './cacheService';
chai.use(chai_match);

const CACHE_1 = {
    value: '1',
    key: '2',
    lastUsage: new Date(),
}

const dbCacheStub = () => {
    const dbStub = {
        find: sinon.stub().resolves([CACHE_1]),
        findOne: sinon.stub().resolves(CACHE_1),
        count: sinon.stub().resolves(1),
        remove: sinon.stub().resolves(),
        update: sinon.stub().resolves(CACHE_1),
        save: sinon.stub().resolves(CACHE_1),
    };
    const injectable = function() { 
        Object.assign(this, dbStub);
    };
    Object.assign(injectable, dbStub);
    return injectable;
}

describe("cacheService", () => {
    let db;
    let service;
    beforeEach(() => {
        db = dbCacheStub();
        service = cacheServiceGenerator(db);
    });
    describe("get", () => {
        it("should return cache and key", done => {
            const KEY = '123';
            db.findOne.onFirstCall().resolves(null);
            service
                .get(KEY)
                .then(doc => {
                    expect(doc.value).match(/^[0-9]{1,2}([,.][0-9]{1,2})?$/);
                    done();
                });
        });
        it("should return cache object if key exists", done => {
            service
                .get(CACHE_1.key)
                .then(doc => {
                    expect(doc.key).to.equals(CACHE_1.key);
                    expect(doc.value).to.equals(CACHE_1.value);
                    done();
                });
        });
    });
    describe("getAllKeys", () => {

        it("should return list of keys", done => {
            const CACHES = [{key: '1'}, {key: '2'}, {key: '3'}];
            db.find.resolves(CACHES);

            service
                .getAllKeys()
                .then(keys => {
                    keys.forEach((key, i) => {
                        expect(key).to.equals(CACHES[i].key);
                    });
                    expect(keys.length).to.equal(CACHES.length);
                    done();
                });
        });
    })
    describe("create", () => {
        it("should call .save method to mongo db", done => {
            const SAVED_CACHE = {key: '1', value: '2'};
            service
                .create(SAVED_CACHE)
                .then(res => {
                    db.save.calledWith(SAVED_CACHE);
                    sinon.assert.calledOnce(db.save);
                    done();
                })
        })
    })
    describe("update", () => {
        it("should call .update method to update db value", done => {
            const value = 'new';
            service
                .update(CACHE_1.key, value)
                .then(res => {
                    // sinon.assert.calledWith(db.update.onCall(0), {key: CACHE_1.key}, {$set: {value}});
                    // sinon.assert.calledOnce(db.update);
                    done();
                });
        });
    })
    describe("remove", () => {
        it("should call .delete method to remove key and value from db", done => {
            const key = 'random key';
            service
                .remove(key)
                .then(res => {
                    sinon.assert.calledWith(db.remove, { key });
                    sinon.assert.calledOnce(db.remove);
                    done();
                });
        });
    })
    it("remove", () => {
        it("should call .delete method with {} query to clear all docs", done => {
            service
                .removeAll()
                .then(res => {
                    sinon.assert.calledWith(db.remove, { });
                    sinon.assert.calledOnce(db.remove);
                    done();
                });
        });
    })
})