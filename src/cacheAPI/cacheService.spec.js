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
    it("getAllKeys", () => {
    })
    it("create", () => {
    })
    it("updatev", () => {
    })
    it("remove", () => {
    })
    it("removeAll", () => {
    })
})