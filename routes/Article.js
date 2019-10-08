'use strict'

var express = require('express');
var articleController = require('../controllers/Article');

var router = express.Router();

var multipart = require('connect-multiparty');

var mdUpload = multipart({uploadDir: './src/upload/articles'});

router.get('/test/', articleController.test);
router.post('/datos/', articleController.datosCurso);

router.post('/articles/', articleController.saveArticle);
router.get('/articles/:last?', articleController.getArticles);
router.get('/search/:search?', articleController.searchArticle);
router.get('/article/:id/', articleController.getArticle);
router.put('/article/:id/', articleController.updateArticle);
router.delete('/article/:id/', articleController.deleteArticle);
router.post('/upload/image/:id/', mdUpload, articleController.upload)
router.get('/image/:image', mdUpload, articleController.getImage)
module.exports = router;