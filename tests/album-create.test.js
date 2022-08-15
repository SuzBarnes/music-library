const {expect} = require('chai');
const request = require('supertest');
const getDb = require(('../src/services/db'));
const app = require('../src/app');
const db = require('../src/services/db');

describe('create album', () => {
    let db;
    beforeEach(async () => (db = await getDb()));

    afterEach(async () => {
        await db.query('DELETE FROM Artist');
        await db.end();
    });
});

describe('/artist/:artistId/album', () => {
    describe('POST', () => {
        it('creates a new album in the database', async () => {
            const res = await request(app).post('/album').send({
                name: 'In Between Dreams',
                year: '2005',
                artistId: '1'
            });

            expect(res.status).to.equal(201);

            const [[albumEntries]] = await db.query(
                `SELECT * FROM Album WHERE name = 'In Between Dreams'`
            );

            expect(albumEntries.name).to.equal('In Between Dreams');
            expect(albumEntries.year).to.equal('2005');
        });
    });
});