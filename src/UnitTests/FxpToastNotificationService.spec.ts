/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {FxpToastNotificationService} from '../js/services/FxpToastNotificationService';
declare var angular:any;
describe("Given FxpToastNotificationService", () => {
    var $rootScope, notificationStore, fxpLoggerService, notifications, fxpUIConstants, fxpToastNotificationService, $q, $timeout;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(() => {
        notifications = [{
            "EventId": "66282b8e-6689-4c5e-85dc-fe25701062e3",
            "WebNotificationId": 10085
        },
            {
                "EventId": "66282b8e-6689-4c5e-85dc-fe25701062e6",
                "WebNotificationId": 10086
            }];
        var propBag = function () {
            return {
                addToBag: function (a, b) {
                    console.log('propbag =>' + a + ':' + b);
                }
            };
        }
        angular.mock.module(function ($provide) {
            $provide.service("NotificationStore", function () {
                this.getNotifications = jasmine.createSpy("getNotifications").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback({ data: notifications });
                        }
                    }
                });
            });
            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                    return propBag();
                });
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });
                this.logEvent = jasmine.createSpy("logEvent ").and.callFake(function (a, b, c) {
                    console.log('logEvent  : ' + a + ',' + b + ',' + c);
                });
            });
        });
        fxpUIConstants = {
            "UIMessages": {
                NotificationGetServiceError: {
                    ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
                    ErrorMessageTitle: "An Error Ocurred while fetching Notifications."
                },
                NotificationGetCountServiceError: {
                    ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
                    ErrorMessageTitle: "An Error Ocurred while fetching Unread Notifications count."
                },
                NotificationDeleteServiceError: {
                    ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
                    ErrorMessageTitle: "An Error Ocurred while Deleting Notification."
                },
                NotificationReadServiceError: {
                    ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
                    ErrorMessageTitle: "An Error Ocurred while Marking Notification as read."
                },
                NotificationNavigationError: {
                    ErrorMessage: "System Error has occurred. Please try again. If the problem persists, please contact IT support",
                    ErrorMessageTitle: "An Error Ocurred while performing Notification action."
                },
                ToastNotificationReadError: {
                    ErrorMessage: "System Error has occurred. Please try again. If the problem persists, please contact IT support",
                    ErrorMessageTitle: "An Error Ocurred while performing Notification action."
                }
            }
        };
    });
    beforeEach(angular.mock.inject((_$rootScope_, _NotificationStore_, FxpLoggerService, _FxpToastNotificationService_, _$q_, _$timeout_) => {
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        notificationStore = _NotificationStore_;
        fxpLoggerService = FxpLoggerService;
        fxpToastNotificationService = _FxpToastNotificationService_;
        $q = _$q_;
        $timeout = _$timeout_;
        spyOn($rootScope, '$broadcast');
    }));

    describe("When checkToastNotifications method gets called", () => {
        var error;
        beforeEach(() => {
            var index = 0;
            spyOn(fxpToastNotificationService, "checkToastNotifications").and.callThrough();
            fxpToastNotificationService.checkToastNotifications(123, 0, 2);
        });
        it('Then getNotifications of NotificationStore should have been called', function () {
            expect(notificationStore.getNotifications).toHaveBeenCalled();
        });
        it('Then getNotifications of NotificationStore returns notifications', function () {
            expect($rootScope.$broadcast).toHaveBeenCalledWith('newNotifications', notifications);
        });
        it('Then checkToastNotifications of ToastNotificationService should have been called', function () {
            expect(fxpToastNotificationService.checkToastNotifications).toHaveBeenCalled();
        });
    });

    describe("When checkToastNotifications method gets called and if getNotifications of notificationStore thrown error ", () => {
        var controller, error;
        beforeEach(function () {
            var index = 0;
            notificationStore.getNotifications = jasmine.createSpy("getNotifications").and.callFake(function (a, b) {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            });
            fxpToastNotificationService.checkToastNotifications(123);
            $timeout.flush();
        })
        it('Then getNotifications of NotificationStore should have been called', function () {
            expect(notificationStore.getNotifications).toHaveBeenCalled();
        });
        it('Then logError method should have been called', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
});