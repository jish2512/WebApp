import { IStateConfig } from "../interfaces/IStateConfig";
import { IAppService } from "../interfaces/IAppService";
import { GlobalExceptionHandler } from "../telemetry/GlobalExceptionHandler";
import { IFxpAppContext } from "../interfaces/IFxpAppContext";

export class PartnerAppRegistrationService {
    private static _registeredApps: any = {};

    public static registerPartnerApp(appName: string, appInstance): void {
        if (!this._registeredApps[appName]) {
            this._registeredApps[appName] = appInstance;
            let properties = {
                PartnerAppName: appName
            }
            GlobalExceptionHandler.logEvent('RegisterPartnerApp', 'PartnerAppRegistrationService', properties, false);
        }
        else {
            var error = new Error();
            error.message = 'Application name with ' + appName + ' is already registered.';
            console.error(error.message);
            GlobalExceptionHandler.logError(error, { Details: error.message }, "PartnerAppRegistrationService")
        }
    }

    public static getRegisteredPartnerApps(): any {
        return this._registeredApps;
    }
}