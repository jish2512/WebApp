// import './polyfill';
// import 'reflect-metadata';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import {MyProfileModule} from './app/myprofile.module';

import { UpgradeModule } from '@angular/upgrade/static';
import { Resiliency, FxpComponentRegistrationService } from './../src/app/services/FxpServices';
//import { DumbComponent } from './app/components/dumb-component/dumb.component';
import { downgradeComponent } from '@angular/upgrade/static';
import { UrlService } from '@uirouter/core';
import '@uirouter/angularjs/release/stateEvents';
import * as uiRouterHybrid from '@uirouter/angular-hybrid';
// FxpComponentRegistrationService.registerAngular2Module(MyProfileModule);

import { AppModule } from './../src/app/modules/app.module';
import { IStateConfig } from './js/interfaces/IStateConfig';
declare var angular: any;

const fxpModule = angular.module('FxPApp');
fxpModule.config(['$urlServiceProvider', ($urlService: UrlService) => $urlService.deferIntercept()]);

const dependentModules = Resiliency.getResilientModules(fxpModule.requires);
// TODO: This needs to go to configuration.
dependentModules.push('ui.router.upgrade');
dependentModules.push('ui.router.state.events');

// TODO: All the routes coming from FXP Angular2 application needs to go to configuration.
// const dumbRoute: IStateConfig = {
//     name: 'dumb',
//     url: '/dumb',
//     component: DumbComponent,    
//     data: {
//         headerName: 'Dumb',
//         breadcrumbText: 'Dumb',
//         pageTitle: 'Dumb',
//         style: 'icon icon-people'
//     }   
//   };

// FxpComponentRegistrationService.registerRoute(dumbRoute);

fxpModule.requires = dependentModules;

try {
    platformBrowserDynamic().bootstrapModule(AppModule).then(platformReference => {
    const upgradeModule = platformReference.injector.get(UpgradeModule) as UpgradeModule;
    upgradeModule.bootstrap(document.documentElement, ['FxPApp']);
    const url: UrlService = platformReference.injector.get(UrlService);
    console.log('bootstrapped hybrid application.');
    url.listen();
    url.sync();
    });
} catch (e) {
    // TODO: Log to applicationInsights
    console.log('An error occured while bootstrapping application');
    console.log(e);
}

