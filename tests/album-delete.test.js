const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('delete album', () => {
    let db;
    let createdAlbumsIds;
    let createdArtistsIds
    let createdArtists;
    let createdAlbums;

beforeEach(async () => {
    db = await getDb();

    createdArtists = await Promise.all([
        db.query('INSERT INTO Artist (name, genre) VALUES (?, ?)', [
            'Jack Johnson',
            'Rock',
        ]),
        db.query('INSERT INTO Artist (name, genre) VALUES (?, ?)', [
            'Moby',
            'Rock',
        ]),
        db.query('INSERT INTO Artist (name, genre) VALUES (?, ?)', [
            'Maroon 5',
            'Pop',            
        ]),
    ]);
    createdArtistsIds = createdArtists.map((artist)=> {
        return artist[0].insertId;
    });

    createdAlbums = await Promise.all([
        db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
            'In Between Dreams',
            2005,
            createdArtistsIds[0],
          ]),
          db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
            'Innocents',
            1988,
            createdArtistsIds[1],
          ]),
          db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
            'Songs about Jane',
            2002,
            createdArtistsIds[2],
          ]),
        ]);
    console.log(createdAlbums)
    createdAlbumsIds = createdAlbums.map((album) => {
        return album[0].insertId;
    });

    afterEach(async () => {
        await db.query('DELETE FROM Album');
        await db.end();
    });

    describe('/artist/:artistId/album', () => {
        describe('DELETE', () => {
            it('deletes a single album with the correct id', async () => {
                const res = await (await request(app).delete(`/artist/${createdArtistsIds[0]}/album/${createdAlbumsIds[0]}`)).send();
                expect (res.status).to.equal(200);

                const [[deletedAlbumRecord]] = await db.query(
                    'SELECT * FROM Album WHERE id = ?',
                    [createdAlbumsIds]
                );
                expect(!!deletedAlbumRecord).to.be.false;
            });
            
            it('returns a 404 if the album is not in the database', async () => {
                const res = await request(app).delete('/artist/999999/album/999999').send();

                expect(res.status).to.equal(404);
            })
        })
    })
});
});