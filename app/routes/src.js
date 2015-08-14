module.exports = function (app) {

    var src = app.controllers.src;

    app.get('/', src.root);
    
    app.use('/src', src.clean);
    
    app.use('/marked', src.marked);
    
    app.get('/gui', src.gui);
    
    app.get('/cli', src.cli);
    
    return this;    
};