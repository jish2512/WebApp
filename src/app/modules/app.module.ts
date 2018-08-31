import { NgModule, SystemJsNgModuleLoader, NgModuleFactoryLoader } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Resiliency } from './../services/FxpServices';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    FxpConfigurationServiceProvider,
    AdalLoginHelperServiceProvider,
    DashboardServiceProvider,
    FxpMessageServiceProvider,
    HelpCentralServiceProvider,
    OBOUserServiceProvider,
    pageTourEventServiceProvider,
    SystemMessagesServiceProvider,
    UserInfoServiceProvider,
    UserProfileServiceProvider,
    FxpBreadcrumbServiceProvider,
    AdminLandingServiceProvider,
    DataServiceProvider,
    NotificationActionCenterProvider,
    FxpStorageServiceProvider,
    PersonalizationServiceProvider,
    FxpFeedbackServiceProvider,
    FxpRouteServiceProvider,
    FxpToastNotificationServiceProvider,
    NotificationStoreProvider,
    PageLoaderServiceProvider,
    PlannedDownTimeServiceProvider,
    TimeZoneHelperProvider,
    FxpAuthorizationServiceProvider,
    NotificationServiceProvider,
    FxpEventBroadCastServiceProvider,
    FxpHttpServiceProvider,
    FxpLoggerServiceProvider,
    FxpFeatureFlagServiceProvider,
    FxpConfitServiceProvider,
    FxpStateTransitionServiceProvider
} from './../services/FxpServices';
import { AppComponent } from './../components/app-component/app.component';
import { UIRouterUpgradeModule, NgHybridStateDeclaration } from '@uirouter/angular-hybrid';
import { UIViewNgUpgrade } from '@uirouter/angular-hybrid';
import {
    FxpComponentRegistrationService
} from './../services/FxpServices';
import { PartnerAppRegistrationService } from '../../js/services/PartnerAppRegistrationService';

function getRegisteredAngular2Modules(): Array<any> {
    let registeredApps = PartnerAppRegistrationService.getRegisteredPartnerApps();
    let registeredAngular2Modules: Array<any> = [];
    if (registeredApps) {
        Object.keys(registeredApps).forEach((key) => {
            var appInstance = new registeredApps[key]();
            var modules = appInstance.getAngular2Modules();
            if (modules) {
                for (let i = 0; i < modules.length; i++) {
                    if (!registeredAngular2Modules.includes(modules[i])) {
                        registeredAngular2Modules.push(modules[i]);
                    }
                }
            }
        });
    }
    return registeredAngular2Modules;
}

const partnerModules: Array<any> = getRegisteredAngular2Modules();

let importModules = [
    BrowserModule,
    FormsModule,
    UpgradeModule,
    HttpClientModule,
    UIRouterUpgradeModule,
    NgbModule.forRoot()
];

importModules = importModules.concat(partnerModules);

const fxpServices = [
    HttpClientModule,
    FxpConfigurationServiceProvider,
    AdalLoginHelperServiceProvider,
    AdminLandingServiceProvider,
    DashboardServiceProvider,
    DataServiceProvider,
    FxpAuthorizationServiceProvider,
    FxpBreadcrumbServiceProvider,
    FxpFeedbackServiceProvider,
    FxpMessageServiceProvider,
    FxpRouteServiceProvider,
    FxpStorageServiceProvider,
    FxpToastNotificationServiceProvider,
    HelpCentralServiceProvider,
    NotificationActionCenterProvider,
    NotificationServiceProvider,
    NotificationStoreProvider,
    OBOUserServiceProvider,
    PageLoaderServiceProvider,
    pageTourEventServiceProvider,
    PersonalizationServiceProvider,
    PlannedDownTimeServiceProvider,
    SystemMessagesServiceProvider,
    TimeZoneHelperProvider,
    UserInfoServiceProvider,
    UserProfileServiceProvider,
    FxpEventBroadCastServiceProvider,
    FxpHttpServiceProvider,
    FxpLoggerServiceProvider,
    FxpFeatureFlagServiceProvider,
    FxpConfitServiceProvider,
    FxpStateTransitionServiceProvider
];

@NgModule({
    imports: importModules,
    declarations: [AppComponent],
    providers: fxpServices,
    bootstrap: [
        AppComponent
    ],
    entryComponents: [],
    exports: []
})
export class AppModule {

}




