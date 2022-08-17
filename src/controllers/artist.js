const getDb = require('../services/db');

exports.read = async (req,res) => {
  const db = await getDb();
  try {
    const [artists] = await db.query('SELECT * FROM Artist');
    res.status(200).json(artists);
  } catch (err) {
    res.sendStatus(500).json(err);
  }
  db.end();
};

exports.create = async (req, res) => {
    const db = await getDb();

    const { name, genre } = req.body;
  
    try {
      await db.query('INSERT INTO Artist (name, genre) VALUES (?, ?)', [
      name,
      genre
      ]);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(500).json(err);
    }
    
    db.end();
  };

  exports.readById = async (req, res) => {
    const db = await getDb();
    const { artistId } = req.params;
  
    const [[artist]] = await db.query('SELECT * FROM Artist WHERE id = ?', [
      artistId,
    ]);
  
    if (!artist) {
      res.status(404).json({error: "Artist could not be found."});
    } else {
      res.status(200).json(artist);
    }
  
    db.end();
};

exports.update = async (req, res) => {
  const db = await getDb();
  const data = req.body;
  const { artistId } = req.params;

  try {
    const [
      { affectedRows },
    ] = await db.query('UPDATE Artist SET ? WHERE id = ?', [data, artistId]);

    if (!affectedRows) {
      res.status(404).send({error: 'Artist not found.'});
    } else {
      res.status(200).send({result: 'The artist has been updated!'});
    }
  } catch (err) {
    res.sendStatus(500);
  }

  db.end();
};

exports.delete = async (req, res) => {
  const db = await getDb();
  const {artistId} = req.params;
  const [[artist]] = await db.query('SELECT * FROM Artist WHERE id = ?', [
      artistId,
    ]);

  const [deletedArtistRecord] = await db.query('DELETE FROM Artist WHERE id = ?', [ 
    artistId
  ]);
  // console.log(deletedArtistRecord);

  if(!artist){
    res.status(404).json({error: 'Artist record could not be found to delete.'});
  } else {
      res.status(200).send({result: `Artist with the id of ${artistId} has been removed from the database.`});
  }
  db.end();
};


exports.readAlbum = async (req, res) => {
  const db = await getDb();
  try{
    const [albums] = await db.query('SELECT * FROM Album');
    console.log(albums)
    res.sendStatus(200).json(albums);
  } catch (err) {
    res.sendStatus(500).json(err);
  }
  db.end();
};


exports.createAlbum = async (req, res) => {
  const db = await getDb();
  const {name, year} = req.body;
  const {artistId} = req.params;

  try { 
      await db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
          name,
          year,
          artistId
      ]);
      res.sendStatus(201);
  } catch (err){
      res.sendStatus(500).json(err)
  }
 
  db.end();
};