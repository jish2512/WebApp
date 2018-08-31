import { UserProfilePanelItem } from "../common/UserProfilePanelItem";
import { ILogger } from "../interfaces/ILogger";
import { IRootScope } from "../interfaces/IRootScope";
import { UserInfo } from "../common/UserInfo";
   /**
   * UserProfilePanelService provides capability to add additional Info to mini user profile layout
   * @class Fxp.Services.UserProfilePanelService
   * @classdesc Provides capability to add additional Info to mini user profile layout
   * @example <caption> Example to create an instance of UserProfilePanelService</caption>
   */

  
    export class UserProfilePanelService {
        private $rootScope: IRootScope;
        private fxplogger: ILogger;
        private userProfilePanelServiceClassName = "Fxp.UserProfilePanelService"; 
        constructor($rootScope: IRootScope, fxpLogger: ILogger) {
            this.fxplogger = fxpLogger;
            this.$rootScope = $rootScope;
        }

        private setUserProfilePanelData(data: Array<UserProfilePanelItem>) {
            var self = this;
            var profile = self.$rootScope.userProfile || {};
            profile.additionalInfo = {};

            for (let index = 0; index < data.length; index++) {
                var item: UserProfilePanelItem = data[index];
                if (profile[item.Key])
                    profile[item.Key] = item.Value;
                else
                    profile.additionalInfo[item.Key] = item.Value;
            }

            this.$rootScope.userProfile = profile;
        }
        /**
        * Update additionalInfo to mini user profile
        * @method Fxp.Services.UserProfilePanelService
        * @param {data } data the array of additional Info type of UserProfilePanelItem.
        * @example <caption> Example to invoke setUserProfilePanelService</caption>
        *  UserProfilePanelService.setUserProfilePanelService(data);
        */
        setUserProfilePanelService(data: Array<UserProfilePanelItem>): void {
            var self = this;
            var userInfo = new UserInfo();
            self.fxplogger.logInformation(self.userProfilePanelServiceClassName, "setUserProfilePanelService started");

            this.setUserProfilePanelData(data);
            self.fxplogger.logInformation(self.userProfilePanelServiceClassName, "setUserProfilePanelService end");
        }

    }

 