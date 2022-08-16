const {expect} = require('chai');
const request = require('supertest');
const getDb = require(('../src/services/db'));
const app = require('../src/app');

describe('create album', () => {
    let db;
    beforeEach(async () => {db = await getDb()
        try {await db.query('INSERT INTO Artist (id, name, genre) VALUES (?, ?, ?)', [
            9999999,
            'Jack Johnson',
            'Rock'
            ]);
           const artist = await db.query('SELECT * FROM Artist');
           console.log(artist[0]);}
           catch(err){console.log(err)}
    })
    
    afterEach(async () => {
        await db.query('DELETE FROM Artist');
        await db.end();
    });


describe('/artist/:artistId/album', () => {
    describe('POST', () => {
        it('creates a new album in the database', async () => {
            const res = await request(app).post('/artist/9999999/album').send({
                name: 'In Between Dreams',
                year: 2005
            });

            expect(res.status).to.equal(201);

            const [[albumEntries]] = await db.query(
                `SELECT * FROM Album WHERE name = 'In Between Dreams'`
            );

            expect(albumEntries.name).to.equal('In Between Dreams');
            expect(albumEntries.year).to.equal(2005);
        });
    });
});
});