const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read album', () => {
  let db;
  let albums;
  let createdArtistsIds;

  beforeEach(async () => {
    db = await getDb();

    const createdArtists = await Promise.all([
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
    //    console.log(createdArtists);
    createdArtistsIds = createdArtists.map((artist) => {
      return artist[0].insertId;
    });
    //    console.log(JSON.stringify(createdArtistsIds));

    // const createdAlbums =
    await Promise.all([
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
    // console.log(createdAlbums);
    // const createdAlbumsIds = createdAlbums.map((album) => {
    //   return album[0].insertId;
    // });
    // console.log(JSON.stringify(createdAlbumsIds));

    [albums] = await db.query('SELECT * FROM Album');
    // console.log(albums);
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.end();
  });

  describe('/artist/:artistId/album', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        const res = await request(app)
          .get(`/artist/${createdArtistsIds[0]}/album`)
          .send();
        // console.log('albums', albums);
        // console.log('======================>');
        // console.log('body', res.body);

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);

        res.body.forEach((albumRecord) => {
          //   console.log(albumRecord);
          const expected = albums.find((a) => {
            // console.log('AID', a.id);
            // console.log('albumRecord', albumRecord.id);
            return a.id === albumRecord.id;
          });
          //   console.log(expected);
          expect(albumRecord).to.deep.equal(expected);
        });
      });
    });
  });
  describe('/artist/:artistId/album/:albumId', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
        const expected = albums[0];
        const res = await request(app)
          .get(`/artist/${createdArtistsIds[0]}/album/${expected.id}`)
          .send();

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(expected);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const res = await request(app)
          .get('/artist/:artistId/album/999999')
          .send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
