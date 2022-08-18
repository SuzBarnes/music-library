const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('update album', () => {
  let db;
  let createdArtistsIds;
  let createdAlbumsIds;
  let createdAlbums;
  let createdArtists;
  let artists;
  let albums;

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

    [artists] = await db.query('SELECT * FROM Artist');
    createdArtistsIds = createdArtists.map((artist) => {
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
    [albums] = await db.query('SELECT * FROM Album');
    createdAlbumsIds = createdAlbums.map((album) => {
      return album[0].insertId;
    });
    // console.log(createdAlbumsIds)
    // console.log(createdAlbums);
  });
  afterEach(async () => {
    // await db.query('DELETE FROM Album');
    await db.end();
  });

  describe('/artist/:artistId/album/:albumId', () => {
    describe('PATCH', () => {
      it('updates a single album with the correct id', async () => {
        const artist = artists[0];
        const album = albums[0];
        const res = await request(app)
          .patch(`/artist/${createdArtistsIds[0]}/album/${createdAlbumsIds[0]}`)
          .send({ name: 'new name', year: 2000 });

        // console.log('============>');
        // console.log('Artist ID', artist.id);
        // console.log('Artist', artist)
        // console.log(album.name);
        // console.log(album.year)
        // console.log(createdArtistsIds[0])
        // console.log(album.artistId)
        // console.log(album.id)
        // console.log(createdAlbumsIds[0])
        // console.log("created Albums", createdAlbums)

        // console.log('/artist/10002957/album/1192', res)

        expect(res.status).to.equal(201);

        const [[newAlbumRecord]] = await db.query(
          'SELECT * FROM Album WHERE id = ?',
          [createdAlbumsIds[0]]
        );
        console.log('============>');
        console.log('newAlbumRecord', newAlbumRecord);
        console.log(album.name);
        expect(newAlbumRecord.name).to.equal('new name');
      });

      it('returns a 404 if the album is not in the database', async () => {
        const res = await request(app)
          .patch('/artist/999999/album/999999')
          .send({ name: 'new name' });

        expect(res.status).to.equal(404);
      });
    });
  });
});
