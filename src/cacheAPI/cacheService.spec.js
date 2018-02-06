import {expect} from 'chai';
import sinon from 'sinon';
import cacheServiceGenerator from './cacheService';

describe("cacheService", () => {
    let db;
    let service;
    beforeEach(() => {
        const _db = {
            find: sinon.stub(),
            findOne: sinon.stub(),
            count: sinon.stub(),
            remove: sinon.stub(),
            update: sinon.stub(),
        };
        db = function() {
            Object.assign(this, _db);
        };
        Object.assign(db.prototype, _db);

        service = cacheServiceGenerator(db);
    });
        it("get", (done) => {
        })
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