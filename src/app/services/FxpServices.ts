export const Fxp: any = window['Fxp'];
let fxpComponentRegistrationService = null;
let partnerAppRegistrationService = null;
let resiliency = null;

if (Fxp) {
    fxpComponentRegistrationService = Fxp.Services.FxpComponentRegistrationService;
    partnerAppRegistrationService = Fxp.Services.PartnerAppRegistrationService;
    resiliency = Fxp.Resiliency;
}
export const FxpComponentRegistrationService = fxpComponentRegistrationService;
export const PartnerAppRegistrationService = partnerAppRegistrationService;
export const Resiliency = resiliency;

// Inject FxpConfigurationService to be used by Angular Component inside Fxp

export function FxpConfigurationServiceFactory(i: any) {
   return i.get('FxpConfigurationService');
}

export let FxpConfigurationServiceProvider = {
    provide: Fxp.Services.FxpConfigurationService,
    useFactory: FxpConfigurationServiceFactory,
    deps: ['$injector']
};

export function FxpEventBroadCastServiceFactory(i:any){
    return i.get('FxpEventBroadCastService');
}
export let FxpEventBroadCastServiceProvider={
    provide: Fxp.Services.FxpEventBroadCastService,
    useFactory: FxpEventBroadCastServiceFactory,
    deps: ['$injector']
}

export function FxpStateTransitionServiceFactory(i:any){
    return i.get('FxpStateTransitionService');
}
export let FxpStateTransitionServiceProvider={
    provide: Fxp.Services.FxpStateTransitionService,
    useFactory: FxpStateTransitionServiceFactory,
    deps: ['$injector']
}

export function FxpHttptServiceFactory(i:any){
    return i.get('FxpHttpService');
}
export let FxpHttpServiceProvider={
    provide: Fxp.Services.FxpHttpService,
    useFactory: FxpHttptServiceFactory,
    deps: ['$injector']
}
// Inject AdalLoginHelperService to be used by Angular Component inside Fxp

export function AdalLoginHelperServiceFactory(i: any) {
    return i.get('AdalLoginHelperService');
}

export let AdalLoginHelperServiceProvider = {
    provide: Fxp.Utils.Services.AdalLoginHelperService,
    useFactory: AdalLoginHelperServiceFactory,
    deps: ['$injector']
};

     // Inject AdminLandingService to be used by Angular Component inside Fxp

export function AdminLandingServiceFactory(i: any) {
    return i.get('AdminLandingService');
}

export let AdminLandingServiceProvider = {
    provide: Fxp.Services.AdminLandingService,
    useFactory: AdminLandingServiceFactory,
    deps: ['$injector']
};

// Inject DashboardService to be used by Angular Component inside Fxp

export function DashboardServiceFactory(i: any) {
    return i.get('DashboardService');
}

export let DashboardServiceProvider = {
    provide: Fxp.Services.DashboardService,
    useFactory: DashboardServiceFactory,
    deps: ['$injector']
};

// Inject DataService to be used by Angular Component inside Fxp

export function DataServiceFactory(i: any) {
    return i.get('DataService');
}

export let DataServiceProvider = {
    provide: Fxp.Utils.Services.DataService,
    useFactory: DataServiceFactory,
    deps: ['$injector']
};

// Inject FxpAuthorizationService to be used by Angular Component inside Fxp

export function FxpAuthorizationServiceFactory(i: any) {
    return i.get('FxpAuthorizationService');
}

export let FxpAuthorizationServiceProvider = {
    provide: Fxp.Services.FxpAuthorizationService,
    useFactory: FxpAuthorizationServiceFactory,
    deps: ['$injector']
};

// Inject FxpBreadcrumbService to be used by Angular Component inside Fxp

export function FxpBreadcrumbServiceFactory(i: any) {
    return i.get('FxpBreadcrumbService');
}

export let FxpBreadcrumbServiceProvider = {
    provide: Fxp.Services.FxpBreadcrumbService,
    useFactory: FxpBreadcrumbServiceFactory,
    deps: ['$injector']
};

// Inject FxpFeedbackService to be used by Angular Component inside Fxp

export function FxpFeedbackServiceFactory(i: any) {
    return i.get('FxpFeedbackService');
}

export let FxpFeedbackServiceProvider = {
    provide: Fxp.Services.FxpFeedbackService,
    useFactory: FxpFeedbackServiceFactory,
    deps: ['$injector']
};

// Inject FxpMessageService to be used by Angular Component inside Fxp

export function FxpMessageServiceFactory(i: any) {
    return i.get('FxpMessageService');
}

export let FxpMessageServiceProvider = {
    provide: Fxp.Services.FxpMessageService,
    useFactory: FxpMessageServiceFactory,
    deps: ['$injector']
};

// Inject FxpRouteService to be used by Angular Component inside Fxp

export function FxpRouteServiceFactory(i: any) {
    return i.get('FxpRouteService');
}

export let FxpRouteServiceProvider = {
    provide: Fxp.Services.FxpRouteService,
    useFactory: FxpRouteServiceFactory,
    deps: ['$injector']
};

// Inject FxpStorageService to be used by Angular Component inside Fxp

export function FxpStorageServiceFactory(i: any) {
    return i.get('FxpStorageService');
}

export let FxpStorageServiceProvider = {
    provide: Fxp.Services.FxpStorageService,
    useFactory: FxpStorageServiceFactory,
    deps: ['$injector']
};

// Inject FxpConfigurationService to be used by Angular Component inside Fxp

export function FxpToastNotificationServiceFactory(i: any) {
    return i.get('FxpToastNotificationService');
}

