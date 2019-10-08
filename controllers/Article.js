'use strict'

var validator = require('validator');
var Article = require('../models/Article');

var fs = require('fs');
var path = require('path');

var controller = {
    datosCurso: (req, res) => {
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Alejandro Mejía',
            url: 'https://github.com/JandroMejia97'
        })
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Método de prueba'
        });
    },
    saveArticle: (req, res) => {
        // Obtener datos
        var params = req.body;

        // Validar datos
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch(error) {
            return res.status(400).send({
                status: 'Error: ' + error,
                message: 'Bad request'
            });
        }
        if (validateTitle && validateContent) {
            // Crear el objeto
            var article = new Article()

            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el Artíulo
            article.save((error, articleStored) => {
                if (error || !articleStored) {
                    return res.status(400).send({
                        status: 'BAD REQUEST',
                        message: 'El Artículo no pudo ser guardado'
                    })
                } else {
                    // Devolver una respuesta
                    return res.status(200).send({
                        status: 'Petición exitosa',
                        message: 'Validación correcta',
                        article: articleStored
                    })
                }
            });
        } else {
            return res.status(400).send({
                status: 'Error: Datos incompletos',
                message: 'Se requiere un título y un contenido'
            });
        }
    },
    updateArticle: (req, res) => {
        // Obtener datos
        var params = req.body;

        // Obtener el id de la URL
        var id = req.params.id;
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(400).send({
                status: 'Error: ' + error,
                message: 'Bad request'
            });
        }
        // Validar datos
        if (validateTitle && validateContent) {
            // Buscar y actualizar
            Article.findByIdAndUpdate({_id: id}, params, {new: true}, (error, article) => {
                if (error) {
                    return res.status(500).send({
                        status: 'BAD REQUEST',
                        message: 'Error al atualizar: ' + error
                    })
                }
                if (!article) {
                    return res.status(404).send({
                        status: 'BAD REQUEST',
                        message: 'Error Artículo no encontrado'
                    })
                }
                return res.status(200).send({
                    status: 'SUCCESS',
                    article
                })
            })
        } else {
            return res.status(500).send({
                status: 'BAD REQUEST',
                message: 'Error: ' + error
            });
        }

    },
    getArticles: (req, res) => {
        var last = req.params.last;
        var query = Article.find({});
        if (last || last != undefined) {
            query.limit(5);
        }
        // Find articles
        query.sort('-date').exec((error, articles) => {
            if (error) {
                return res.status(500).send({
                    status: 'BAD REQUEST',
                    message: 'Error: ' + error
                })
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'BAD REQUEST',
                    message: 'Error: No se encontraron artículos'
                })
            }
            return res.status(200).send({
                status: 'SUCCESS',
                articles
            })
        });
    },
    getArticle: (req, res) => {
        // Obtener id de la URL
        var id = req.params.id;
        
        if (!id || id == null || id == undefined) {
            return res.status(450004).send({
                status: 'BAD REQUEST',
                message: 'Error: Solicitud errónea'
            })
        }
        // Buscar el artículo
        Article.findById(id, (error, article) => {
            if (error || !article) {
                return res.status(404).send({
                    status: 'BAD REQUEST',
                    message: 'Error: No se encontró el artículo ' + id
                })
            }
            // Devolver el json
            return res.status(200).send({
                status: 'SUCCESS',
                article
            })
        });
    },
    deleteArticle: (req, res) => {
        // Obtener id de la URL
        var id = req.params.id;
        
        if (!id || id == null || id == undefined) {
            return res.status(500).send({
                status: 'BAD REQUEST',
                message: 'Error: Solicitud errónea'
            })
        }
        // Buscar el artículo
        Article.findByIdAndDelete({_id: id}, (error, article) => {
            if (error) {
                return res.status(500).send({
                    status: 'BAD REQUEST',
                    message: 'Error: Error al borrar el artículo ' + id
                })
            }
            if (!article) {
                return res.status(404).send({
                    status: 'BAD REQUEST',
                    message: 'Error: No se encontró el artículo ' + id
                })
            }
            // Devolver el json
            return res.status(200).send({
                status: 'SUCCESS',
                article
            })
        });
    },
    searchArticle: (req, res) => {
        // Obtener string
        var searchString = req.params.search;
        Article.find({'$or': [
            {'title': {'$regex': searchString, '$options': 'i'}},
            {'content': {'$regex': searchString, '$options': 'i'}}
        ]}).sort([['date', 'descending']]).exec((error, articles) => {
            if (error) {
                return res.status(500).send({
                    status: 'INTERNAL SERVER ERROR',
                    message: 'Error interno'
                });
            }
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'NOT FOUND',
                    message: 'No se obtuvieron resultados'
                })
            }
            return res.status(200).send({
                status: 'SUCCESS',
                articles
            })
        })
    },
    upload: (req, res) => {
        // Configurar el modulo multiparty router/Article.js (hecho)
        var fileName = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'Error',
                message: 'No se han enviado archivos'
            });
        }

        // Recoger el fichero de la petición
        var filePath = req.files.file0.path;

        // Conseguir nombre y la extensión del archivo
        // EN LINUX O MAC filePath.split('/'); 
        var fileSplit = filePath.split('\\');

        var fileName = fileSplit[fileSplit.length-1];

        var extensionSplit = fileName.split('\.');
        var fileExtension = extensionSplit[1].toLowerCase();

        // Comprobar la extensión, sólo imágenes, si es inválido se borra el archivo
        if ((fileExtension != 'png') && (fileExtension != 'jpg') && (fileExtension != 'jpeg') && (fileExtension != 'gif')) {
            // Borrar el archivo
            fs.unlink(filePath, (error) => {
                return res.status(500).send({
                    status: 'INTERNAL SERVER ERROR',
                    message: 'Error: La extension de la imagen no es válida '
                })
            })
        } else {
            // Obteniendo id de la URL
            var id = req.params.id;
            // Si todo es valido se busa el artículo y se asigna el nombre de la imagen
            Article.findByIdAndUpdate({_id: id}, {image: fileName}, {new: true}, (error, article) => {
                if (error || !article) {
                    return res.status(400).send({
                        status: 'BAD REQUEST',
                        message: 'Error: ' + error,
                        article,
                    });
                }
                return res.status(200).send({
                    status: 'SUCCESS',
                    fichero: article
                });
            });
        }
    },
    getImage: (req, res) => {
        var file = req.params.image;
        var pathFile = './src/upload/articles/' + file;
        fs.exists(pathFile, (exists => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    status: "NOT FOUND",
                    message: "Archivo no encontrado: " + file
                })
            }
        }));
    }
};

module.exports = controller;