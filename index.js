'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 8000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conexión a la BD exitosa');
    
    // Crear servidor para escuchar peticiones HTTP
    app.listen(port, () => {
        console.log('Servidor corriento en http://localhost:'+port);
    })
});