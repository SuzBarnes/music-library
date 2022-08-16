const {expect} = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read album', () => {
    let db;
    let albums;

    beforeEach(async () => {
        db = await getDb();
        
        await Promise.all([
            db.query('INSERT INTO Album (id, name, year, artistId) VALUES (?, ?, ?, ?)',[
                999999,
                'In Between Dreams',
                2005,
                5
            ])
        ]);
        
        [albums] = await db.query('SELECT * FROM Album');
        console.log(albums);
    });

    afterEach(async () => {
        await db.query('DELETE FROM Album');
        await db.end();
    });

    describe('/artist/:artistId/album', () => {
        describe('GET', () => {
            it('returns all album records in the database', async () => {
                const res = await request(app).get('/artist/:artistId/album').send();

                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(1);

                res.body.forEach((albumRecord)=> {
                    const expected = albums.find((a) => a.id === albumRecord.id);
                    
                    expect(albumRecord).to.deep.equal(expected);
                });
            });
        });
    })

    
})