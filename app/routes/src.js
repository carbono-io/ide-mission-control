module.exports = function (app) {

    var src = app.controllers.src;

    app.get('/', src.root);
    
    app.get('/src', src.clean);
    
    app.get('/src/marked', src.marked);
    
    app.get('/gui', src.gui);
    
    app.get('/cli', src.cli);
    
    return this;    
};