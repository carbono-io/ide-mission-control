# IDE Mission control module
Description
===========
Serves as an orchestrator and gateway between the app many user interfaces and the development container.
See Archtecture Specs for more details on MissionControl.

Installation and Running
============
`npm install`
`gulp server`

Interfaces
==========

* domNodeAdd()
* domNodeRm()
* domAttEdit()

* createContainer()
* fetchContainer()

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