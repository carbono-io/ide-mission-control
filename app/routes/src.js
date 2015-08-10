module.exports = function (app) {

    app.get('/', function(req, res) {
        res.send('You are doing it wrong! Try http://carbono.io/');
    });
    
    app.get('/src', function(req, res) {
        res.send('Source code.');
    });
    
    app.get('/src/marked', function(req, res) {
        res.send('Marked source code.');
    });
    
    app.get('/gui', function(req, res) {
        res.send('Graphical user interface.');
    });
    
    app.get('/cli', function(req, res) {
        res.send('Command line interface.');
    });
    
    return this;    
}
