/**
 * @TODO Get cm from user context
 */
module.exports = function (app) {

    this.root = function (req, res) {
        res.send('You are doing it wrong! Try http://carbono.io/');
    };
    
    this.clean = function (req, res) {
        if(!app.cm) return;
        app.cm.clean(req, res);
    };
    
    this.marked = function (req, res) {
        if(!app.cm) return;
        app.cm.marked(req, res);
    };
        
    this.gui = function (req, res) {
        res.send('Graphical user interface.');
    };
    
    this.cli = function (req, res) {
        res.send('Command line interface.');
    };
    
    return this;    
};