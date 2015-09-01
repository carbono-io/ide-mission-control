'use strict';
module.exports = function (app) {
    
    var resources = app.controllers.resources;
    
    var path = '/project/:projectId/resources';
    
    app.get('/', resources.root);
    
    app.get(path + '/marked/[^**/]*', resources.marked);
    
    app.get(path + '/clean/[^**/]*', resources.clean);

    app.get(path + '/gui', resources.gui);
    
    app.get(path + '/cli', resources.cli);


    return this;
};
