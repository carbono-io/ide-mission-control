# IDE Mission control module
Description
===========
Serves as an orchestrator and gateway between the app many user interfaces and the development container.
See Archtecture Specs for more details on MissionControl.

Installation and Running
============
```npm install```
```gulp serve```

Tests and Dev
=============
```gulp nodemon```
```gulp test```

Interfaces
==========

## File
* create()
* delete()
* list()
* apNode()
* rmNode()
* edNodeAtt()

## Project
* list()
* create()
* fetch()

## PaaS
* deploy()

Access Points
=============

* src/
 Source code.
* src/marked/
 Marked source code.
* gui/
 Graphical user interface.
* editor/
 Text editor.
* cli/
 Command line interface.