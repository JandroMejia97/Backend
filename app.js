'use strict'

// Carga de módulos de Node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutando Express para trabajar con HTTP
var app = express();

// Cargar ficheros (rutas)
var articleRoutes = require('./routes/Article');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Añadiendo prefijos a las rutas
app.use('/api/', articleRoutes);

// Exportando el módulo (fichero actual)
module.exports = app;