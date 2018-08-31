!function (n) { "use strict"; n.module("ng.deviceDetector", ["reTree"]).constant("BROWSERS", { CHROME: "chrome", FIREFOX: "firefox", SAFARI: "safari", OPERA: "opera", IE: "ie", MS_EDGE: "ms-edge", FB_MESSANGER: "fb-messanger", UNKNOWN: "unknown" }).constant("DEVICES", { ANDROID: "android", I_PAD: "ipad", IPHONE: "iphone", I_POD: "ipod", BLACKBERRY: "blackberry", FIREFOX_OS: "firefox-os", CHROME_BOOK: "chrome-book", WINDOWS_PHONE: "windows-phone", PS4: "ps4", VITA: "vita", CHROMECAST: "chromecast", APPLE_TV: "apple-tv", GOOGLE_TV: "google-tv", UNKNOWN: "unknown" }).constant("OS", { WINDOWS: "windows", MAC: "mac", IOS: "ios", ANDROID: "android", LINUX: "linux", UNIX: "unix", FIREFOX_OS: "firefox-os", CHROME_OS: "chrome-os", WINDOWS_PHONE: "windows-phone", UNKNOWN: "unknown" }).constant("OS_VERSIONS", { WINDOWS_3_11: "windows-3-11", WINDOWS_95: "windows-95", WINDOWS_ME: "windows-me", WINDOWS_98: "windows-98", WINDOWS_CE: "windows-ce", WINDOWS_2000: "windows-2000", WINDOWS_XP: "windows-xp", WINDOWS_SERVER_2003: "windows-server-2003", WINDOWS_VISTA: "windows-vista", WINDOWS_7: "windows-7", WINDOWS_8_1: "windows-8-1", WINDOWS_8: "windows-8", WINDOWS_10: "windows-10", WINDOWS_PHONE_7_5: "windows-phone-7-5", WINDOWS_PHONE_8_1: "windows-phone-8-1", WINDOWS_PHONE_10: "windows-phone-10", WINDOWS_NT_4_0: "windows-nt-4-0", UNKNOWN: "unknown" }).service("detectUtils", ["deviceDetector", "DEVICES", "BROWSERS", "OS", function (n, o, e, r) { var i = n; this.isMobile = function () { return "unknown" !== i.device }, this.isAndroid = function () { return i.device === o.ANDROID || i.OS === r.ANDROID }, this.isIOS = function () { return i.os === r.IOS || i.device === o.I_POD || i.device === o.IPHONE } }]).factory("deviceDetector", ["$window", "DEVICES", "BROWSERS", "OS", "OS_VERSIONS", "reTree", function (n, o, e, r, i, O) { Object.keys || (Object.keys = function () { var n = Object.prototype.hasOwnProperty, o = !{ toString: null }.propertyIsEnumerable("toString"), e = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], r = e.length; return function (i) { if ("object" != typeof i && ("function" != typeof i || null === i)) throw new TypeError("Object.keys called on non-object"); var O, W, t = []; for (O in i) n.call(i, O) && t.push(O); if (o) for (W = 0; r > W; W++) n.call(i, e[W]) && t.push(e[W]); return t } }()), Array.prototype.reduce || (Array.prototype.reduce = function (n) { if (null == this) throw new TypeError("Array.prototype.reduce called on null or undefined"); if ("function" != typeof n) throw new TypeError(n + " is not a function"); var o, e = Object(this), r = e.length >>> 0, i = 0; if (2 == arguments.length) o = arguments[1]; else { for (; r > i && !(i in e) ;) i++; if (i >= r) throw new TypeError("Reduce of empty array with no initial value"); o = e[i++] } for (; r > i; i++) i in e && (o = n(o, e[i], i, e)); return o }); var W = { WINDOWS: { and: [{ or: [/\bWindows|(Win\d\d)\b/, /\bWin 9x\b/] }, { not: /\bWindows Phone\b/ }] }, MAC: { and: [/\bMac OS\b/, { not: /Windows Phone/ }] }, IOS: { and: [{ or: [/\biPad\b/, /\biPhone\b/, /\biPod\b/] }, { not: /Windows Phone/ }] }, ANDROID: { and: [/\bAndroid\b/, { not: /Windows Phone/ }] }, LINUX: /\bLinux\b/, UNIX: /\bUNIX\b/, FIREFOX_OS: { and: [/\bFirefox\b/, /Mobile\b/] }, CHROME_OS: /\bCrOS\b/, WINDOWS_PHONE: { or: [/\bIEMobile\b/, /\bWindows Phone\b/] }, PS4: /\bMozilla\/5.0 \(PlayStation 4\b/, VITA: /\bMozilla\/5.0 \(Play(S|s)tation Vita\b/ }, t = { CHROME: { and: [{ or: [/\bChrome\b/, /\bCriOS\b/] }, { not: { or: [/\bOPR\b/, /\bEdge\b/] } }] }, FIREFOX: /\bFirefox\b/, SAFARI: { and: [/^((?!CriOS).)*\Safari\b.*$/, { not: { or: [/\bOPR\b/, /\bEdge\b/, /Windows Phone/] } }] }, OPERA: { or: [/Opera\b/, /\bOPR\b/] }, IE: { or: [/\bMSIE\b/, /\bTrident\b/, /^Mozilla\/5\.0 \(Windows NT 10\.0; Win64; x64\)$/] }, MS_EDGE: { or: [/\bEdge\b/] }, PS4: /\bMozilla\/5.0 \(PlayStation 4\b/, VITA: /\bMozilla\/5.0 \(Play(S|s)tation Vita\b/, FB_MESSANGER: /\bFBAN\/MessengerForiOS\b/ }, N = { ANDROID: { and: [/\bAndroid\b/, { not: /Windows Phone/ }] }, I_PAD: /\biPad\b/, IPHONE: { and: [/\biPhone\b/, { not: /Windows Phone/ }] }, I_POD: /\biPod\b/, BLACKBERRY: /\bblackberry\b/, FIREFOX_OS: { and: [/\bFirefox\b/, /\bMobile\b/] }, CHROME_BOOK: /\bCrOS\b/, WINDOWS_PHONE: { or: [/\bIEMobile\b/, /\bWindows Phone\b/] }, PS4: /\bMozilla\/5.0 \(PlayStation 4\b/, CHROMECAST: /\bCrKey\b/, APPLE_TV: /^iTunes-AppleTV\/4.1$/, GOOGLE_TV: /\bGoogleTV\b/, VITA: /\bMozilla\/5.0 \(Play(S|s)tation Vita\b/ }, s = { WINDOWS_3_11: /Win16/, WINDOWS_95: /(Windows 95|Win95|Windows_95)/, WINDOWS_ME: /(Win 9x 4.90|Windows ME)/, WINDOWS_98: /(Windows 98|Win98)/, WINDOWS_CE: /Windows CE/, WINDOWS_2000: /(Windows NT 5.0|Windows 2000)/, WINDOWS_XP: /(Windows NT 5.1|Windows XP)/, WINDOWS_SERVER_2003: /Windows NT 5.2/, WINDOWS_VISTA: /Windows NT 6.0/, WINDOWS_7: /(Windows 7|Windows NT 6.1)/, WINDOWS_8_1: /(Windows 8.1|Windows NT 6.3)/, WINDOWS_8: /(Windows 8|Windows NT 6.2)/, WINDOWS_10: /(Windows NT 10.0)/, WINDOWS_PHONE_7_5: /(Windows Phone OS 7.5)/, WINDOWS_PHONE_8_1: /(Windows Phone 8.1)/, WINDOWS_PHONE_10: /(Windows Phone 10)/, WINDOWS_NT_4_0: { and: [/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/, { not: /Windows NT 10.0/ }] } }, b = { CHROME: [/\bChrome\/([\d\.]+)\b/, /\bCriOS\/([\d\.]+)\b/], FIREFOX: /\bFirefox\/([\d\.]+)\b/, SAFARI: /\bVersion\/([\d\.]+)\b/, OPERA: [/\bVersion\/([\d\.]+)\b/, /\bOPR\/([\d\.]+)\b/], IE: [/\bMSIE ([\d\.]+\w?)\b/, /\brv:([\d\.]+\w?)\b/], MS_EDGE: /\bEdge\/([\d\.]+)\b/ }, S = Object.keys(b).reduce(function (n, o) { return n[e[o]] = b[o], n }, {}), d = n.navigator.userAgent, I = { raw: { userAgent: d, os: {}, browser: {}, device: {} } }; if (I.raw.os = Object.keys(r).reduce(function (n, o) { return n[r[o]] = O.test(d, W[o]), n }, {}), I.raw.browser = Object.keys(e).reduce(function (n, o) { return n[e[o]] = O.test(d, t[o]), n }, {}), I.raw.device = Object.keys(o).reduce(function (n, e) { return n[o[e]] = O.test(d, N[e]), n }, {}), I.raw.os_version = Object.keys(i).reduce(function (n, o) { return n[i[o]] = O.test(d, s[o]), n }, {}), I.os = [r.WINDOWS, r.IOS, r.MAC, r.ANDROID, r.LINUX, r.UNIX, r.FIREFOX_OS, r.CHROME_OS, r.WINDOWS_PHONE].reduce(function (n, o) { return n === r.UNKNOWN && I.raw.os[o] ? o : n }, r.UNKNOWN), I.browser = [e.CHROME, e.FIREFOX, e.SAFARI, e.OPERA, e.IE, e.MS_EDGE, e.FB_MESSANGER].reduce(function (n, o) { return n === e.UNKNOWN && I.raw.browser[o] ? o : n }, e.UNKNOWN), I.device = [o.ANDROID, o.I_PAD, o.IPHONE, o.I_POD, o.BLACKBERRY, o.FIREFOX_OS, o.CHROME_BOOK, o.WINDOWS_PHONE, o.PS4, o.CHROMECAST, o.APPLE_TV, o.GOOGLE_TV, o.VITA].reduce(function (n, e) { return n === o.UNKNOWN && I.raw.device[e] ? e : n }, o.UNKNOWN), I.os_version = [i.WINDOWS_3_11, i.WINDOWS_95, i.WINDOWS_ME, i.WINDOWS_98, i.WINDOWS_CE, i.WINDOWS_2000, i.WINDOWS_XP, i.WINDOWS_SERVER_2003, i.WINDOWS_VISTA, i.WINDOWS_7, i.WINDOWS_8_1, i.WINDOWS_8, i.WINDOWS_10, i.WINDOWS_PHONE_7_5, i.WINDOWS_PHONE_8_1, i.WINDOWS_PHONE_10, i.WINDOWS_NT_4_0].reduce(function (n, o) { return n === i.UNKNOWN && I.raw.os_version[o] ? o : n }, i.UNKNOWN), I.browser_version = "0", I.browser !== e.UNKNOWN) { var _ = S[I.browser], E = O.exec(d, _); E && (I.browser_version = E[1]) } return I.isMobile = function () { return [o.ANDROID, o.I_PAD, o.IPHONE, o.I_POD, o.BLACKBERRY, o.FIREFOX_OS, o.WINDOWS_PHONE, o.VITA].some(function (n) { return I.device == n }) }, I.isTablet = function () { return [o.I_PAD, o.FIREFOX_OS].some(function (n) { return I.device == n }) }, I.isDesktop = function () { return [o.PS4, o.CHROME_BOOK, o.UNKNOWN].some(function (n) { return I.device == n }) }, I }]).directive("deviceDetector", ["deviceDetector", function (n) { return { restrict: "A", link: function (o, e) { e.addClass("os-" + n.os), e.addClass("browser-" + n.browser), e.addClass("device-" + n.device) } } }]) }(angular);
!function (e, n, r) { "use strict"; function t(e, n) { return ("string" == typeof n || n instanceof String) && (n = new RegExp(n)), n instanceof RegExp ? n.test(e) : n && Array.isArray(n.and) ? n.and.every(function (n) { return t(e, n) }) : n && Array.isArray(n.or) ? n.or.some(function (n) { return t(e, n) }) : n && n.not ? !t(e, n.not) : !1 } function o(e, n) { return ("string" == typeof n || n instanceof String) && (n = new RegExp(n)), n instanceof RegExp ? n.exec(e) : n && Array.isArray(n) ? n.reduce(function (n, r) { return n ? n : o(e, r) }, null) : null } r && r.module("reTree", []).factory("reTree", [function () { return { test: t, exec: o } }]), n && (n.reTree = { test: t, exec: o }), e && (e.exports = { test: t, exec: o }) }("undefined" == typeof module ? null : module, "undefined" == typeof window ? null : window, "undefined" == typeof angular ? null : angular);
(function () {
    angular.module('Microsoft.PS.Feedback', ['ng.deviceDetector']).run(["$templateCache", function ($templateCache) {
        $templateCache.put('feedbackWidget.html', '<div class="btn-group pull-left feedback-control" uib-dropdown uib-keyboard-nav keyboard-nav is-open="feedbackCtrl.isOpen"> <button id="feedback-control" type="button" class="feedback-control-icon" title="Feedback" uib-dropdown-toggle ng-disabled="feedbackCtrl.isFeedbackFlyoutOpen"><i class="icon icon-smile"></i></button> <ul uib-dropdown-menu aria-labelledby="feedback-control" class="feedback-panel" role="navigation"> <li title="{{feedbackItem.DisplayText}}" class="user-apps-app photo-holder" ng-click="feedbackCtrl.selectedFeedbackItem(feedbackItem)" ng-repeat="feedbackItem in feedbackCtrl.feedbackItemCollection track by $index"><a href id="{{feedbackItem.Value}}Control" aria-label="{{feedbackItem.DisplayText}}"><span class="feedback-icon-container withBorder"><i class="{{feedbackItem.Icon}}"></i></span>{{feedbackItem.DisplayText}}</a></li></ul> <div class="feedback-modal"> <div class="feedback-content feedback-overlay-panel"> <h2 class="feedback-header">{{feedbackCtrl.feedbackHeader}}</h2> <div class="feedback-description">{{feedbackCtrl.feedbackDescription}}<div class="instruction">{{feedbackCtrl.feedbackInstruction}}</div><textarea required id="feedback-text" class="feedback-textarea" ng-attr-placeholder="{{feedbackCtrl.watermarkText}}" aria-label="{{feedbackCtrl.feedbackInstruction}}{{feedbackCtrl.watermarkText}}" ng-model="feedbackCtrl.feedbackText" maxlength="5000"></textarea> </div><div class="feedback-buttons"> <button class="feedback-button primary pull-right" id="submitBtn" type="button" aria-label="{{feedbackCtrl.sendFeedback}}" title="{{feedbackCtrl.sendFeedback}}" ng-click="feedbackCtrl.submitFeedback()" ng-disabled="!feedbackCtrl.feedbackText">{{feedbackCtrl.sendFeedback}}</button> <button class="feedback-button secondary" type="reset" id="cancelButton" aria-label="{{feedbackCtrl.cancel}}" ng-click="feedbackCtrl.cancelFeedback()" title="{{feedbackCtrl.cancel}}">{{feedbackCtrl.cancel}}</button> </div></div></div></div>');
    }]);
})();

var Feedback;
(function (Feedback) {
    var Services;
    (function (Services) {
        /**
        * A service keeping the generic methods used in the Feedback application and for multiple adal requests
        * @class Feedback.Services.FeedbackAdalHelperService
        * @classdesc A service used for generic methods in the Feedback application and adal simultaneous cors requests
        * @example <caption> Example to create an instance of FeedbackAdalHelperService</caption>
        * //Initializing FeedbackAdalHelperService
        *  angular.module('XXXXX').controller('XXXXController', ['FeedbackAdalHelperService']);
        *  function XXXController("xxxxxxx"){ FeedbackAdalHelperService.getJsonData(path, callbackfunc); }
        */
        var FeedbackAdalHelperService = (function () {
            function FeedbackAdalHelperService($q, adalAuthenticationService) {
                this.$q = $q;
                this.adal = new AuthenticationContext(adalAuthenticationService.config);
            }
            /**
            * Checks for whether the adal service request is in progress or not and returns boolean
            * @method Feedback.Services.FeedbackAdalHelperService.accessTokenRequestInProgress
            * @param {EndPoint} endpoint is the api endpoint for the resource or the api to which adal authorizes.
            * @example <caption> Example to invoke accessTokenRequestInProgress</caption>
            * FeedbackAdalHelperService.accessTokenRequestInProgress('http://oneprofiledevapi.azurewebsites.net');
            */
            FeedbackAdalHelperService.prototype.accessTokenRequestInProgress = function (endpoint) {
                var requestInProgress = false;
                var resource = this.adal.getResourceForEndpoint(endpoint);
                var keysString = this.adal._getItem(this.adal.CONSTANTS.STORAGE.TOKEN_KEYS) || '';
                if (keysString.length > 0 &&
                    (keysString === resource ||
                        keysString.indexOf(resource + this.adal.CONSTANTS.RESOURCE_DELIMETER) > -1)) {
                    var tokenStored = this.adal.getCachedToken(resource);
                    if (tokenStored === null &&
                        this.isTokenRetrievalStarted(resource)) {
                        requestInProgress = true;
                    }
                }
                return requestInProgress;
            };

            /**
            * Returns cached token for a given endpoint
            * @method Feedback.Services.FeedbackAdalHelperService.getCachedToken
            * @param {EndPoint} endpoint is the api endpoint for the resource or the api to which adal authorizes.
            * @example <caption> Example to invoke getCachedToken</caption>
            * FeedbackAdalHelperService.getCachedToken('http://oneprofiledevapi.azurewebsites.net');
            */
            FeedbackAdalHelperService.prototype.getCachedToken = function (endpoint) {
                var resource = this.adal.getResourceForEndpoint(endpoint);
                return this.adal.getCachedToken(resource);
            };

            /**
            * Checks for whether the token retrieval is started for the endpoint provided
            * @method Feedback.Services.FeedbackAdalHelperService.isTokenRetrievalStarted
            * @param {Resource} resource an endpoint which is passed to check for it in the logs entry.
            * @example <caption> Example to invoke isTokenRetrievalStarted</caption>
            * FeedbackAdalHelperService.isTokenRetrievalStarted('https://microsoft.onmicrosoft.com/CouchBaseAPI');
            */
            FeedbackAdalHelperService.prototype.isTokenRetrievalStarted = function (resource) {
                var isTokenRetrievalStarted = false;
                var log = this.adal._getItem(this.adal.CONSTANTS.LOG_ENTRY + resource);
                if (log) {
                    var logEntries = log.split(';');
                    var lastEntry = logEntries[logEntries.length - 2];
                    var entryTime = new Date(lastEntry.substr(0, lastEntry.indexOf('GMT:') + 3));
                    var now = new Date();
                    isTokenRetrievalStarted = now.getTime() < entryTime.getTime() + 10000;
                }
                return isTokenRetrievalStarted;
            };
            return FeedbackAdalHelperService;
        }());
        Services.FeedbackAdalHelperService = FeedbackAdalHelperService;
        angular
            .module('Microsoft.PS.Feedback')
            .service('FeedbackAdalHelperService', ['$q', 'adalAuthenticationService', FeedbackAdalHelperService]);
    })(Services = Feedback.Services || (Feedback.Services = {}));
})(Feedback || (Feedback = {}));
var Feedback;
(function (Feedback) {
    var Services;
    (function (Services) {
        /**
         * A service is used to send Feedback data
         * //Initializing FeedbackService
         *  angular.module('xxxxxxxx').controller('controller', ['FeedbackService']);
         *  function controller(controller){ FeedbackService.sendUserFeedbackInfo(feedbackAction,feedbackType,feedbackText); }
         */
        var FeedbackService = (function () {
            function FeedbackService($http, $q, $timeout, deviceDetector, feedbackAdalHelperService) {
                this.$http = $http;
                this.$q = $q;
                this.timeout = $timeout;
                this.iReqCount = 0;
                this.sleepInterval = 100;
                this.deviceDetector = deviceDetector;
                this.feedbackAdalHelperService = feedbackAdalHelperService;
                this.feedbackResponseId = "";
                this.feedbackActions = { Click: 'Click', Submit: 'Submit', Cancel: 'Cancel' };
            }
            /**
            * this method is used to preparing the main Object, which we need to send to extranal API.
            * @method FeedbackService.sendUserFeedbackInfo
            * @param {feedbackAction }  feedbackAction is click, submit, cancel.
            * @param {feedbackType }  feedbackType is smile, frown, idea.
            * @param {feedbackText }  feedbackText is feedback text .
            * @example <caption> Example to invoke sendUserFeedbackInfo</caption>
            * FeedbackService.sendUserFeedbackInfo(feedbackAction, feedbackType, feedbackText);
            */
            FeedbackService.prototype.sendUserFeedbackInfo = function (feedbackAction, feedbackType, feedbackText, feedbackConfiguration, feedbackContext) {
                var self = this, deviceInfo;
                var deferred = self.$q.defer();
                deviceInfo = self.deviceDetector;
                if (self.isNullOrEmpty(feedbackContext))
                    feedbackContext = {};

                var genericFeedbackProperties = {
                    Action: feedbackAction,
                    BrowserType: deviceInfo.browser,
                    BrowserVersion: deviceInfo.browser_version,
                    OperatingSystem: deviceInfo.os_version,
                    DeviceType: deviceInfo.device === "unknown" ? self.findDeviceType(deviceInfo) : deviceInfo.device
                };

                var userFeedbackInfo = angular.extend({}, genericFeedbackProperties, feedbackContext);
                delete userFeedbackInfo.UserId;
                var feedbackRequestProprities =
                    {
                        feedbackType: feedbackType,
                        userId: feedbackContext.UserId,
                        feedback: feedbackText,
                        id: (feedbackAction === self.feedbackActions.Submit || feedbackAction === self.feedbackActions.Cancel) ? self.feedbackResponseId : "",
                        tags: userFeedbackInfo
                    }

                if (!self.feedbackEndpointValidation(feedbackConfiguration))
                    return;

                self.sendUserFeedbackToAPI(feedbackRequestProprities, feedbackConfiguration.feedbackServiceEndpoint, feedbackConfiguration.feedbackSubscriptionId).then(function (response) {
                    self.feedbackResponseId = !self.isNullOrEmpty(response.data) ? response.data.id : "";
                    deferred.resolve(feedbackRequestProprities);
                }, function (error) {
                    feedbackRequestProprities.error = !self.isNullOrEmpty(error.data) ? error.data.message : "";
                    self.feedbackResponseId = "";
                    deferred.reject(feedbackRequestProprities);
                });
                return deferred.promise;
            };

            /**
           * this method is used to send the feedback information To API.
           * @method FeedbackService.sendUserFeedbackInfo
           * @param {feedbackRequestProprities } feedbackRequestProprities is preparing the main Object, which we need to send to extranal API .
           * @param {feedbackServiceEndpoint } feedbackServiceEndpoint for send feedback data to api
           * @param {feedbackSubscriptionId } feedbackSubscriptionId  need to send from consumer app for subscrpition.
           * @example <caption> Example to invoke feedbackRequestProprities</caption>
           * FeedbackService.sendUserFeedbackToAPI(feedbackRequestProprities, feedbackServiceEndpoint, feedbackSubscriptionId);
           */
            FeedbackService.prototype.sendUserFeedbackToAPI = function (feedbackRequestProprities, feedbackServiceEndpoint, feedbackSubscriptionId) {
                var self = this;
                var deferred = self.$q.defer();
                var url = feedbackServiceEndpoint + "/feedback?subscriptionId=" + feedbackSubscriptionId;
                if (self.feedbackAdalHelperService.accessTokenRequestInProgress(url)) {
                    self.iReqCount++;
                    if (self.iReqCount == 5) {
                        console.log("Feedback Component Error: Your profile does not have permission to access this content.");
                    }
                    self.timeout(function () {
                        self.sendUserFeedbackToAPI(feedbackRequestProprities, feedbackServiceEndpoint, feedbackSubscriptionId);
                    }, self.sleepInterval);
                } else {
                    self.iReqCount = 0;
                    return self.$http.post(url, feedbackRequestProprities, { headers: { 'Content-Type': 'application/json' } });
                }
                return deferred.promise;
            }

            /**
             * this method is used to validating the feedbackConfiguration details
             * @method FeedbackService.feedbackConfigurationValidation
             * @param {feedbackServiceEndpoint } feedbackServiceEndpoint.
             * @param {feedbackSubscriptionId } feedbackSubscriptionId.
             * @param {feedbackRequestProprities } feedbackRequestProprities.
             * @example <caption> Example to invoke sendUserFeedbackInfo</caption>
             * FeedbackService.feedbackConfigurationValidation(feedbackRequestProprities, feedbackConfiguration);
             */
            FeedbackService.prototype.feedbackEndpointValidation = function (feedbackConfiguration) {
                var self = this;
                if (self.isNullOrEmpty(feedbackConfiguration)) {
                    console.log("Feedback Component Error: Feedback service endpoint is missing from consumer application");
                    return false;
                }

                if (self.isNullOrEmpty(feedbackConfiguration.feedbackSubscriptionId)) {
                    console.log("Feedback Component Error: Feedback Subscription Id is missing from consumer application");
                    return false;
                }

                if (self.isNullOrEmpty(feedbackConfiguration.feedbackServiceEndpoint)) {
                    console.log("Feedback Component Error: Feedback service endpoint is missing from consumer application");
                    return false;
                }
                return true;
            }

            /**
            * this method is used to find the device type
            * @method FeedbackService.findDeviceType
            * @param {deviceDectorer } deviceDectorer is object having funtion to find the device.
            * @example <caption> Example to invoke find devicetype</caption>
            * FeedbackService.findDeviceType(deviceDectorer);
            */
            FeedbackService.prototype.findDeviceType = function (deviceDetector) {
                if (deviceDetector.isDesktop()) {
                    return "Desktop";
                } else if (deviceDetector.isMobile()) {
                    return "Mobile";
                } else if (deviceDetector.isTablet()) {
                    return "Tablet";
                }
            }

            /**
             * this method is used to get default feedback item collection
             * @method FeedbackService.defautItemCollection
             * @example <caption> Example to invoke defautItemCollection</caption>
             * FeedbackService.defautItemCollection();
             */
            FeedbackService.prototype.defautItemCollection = function () {
                return [
                                           {
                                               Icon: "icon icon-smile",
                                               DisplayText: "Send a smile",
                                               Value: "smile",
                                               Description: "Tell us about your experience, any input is helpful!"
                                           },
                                          {
                                              Icon: "icon icon-frown",
                                              DisplayText: "Send a frown",
                                              Value: "frown",
                                              Description: "How can we make you work more efficiently?"
                                          },
                                          {
                                              Icon: "icon icon-idea",
                                              DisplayText: "Send an idea",
                                              Value: "idea",
                                              Description: "How can we make you work more efficiently?"
                                          }
                ];
            };

            /**
             * this method is used to do null or undefinded checks
             * @method FeedbackService.isNullOrEmpty
             * @param {input} input is varibale/object/array  .
             * @example <caption> Example to invoke find devicetype</caption>
             * FeedbackService.isNullOrEmpty(object);
             */
            FeedbackService.prototype.isNullOrEmpty = function (input) {
                return (input === null || input === undefined || jQuery.isEmptyObject(input) || input.toString().length === 0 || input === "null");
            }

            return FeedbackService;
        }());
        Services.FeedbackService = FeedbackService;
        angular
            .module('Microsoft.PS.Feedback')
            .service('FeedbackService', ['$http', '$q', '$timeout', 'deviceDetector', 'FeedbackAdalHelperService', FeedbackService]);
    })(Services = Feedback.Services || (Feedback.Services = {}));
})(Feedback || (Feedback = {}));
var Feedback;
(function (Feedback) {
    var Directives;
    (function (Directives) {
        var feedbackWidget = (function () {
            function feedbackWidget() {
            }
            feedbackWidget.feedbackWidgetAction = function ($window, $timeout, $templateCache, feedbackService) {
                var directive = {
                    link: link,
                    template: $templateCache.get('feedbackWidget.html'),
                    controller: FeedbackWidgetController,
                    scope: {
                        feedbackConfiguration: "=",
                        feedbackContext: "=",
                        feedbackSuccessFunc: "&",
                        feedbackFailureFunc: "&"
                    },
                    controllerAs: 'feedbackCtrl',
                    bindToController: true
                };
                return directive;
                function link(scope, elem, attr, ctrl) {
                    var keyCodes = {
                        escapeKey: 27,
                        arrowRightKey: 39,
                        arrowLeftKey: 37,
                        arrowDownKey: 40,
                        arrowUpKey: 38,
                        enterKey: 13,
                        tabKey: 9
                    };
                    var feedbackContent = '.feedback-modal', feedbackText = 'feedback-text', feedbackCntrlElem = '.feedback-control', feedbackPanel = '.feedback-panel', feedbackIcon = '.feedback-control-icon', feedbackOverlayPanel = ".feedback-overlay-panel";
                    elem = $(elem).find(feedbackCntrlElem);
                    var positionHandler = function () {
                        var btnLeft = $(elem).find('button').offset().left;
                        $(elem).find('ul.dropdown-menu').css({ left: btnLeft });
                    };
                    var keyBoardEventHandler = function (event) {
                        var targetMenu = $(event.target).closest(feedbackOverlayPanel), allMenuItems = targetMenu.find("a, textarea:not([disabled]), button:not([disabled])").filter(':visible'), currentMenuItemIndex = allMenuItems.index(event.target);
                        switch (event.keyCode) {
                            case keyCodes.tabKey:
                                event.preventDefault();
                                event.stopPropagation();
                                if (!event.shiftKey) {
                                    if (currentMenuItemIndex < (allMenuItems.length - 1)) {
                                        allMenuItems[currentMenuItemIndex + 1].focus();
                                    }
                                    else {
                                        allMenuItems[0].focus();
                                    }
                                }
                                else {
                                    if (currentMenuItemIndex > 0) {
                                        allMenuItems[currentMenuItemIndex - 1].focus();
                                    }
                                    else {
                                        allMenuItems[allMenuItems.length - 1].focus();
                                    }
                                }
                                break;
                        }
                    };
                    var keyEventForMenuItems = function (event) {
                        var target = $(event.target), allMenuItems = target.closest('ul.dropdown-menu').find("li a"), currentMenuItemIndex = allMenuItems.index(event.target);
                        switch (event.keyCode) {
                            case keyCodes.tabKey:
                                if (!event.shiftKey && currentMenuItemIndex == (allMenuItems.length - 1)) {
                                    var targetMenu = target.closest("ul.dropdown-menu");
                                    closeListMenu(targetMenu);
                                }
                                break;
                            case keyCodes.escapeKey:
                                resetFocus();
                                break;
                        }
                    };
                    var keyEventHandlerForIcon = function (event) {
                        var target = $(event.target);
                        if (event.keyCode == keyCodes.tabKey && event.shiftKey) {
                            var targetMenu = target.parent().find("ul.dropdown-menu");
                            closeListMenu(targetMenu);
                        }
                    };
                    function closeListMenu(targetMenu) {
                        var targetMenuToggleBtnId = targetMenu.attr("aria-labelledby"), targetMenuToggleBtn = $("#" + targetMenuToggleBtnId);
                        $timeout(function () {
                            ctrl.isOpen = false;
                        });
                        targetMenuToggleBtn.attr("aria-expanded", "false");
                    }
                    var clickEventHandler = function () {
                        ctrl.isFeedbackFlyoutOpen = true;
                        ctrl.startTime = performance.now();
                        var target = $(this);
                        if (target) {
                            var controlList = target.closest('ul').find('li');
                            if (controlList)
                                controlList.removeClass('active-control');
                            openFeedbackFlyout(target);
                        }
                    };

                    var globalKeyEventHandler = function (event) {
                        if (ctrl.isFeedbackFlyoutOpen) {
                            switch (event.keyCode) {
                                case keyCodes.escapeKey:
                                    event.stopPropagation();
                                    event.preventDefault();
                                    scope.$apply(function () { ctrl.isFeedbackFlyoutOpen = false; });
                                    ctrl.cancelFeedback();
                            }
                        }
                    };

                    ctrl.closeFeedbackFlyout = function () {
                        hideFlyout();
                        resetCss();
                        closeListMenu($(feedbackPanel));
                        resetFocus();
                    };
                    function hideFlyout() {
                        ctrl.isFeedbackFlyoutOpen = false;
                        ctrl.feedbackText = null;
                        $(feedbackContent).hide();
                    }
                    function resetFocus() {
                        $timeout(function () {
                            $(feedbackIcon).focus();
                        }, 25);
                    }
                    function resetCss() {
                        $(feedbackIcon).removeClass('openFlyout');
                    }
                    function openFeedbackFlyout(target) {
                        target.closest(feedbackCntrlElem).find(feedbackContent).show();
                        $(feedbackIcon).addClass('openFlyout');
                        $("#" + feedbackText).focus();
                        $(feedbackOverlayPanel).scrollTop(0);
                        closeListMenu($(feedbackPanel));
                        ctrl.uiRenderDuration = performance.now() - ctrl.startTime;
                    }
                    var feedbackActiveElems,
                        feedbackMenuList, feedbackMenuItems, feedbackOverlayPanelElems, feedbackControlIcon;

                    $timeout(function () {
                        feedbackActiveElems = $(elem).find(feedbackPanel).find("a, textarea:not([disabled]), button:not([disabled])").filter(':visible'), feedbackMenuList = $(elem).find('ul.dropdown-menu li'), feedbackMenuItems = $(elem).find('ul.dropdown-menu li a'), feedbackControlIcon = $(elem).find('button.feedback-control-icon'), feedbackOverlayPanelElems = $(elem).find(feedbackOverlayPanel).find("a, textarea:not([disabled]), button:not([disabled])");
                        feedbackMenuList.on("click", clickEventHandler);
                        feedbackMenuItems.on("keydown", keyEventForMenuItems);
                        feedbackOverlayPanelElems.on("keydown", keyBoardEventHandler);
                        feedbackControlIcon.on("keydown", keyEventHandlerForIcon);
                        angular.element($window).on('keyup', globalKeyEventHandler);
                    });
                    function cleanUp() {
                        feedbackActiveElems = $(elem).find(feedbackPanel).find("a, textarea:not([disabled]), button:not([disabled])").filter(':visible'), feedbackMenuList = $(elem).find('ul.dropdown-menu li'), feedbackMenuItems = $(elem).find('ul.dropdown-menu li a'), feedbackControlIcon = $(elem).find('button.feedback-control-icon'), feedbackOverlayPanelElems = $(elem).find(feedbackOverlayPanel).find("a, textarea:not([disabled]), button:not([disabled])");
                        feedbackMenuList.off("click", clickEventHandler);
                        feedbackMenuItems.off("keydown", keyEventForMenuItems);
                        feedbackOverlayPanelElems.off("keydown", keyBoardEventHandler);
                        feedbackControlIcon.off("keydown", keyEventHandlerForIcon);
                        angular.element($window).off('keyup', globalKeyEventHandler);
                    }
                    scope.$on('$destroy', cleanUp);
                }

                /**
                 * feedback widget controller.
                */
                function FeedbackWidgetController() {
                    var feedbackCtrl = this, startTime, uiRenderDuration;
                    /**
                    * this method is used get the default feedback item collection if consumer not provider
                    * @method Feedback.FeedbackWidgetController.feedbackItemCollectionInit
                    * @example <caption> Example to invoke find feedbackItemCollectionInit</caption>
                    * FeedbackWidgetController.feedbackItemCollectionInit();
                    */
                    function feedbackItemCollectionInit() {
                        if (!feedbackService.isNullOrEmpty(feedbackCtrl.feedbackConfiguration)) {
                            if (!feedbackService.isNullOrEmpty(feedbackCtrl.feedbackConfiguration.feedbackItemCollection)) {
                                feedbackCtrl.feedbackItemCollection = feedbackCtrl.feedbackConfiguration.feedbackItemCollection;
                            }
                        } else {
                            feedbackCtrl.feedbackItemCollection = feedbackService.defautItemCollection();
                        }
                    }

                    feedbackItemCollectionInit();

                    /**
                    * this method is used get the default feedback UI strings for Overlay.
                    * @method Feedback.FeedbackWidgetController.defautStringCollection
                    * @example <caption> Example to invoke find defautStringCollection</caption>
                    * FeedbackWidgetController.defautStringCollection();
                    */
                    function defautStringCollection() {
                        feedbackCtrl.feedbackHeader = feedbackCtrl.feedbackSelectedItem;
                        feedbackCtrl.feedbackInstruction = "*Please send or cancel to close this panel.";
                        feedbackCtrl.sendFeedback = feedbackCtrl.feedbackSelectedItem;
                        feedbackCtrl.watermarkText = "Enter detailed feedback or ideas";
                        feedbackCtrl.cancel = "Cancel";
                    }

                    /**
                    * this method is used capture feedbackItem and send data to services of user selected feedback type like smile/frown/idea
                    * @method Feedback.FeedbackWidgetController.selectedFeedbackItem
                    * @example <caption> Example to invoke find selectedFeedbackItem</caption>
                    * FeedbackWidgetController.selectedFeedbackItem();
                    */
                    feedbackCtrl.selectedFeedbackItem = function (feedbackItem) {
                        feedbackCtrl.feedbackType = feedbackItem.Value;
                        feedbackCtrl.feedbackSelectedItem = feedbackItem.DisplayText;
                        feedbackCtrl.feedbackDescription = feedbackItem.Description;
                        defautStringCollection();
                        feedbackService.sendUserFeedbackInfo(feedbackService.feedbackActions.Click, feedbackCtrl.feedbackType, "", feedbackCtrl.feedbackConfiguration, feedbackCtrl.feedbackContext).then(function (response) {
                            response.TotalDuration = performance.now() - feedbackCtrl.startTime;
                            response.UIRenderDuration = feedbackCtrl.uiRenderDuration;
                            feedbackCtrl.feedbackSuccessFunc({ feedbackResponse: response });
                        }, function (error) {
                            error.TotalDuration = performance.now() - feedbackCtrl.startTime;
                            error.UIRenderDuration = feedbackCtrl.uiRenderDuration;
                            feedbackCtrl.feedbackFailureFunc({ feedbackResponse: error })
                        });
                    }

                    /**
                    * this method is used to send captured feedbackInfo to service
                    * @method Feedback.FeedbackWidgetController.submitFeedback
                    * @example <caption> Example to invoke find submitFeedback</caption>
                    * FeedbackWidgetController.submitFeedback();
                    */
                    feedbackCtrl.submitFeedback = function () {
                        startTime = performance.now();
                        feedbackService.sendUserFeedbackInfo(feedbackService.feedbackActions.Submit, feedbackCtrl.feedbackType, feedbackCtrl.feedbackText, feedbackCtrl.feedbackConfiguration, feedbackCtrl.feedbackContext).then(function (response) {
                            feedbackCtrl.closeFeedbackFlyout();
                            response.TotalDuration = performance.now() - startTime;
                            response.UIRenderDuration = response.TotalDuration;
                            feedbackCtrl.feedbackSuccessFunc({ feedbackResponse: response });
                        }, function (error) {
                            error.TotalDuration = performance.now() - startTime;
                            error.UIRenderDuration = error.TotalDuration;
                            feedbackCtrl.feedbackFailureFunc({ feedbackResponse: error });
                        });
                    }

                    /**
                    * this method is used to cancel the feedback
                    * @method Feedback.FeedbackWidgetController.cancelFeedback
                    * @example <caption> Example to invoke find cancelFeedback</caption>
                    * FeedbackWidgetController.cancelFeedback();
                    */
                    feedbackCtrl.cancelFeedback = function () {
                        startTime = performance.now();
                        var feedbackText = feedbackCtrl.feedbackText;
                        feedbackCtrl.closeFeedbackFlyout();
                        uiRenderDuration = performance.now() - startTime;
                        feedbackService.sendUserFeedbackInfo(feedbackService.feedbackActions.Cancel, feedbackCtrl.feedbackType, feedbackText, feedbackCtrl.feedbackConfiguration, feedbackCtrl.feedbackContext).then(function (response) {
                            response.TotalDuration = performance.now() - startTime;
                            response.UIRenderDuration = uiRenderDuration;
                            feedbackCtrl.feedbackSuccessFunc({ feedbackResponse: response });
                        }, function (error) {
                            error.TotalDuration = performance.now() - startTime;
                            error.UIRenderDuration = uiRenderDuration;
                            feedbackCtrl.feedbackFailureFunc({ feedbackResponse: error });
                        });

                    }
                }
            };
            return feedbackWidget;
        })();
        feedbackWidget.feedbackWidgetAction['$inject'] = ['$window', '$timeout', '$templateCache', 'FeedbackService'];
        angular
            .module('Microsoft.PS.Feedback')
            .directive('feedbackWidget', feedbackWidget.feedbackWidgetAction);
    })(Directives = Feedback.Directives || (Feedback.Directives = {}));
})(Feedback || (Feedback = {}));