import { Resiliency } from "../resiliency/FxpResiliency";
declare var define: any; 

define(['angularAMD'], function (angularAMD) {
    'use strict';
    var app = angular.module("FxPApp");
    app.requires = Resiliency.getResilientModules(app.requires);
    return angularAMD.bootstrap(app);
});