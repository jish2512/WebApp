/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {ToastNotificationController} from '../js/controllers/toastNotificationController'
declare var angular:any;
describe("Given ToastNotificationController", () => {
    var $rootScope,
        $scope,
        $window,
        $timeout,
        fxpConfigurationService,
        notificationStore,
        notificationActionCenter,
        fxpMessage,
        fxpLoggerService,
        toastNotificationController,
        $q,
        fxpUIConstants;
    var toastNotifications = [
        {
            "icon": "icon icon-peopleLegacy",
            "Subject": "new approval(s) awaiting action",
            "PublishedLocalDate": "2015-03-14T06:53:02.2400379Z",
            "WebNotificationId": 1,
            "Status": "UnRead",
            "From": "resourcemanagement"
        },
        {
            "icon": "icon icon-peopleLegacy",
            "Subject": "new resource requests",
            "PublishedLocalDate": "2014-03-14T06:53:02.2400379Z",
            "WebNotificationId": 2,
            "Status": "UnRead",
            "From": "oneprofileskillassessment"
        }
    ];
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {
        var propBag = function () {
            return {
                addToBag: function (a, b) {
                    console.log('propbag =>' + a + ':' + b);
                }
            };
        }
        angular.mock.module(function ($provide) {

            $provide.service("FxpConfigurationService", function () {
                this.FxpBaseConfiguration = {
                    "NotificationConfiguration": {
                        "PollingInterval": 3000,
                        "DefaultNotificationLimit": 10,
                        "IconConfiguration": [
                            {
                                "From": "resourcemanagement",
                                "Icon": "icon icon-peopleLegacy"
                            },
                            {
                                "From": "oneprofileskillassessment",
                                "Icon": "icon icon-contactInfoLegacy"
                            }
                        ]
                    }
                };
                this.FxpAppSettings = {
                    "DefaultNotificationLimit": "10"
                };
            });
            $provide.service("NotificationStore", function () {
                this.markNotificationAsRead = jasmine.createSpy("markNotificationAsRead").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({ "Success": true });
                        }
                    }
                });
            });
            $provide.service("NotificationActionCenter", function () {
                this.excecuteNotificationAction = jasmine.createSpy("excecuteNotificationAction").and.callFake(function (a) {
                    console.log("excecuteNotificationAction called with " + a);
                });
                this.appendPropertiesToNotifications = jasmine.createSpy("appendPropertiesToNotifications").and.callFake(function () {
                    return toastNotifications;
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

            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage: ' + a + '' + b);
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
                        ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
                        ErrorMessageTitle: "An Error Ocurred while Marking Notification as read."
                    },
                    ToastNotificationReadError: {
                        ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
                        ErrorMessageTitle: "An Error Ocurred while Marking Notification as read."
                    },
                    SaveSettingsServiceCallFailedError: {
                        ErrorMessage: "Settings service is down. Please create a support ticket for this issue.",
                        ErrorMessageTitle: "An Error Ocurred in Setting Service."
                    }
                }
            };
        })
    });
    beforeEach(angular.mock.inject(function (_$rootScope_,
        FxpConfigurationService,
        NotificationStore,
        NotificationActionCenter,
        FxpToastNotificationService,
        FxpLoggerService,
        FxpMessageService,
        _$timeout_,
        _$q_,
        _$interval_,
        _$controller_
    ) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpConfigurationService = FxpConfigurationService;
        notificationStore = NotificationStore;
        notificationActionCenter = NotificationActionCenter;
        fxpLoggerService = FxpLoggerService;
        fxpMessage = FxpMessageService;
        $timeout = _$timeout_;
        $q = _$q_;
        toastNotificationController = _$controller_;
    }));
    describe("When ToastNotificationController is loaded", () => {
        var controller;
        beforeEach(function () {
            controller = toastNotificationController('ToastNotificationController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
        })
        it('Then toastNotifications should be empty array', function () {
            expect(controller.toastNotifications).toEqual([]);
        });
        it('Then toastNotificationLimit should be 10', function () {
            expect(controller.toastNotificationLimit).toEqual(10);
        });
        it('newNotifications event fired', function () {
            $rootScope.$broadcast('newNotifications', toastNotifications)
            expect(controller.toastNotifications).toEqual(toastNotifications);
        });
    });
    describe("When closeToastNotification is called", () => {
        var controller;
        beforeEach(() => {
            controller = toastNotificationController('ToastNotificationController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.toastNotifications = toastNotifications;
            controller.closeToastNotification(toastNotifications[0]);
        });
        it("Then notification should be removed from collection", () => {
            expect(controller.toastNotifications.length).toEqual(1);
        });
    });
    describe("When readToastNotification is called", () => {
        var controller;
        beforeEach(() => {
            controller = toastNotificationController('ToastNotificationController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.toastNotifications = angular.copy(toastNotifications);
            controller.readToastNotification(controller.toastNotifications[0]);
        });
        it("Then excecuteNotificationAction shold have been called", () => {
            expect(notificationActionCenter.excecuteNotificationAction).toHaveBeenCalled();
        });
        it("Then markNotificationAsRead shold have been called", () => {
            expect(notificationStore.markNotificationAsRead).toHaveBeenCalled();
        });
    });

    describe("When readToastNotification method gets called and if any error occured", () => {
        var controller, error;
        beforeEach(function () {
            notificationActionCenter.excecuteNotificationAction = jasmine.createSpy("excecuteNotificationAction").and.callFake(function () {
                throw "ex";
            });
            controller = toastNotificationController('ToastNotificationController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.toastNotifications = angular.copy(toastNotifications);
            controller.readToastNotification(controller.toastNotifications[0]);
        })
        it('Then logError method should have been called', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });

    describe("When readToastNotification method gets called and if markNotificationAsRead of notificationStore thrown error ", () => {
        var controller, error;
        beforeEach(function () {
            notificationStore.markNotificationAsRead = jasmine.createSpy("markNotificationAsRead").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            })
            controller = toastNotificationController('ToastNotificationController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.toastNotifications = angular.copy(toastNotifications);
            controller.readToastNotification(controller.toastNotifications[0]);
            $timeout.flush();
        })
        it('Then getUnreadNotificationCount method should have been called', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
});