export let FxpToastNotificationServiceProvider = {
    provide: Fxp.Services.FxpToastNotificationService,
    useFactory: FxpToastNotificationServiceFactory,
    deps: ['$injector']
};

// Inject HelpCentralService to be used by Angular Component inside Fxp

export function HelpCentralServiceFactory(i: any) {
    return i.get('HelpCentralService');
}

export let HelpCentralServiceProvider = {
    provide: Fxp.Services.HelpCentralService,
    useFactory: HelpCentralServiceFactory,
    deps: ['$injector']
};

// Inject NotificationActionCenter to be used by Angular Component inside Fxp

export function NotificationActionCenterFactory(i: any) {
    return i.get('NotificationActionCenter');
}

export let NotificationActionCenterProvider = {
    provide: Fxp.Services.NotificationActionCenter,
    useFactory: NotificationActionCenterFactory,
    deps: ['$injector']
};

// Inject NotificationService to be used by Angular Component inside Fxp

export function NotificationServiceFactory(i: any) {
   return i.get('NotificationService');
}

export let NotificationServiceProvider = {
    provide: Fxp.Services.NotificationService,
    useFactory: NotificationServiceFactory,
    deps: ['$injector']
};


// Inject NotificationStore to be used by Angular Component inside Fxp

export function NotificationStoreFactory(i: any) {
    return i.get('NotificationStore');
}

export let NotificationStoreProvider = {
    provide: Fxp.Services.NotificationStore,
    useFactory: NotificationStoreFactory,
    deps: ['$injector']
};

// Inject OBOUserService to be used by Angular Component inside Fxp

export function OBOUserServiceFactory(i: any) {
    return i.get('OBOUserService');
}

export let OBOUserServiceProvider = {
    provide: Fxp.Services.OBOUserService,
    useFactory: OBOUserServiceFactory,
    deps: ['$injector']
};

// Inject PageLoaderService to be used by Angular Component inside Fxp

export function PageLoaderServiceFactory(i: any) {
    return i.get('PageLoaderService');
}

export let PageLoaderServiceProvider = {
    provide: Fxp.Services.PageLoaderService,
    useFactory: PageLoaderServiceFactory,
    deps: ['$injector']
};

// Inject pageTourEventService to be used by Angular Component inside Fxp

export function pageTourEventServiceFactory(i: any) {
    return i.get('pageTourEventService');
}

export let pageTourEventServiceProvider = {
    provide: Fxp.Services.pageTourEventService,
    useFactory: pageTourEventServiceFactory,
    deps: ['$injector']
};

// Inject PersonalizationService to be used by Angular Component inside Fxp

export function PersonalizationServiceFactory(i: any) {
    return i.get('PersonalizationService');
}

export let PersonalizationServiceProvider = {
    provide: Fxp.Services.PersonalizationService,
    useFactory: PersonalizationServiceFactory,
    deps: ['$injector']
};

// Inject PlannedDownTimeService to be used by Angular Component inside Fxp

export function PlannedDownTimeServiceFactory(i: any) {
    return i.get('PlannedDownTimeService');
}

export let PlannedDownTimeServiceProvider = {
    provide: Fxp.Services.PlannedDownTimeService,
    useFactory: PlannedDownTimeServiceFactory,
    deps: ['$injector']
};

// Inject SystemMessagesService to be used by Angular Component inside Fxp

export function SystemMessagesServiceFactory(i: any) {
    return i.get('SystemMessagesService');
}

export let SystemMessagesServiceProvider = {
    provide: Fxp.Services.SystemMessagesService,
    useFactory: SystemMessagesServiceFactory,
    deps: ['$injector']
};

// Inject FxpConfigurationService to be used by Angular Component inside Fxp

export function TimeZoneHelperFactory(i: any) {
    return i.get('TimeZoneHelper');
}

export let TimeZoneHelperProvider = {
    provide: Fxp.Services.TimeZoneHelper,
    useFactory: TimeZoneHelperFactory,
    deps: ['$injector']
};

// Inject UserInfoService to be used by Angular Component inside Fxp

export function UserInfoServiceFactory(i: any) {
    return i.get('UserInfoService');
}

export let UserInfoServiceProvider = {
    provide: Fxp.Services.UserInfoService,
    useFactory: UserInfoServiceFactory,
    deps: ['$injector']
};


// Inject UserProfileService to be used by Angular Component inside Fxp

export function UserProfileServiceFactory(i: any) {
    return i.get('UserProfileService');
}

export let UserProfileServiceProvider = {
    provide: Fxp.Services.UserProfileService,
    useFactory: UserProfileServiceFactory,
    deps: ['$injector']
};

export function FxpLoggerServiceFactory(i: any) {
    return i.get('FxpLoggerService');
}

export let FxpLoggerServiceProvider = {
    provide: Fxp.Telemetry.FxpLoggerService,
    useFactory: FxpLoggerServiceFactory,
    deps: ['$injector']
};


export function FxpConfitServiceFactory(i: any) {
    return i.get('ConFitService');
}

export let FxpConfitServiceProvider = {
    provide: Fxp.Services.ConFitService,
    useFactory: FxpConfitServiceFactory,
    deps: ['$injector']
};


export function FxpFeatureFlagServiceFactory(i: any) {
    return i.get('FeatureFlagService');
}

export let FxpFeatureFlagServiceProvider = {
    provide: Fxp.Services.FeatureFlagService,
    useFactory: FxpFeatureFlagServiceFactory,
    deps: ['$injector']
};


