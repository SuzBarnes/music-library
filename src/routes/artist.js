const express = require('express');

const artistController = require('../controllers/artist');

const router = express.Router();

router.post('/', artistController.create);
router.get('/', artistController.read);

router.get('/:artistId', artistController.readById);
router.patch('/:artistId', artistController.update);
router.delete('/:artistId', artistController.delete);

router.post('/:artistId/album', artistController.createAlbum);
router.get('/:artistId/album', artistController.readAlbum);

router.get('/:artistId/album/:albumId', artistController.readAlbumById);
router.patch('/:artistId/album/:albumId', artistController.updateAlbum);
router.delete('/:artistId/album/:albumId', artistController.deleteAlbum);

module.exports = router;
