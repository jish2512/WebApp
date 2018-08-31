import{NotificationsController}from '../js/controllers/notificationController';
declare var angular:any;
describe("Given NotificationController", () => {
    var $rootScope, $scope, $state, fxpConfigurationService, notificationStore, $timeout, $controller, $q, $interval, fxpLoggerService, notificationActionCenter, fxpUIConstants, userInfoService, settingsService, fxpMessage, toastNotificationService, device, fxpContextService;
    var notificationCollection = [
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
                    "NotificationCollection": notificationCollection,
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
                this.getNotifications = jasmine.createSpy("getNotifications").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback({ data: notificationCollection });
                        }
                    }
                });
                this.getUnreadNotificationCount = jasmine.createSpy("getUnreadNotificationCount").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback({ data: { "CurrentOffset": 124, "UnreadCount": 2 }});
                        }
                    }
                });
                this.deleteNotification = jasmine.createSpy("deleteNotification").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({ "Success": true });
                        }
                    }
                });
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
                    return notificationCollection;
                });
            });
            $provide.service("FxpToastNotificationService", function () {
                this.checkToastNotifications = jasmine.createSpy("checkToastNotifications").and.callFake(function (a) {
                    console.log("checkToastNotifications called with " + a);
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

            $provide.service("UserInfoService", function () {
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    console.log('getLoggedInUser : ');
                    return "alias";
                });                
            });

            $provide.service("SettingsService", function () {
                this.saveSettings = jasmine.createSpy("saveSettings").and.callFake(function (a, b, c, d) {
                    return {
                        then: function (callback) {
                            return callback({ StatusCode : 200 });
                        }
                    }
                });               
            });
            $provide.service("FxpContextService", function () {
                this.readContext = jasmine.createSpy("readContext").and.callFake(function (a, b) {
                    return {
                        then: function (callback) {
                            return callback({ "Result": "{\"isLeftNavPinned\":true}" });
                        }
                    }
                });
                this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (a, b, c) {
                    return {
                        then: function (callback) {
                            return callback({ "Result": "{\"isLeftNavPinned\":false}" });
                        }
                    }
                });
            }); 
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage: ' + a + '' + b);
                });
            });

            $provide.service("DeviceFactory", function () {
                this.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                    console.log('isMobile: ');
                    return false;
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
                    DNDSaveSettingsFailedError: {
                        ErrorMessage: "Settings service is down. Please create a support ticket for this issue.",
                        ErrorMessageTitle: "Error in saveNotificationDNDSetting method while saving the Do not disturb Settings"
                    }
                }
            };
        })
    })

    beforeEach(angular.mock.inject(function (_$rootScope_, FxpConfigurationService, NotificationStore, NotificationActionCenter, FxpToastNotificationService, FxpLoggerService, UserInfoService, SettingsService, FxpMessageService, FxpContextService, _$timeout_, _$q_, _$interval_, _$controller_, DeviceFactory) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpConfigurationService = FxpConfigurationService;
        notificationStore = NotificationStore;
        notificationActionCenter = NotificationActionCenter;
        toastNotificationService = FxpToastNotificationService;
        fxpLoggerService = FxpLoggerService;
        fxpMessage = FxpMessageService;
        userInfoService = UserInfoService;
        settingsService = SettingsService;
        fxpContextService = FxpContextService;
        $timeout = _$timeout_;
        $q = _$q_;
        $interval = _$interval_;
        $controller = _$controller_;
        device = DeviceFactory;
    }));
    describe("When NotificationsController Loaded", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout,
                $interval: $interval
            });
        })
        it('Then unreadNotificationCount should be 0', function () {
            expect(controller.unreadNotificationCount).toEqual(0);
        });
        it('Then currentOffset should be 0', function () {
            expect(controller.currentOffset).toEqual(0);
        });
        it('Then notificationCollection should be empty array', function () {
            expect(controller.notificationCollection).toEqual([]);
        });
        it('Then isNotificationFlyoutOpen should be false', function () {
            expect(controller.isNotificationFlyoutOpen).toEqual(false);
        });
        it('Then hasNotificationError should be false', function () {
            expect(controller.hasNotificationError).toEqual(false);
        });
        it('Then notificationErrorMsg should be empty', function () {
            expect(controller.notificationErrorMsg).toEqual("");
        });
        it('Then notificationLimit should be 10', function () {
            expect(controller.notificationLimit).toEqual(10);
        });
        it('When scope is destroyed', function () {
            controller.offsetExpirationPromise = {};
            controller.$scope.$destroy();
            expect(controller.offsetExpirationPromise).toBeNull();
            expect(controller.unreadPollIntervalPromise).toBeNull();
        });
        it('reduceNotificationCount event fired', function () {
            controller.unreadNotificationCount = 2;
            $rootScope.$broadcast('reduceNotificationCount', 1)
            expect(controller.unreadNotificationCount).toEqual(1);
        });
    });
    describe("When closeNotificationFlyout method gets called ", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.closeNotificationFlyout();
        })
        it('Then isNotificationFlyoutOpen should be updated to false', function () {
            expect(controller.isNotificationFlyoutOpen).toEqual(false);
        });
    });
    describe("When getNotifications method gets called ", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.isNotificationFlyoutOpen = true;
            spyOn(controller, "getUnreadNotificationCount").and.callThrough();
            controller.getNotifications(1, 2);
        })
        it('Then getNotifications of NotificationStore should have been called', function () {
            expect(notificationStore.getNotifications).toHaveBeenCalled();
        });
        it('Then getUnreadNotificationCount method should have been called', function () {
            expect(controller.getUnreadNotificationCount).toHaveBeenCalled();
        });
    });

    describe("When getNotifications method gets called and if getNotifications of notificationStore thrown error ", () => {
        var controller, error;
        beforeEach(function () {
            notificationStore.getNotifications = jasmine.createSpy("getNotifications").and.callFake(function (a, b) {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            });
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.isNotificationFlyoutOpen = true;
            spyOn(controller, "setErrorMessage").and.callThrough();
            controller.getNotifications(1, 2, 3);
            $timeout.flush();
        })
        it('Then getNotifications of NotificationStore should have been called', function () {
            expect(notificationStore.getNotifications).toHaveBeenCalled();
        });
        it('Then setErrorMessage method should have been called', function () {
            expect(controller.setErrorMessage).toHaveBeenCalled();
        });
    });

    describe("When getUnreadNotificationCount is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.currentOffset = 111;
            controller.getUnreadNotificationCount();
        })
        it('Then unreadNotificationCount should be 2', function () {
            expect(controller.unreadNotificationCount).toEqual(2);
        });
    });

    describe("When getUnreadNotificationCount is called and if getUnreadNotificationCount of notificationStore thrown error", () => {
        var controller, error;
        beforeEach(function () {
            notificationStore.getUnreadNotificationCount = jasmine.createSpy("getUnreadNotificationCount").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            });
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            spyOn(controller, "setErrorMessage").and.callThrough();
            controller.getUnreadNotificationCount();
            $timeout.flush();
        })
        it('Then setErrorMessage method should have been called', function () {
            expect(controller.setErrorMessage).toHaveBeenCalled();
        });
    });
    describe("When markAllNotificationsAsRead method gets called", () => {
        var controller;
        beforeEach(function () {
            fxpConfigurationService.FxpAppSettings.DefaultNotificationLimit = "1";
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            spyOn(controller, "getNotifications").and.callThrough();
            controller.notificationCollection = angular.copy(notificationCollection);
            controller.markAllNotificationsAsRead();
        })
        it('Then mark all notifications as read in collection', function () {
            controller.notificationCollection.forEach(function (item) {
                expect(item.Status).toEqual("Read");
            });
        });
        it('Then unreadNotificationCount should be 0', function () {
            expect(controller.unreadNotificationCount).toEqual(0);
        });
    });
    describe("When markAllNotificationsAsRead method gets called and if markNotificationAsRead of notificationStore thrown error", () => {
        var controller, error;
        beforeEach(function () {
            notificationStore.markNotificationAsRead = jasmine.createSpy("markNotificationAsRead").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            });
            fxpConfigurationService.FxpAppSettings.DefaultNotificationLimit = "1";
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            spyOn(controller, "setErrorMessage").and.callThrough();
            controller.markAllNotificationsAsRead();
            $timeout.flush();
        })
        it('Then setErrorMessage method should have been called', function () {
            expect(controller.setErrorMessage).toHaveBeenCalled();
        });
    });
    describe("When dismissAllNotifications method gets called", () => {
        var controller;
        beforeEach(function () {
            fxpConfigurationService.FxpAppSettings.DefaultNotificationLimit = "1";
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.dismissAllNotifications();
        })
        it('Then notificationCollection value should be initialized with empty array', function () {
            expect(controller.notificationCollection).toEqual([]);
        });
        it('Then unreadNotificationCount should be 0', function () {
            expect(controller.unreadNotificationCount).toEqual(0);
        });
    });
    describe("When dismissAllNotifications method gets called and if deleteNotification of notificationStore thrown error", () => {
        var controller, error;
        beforeEach(function () {
            notificationStore.deleteNotification = jasmine.createSpy("deleteNotification").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            });
            fxpConfigurationService.FxpAppSettings.DefaultNotificationLimit = "1";
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            spyOn(controller, "setErrorMessage").and.callThrough();
            controller.dismissAllNotifications();
            $timeout.flush();
        })
        it('Then setErrorMessage method should have been called', function () {
            expect(controller.setErrorMessage).toHaveBeenCalled();
        });
    });

    describe("When loadMore method gets called", () => {
        var controller, $event;
        beforeEach(function () {
            $event = jasmine.createSpyObj("event", ["stopPropagation", "preventDefault"]);
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            spyOn(controller, "getNotifications").and.callThrough();
            controller.loadMore($event);
        })
        it('Then stopPropogation should to be called', function () {
            expect($event.stopPropagation).toHaveBeenCalled();
        });
        it('Then preventDefault should to be called', function () {
            expect($event.preventDefault).toHaveBeenCalled();
        });
        it('Then getNotifications should have been called', function () {
            expect(controller.getNotifications).toHaveBeenCalled();
        });
    });

    describe("When readNotification method gets called", () => {
        var controller, error;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                NotificationActionCenter: notificationActionCenter,
                $timeout: $timeout
            });
            controller.notificationCollection = angular.copy(notificationCollection);
            spyOn(controller, "logError").and.callThrough();
            controller.readNotification(controller.notificationCollection[1]);
        })
        it('Then notification should be marked as read', function () {
            expect(controller.notificationCollection[1].Status).toEqual("Read");
        });
    });

    describe("When readNotification method gets called and if any error occured", () => {
        var controller, error;
        beforeEach(function () {
            notificationActionCenter.excecuteNotificationAction = jasmine.createSpy("excecuteNotificationAction").and.callFake(function () {
                throw "ex";
            });
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                NotificationActionCenter: notificationActionCenter,
                $timeout: $timeout
            });
            controller.notificationCollection = angular.copy(notificationCollection);
            spyOn(controller, "logError").and.callThrough();
            controller.readNotification(controller.notificationCollection[1]);
        })
        it('Then logError method should have been called', function () {
            expect(controller.logError).toHaveBeenCalled();
        });
    });

    describe("When readNotification method gets called and if markNotificationAsRead of notificationStore thrown error ", () => {
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
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            spyOn(controller, "setErrorMessage").and.callThrough();
            controller.readNotification(notificationCollection[1]);
            $timeout.flush();
        })
        it('Then getUnreadNotificationCount method should have been called', function () {
            expect(controller.setErrorMessage).toHaveBeenCalled();
        });
    });
    describe("When deleteNotification method gets called", () => {
        var controller;
        beforeEach(function () {
            var $event = jasmine.createSpyObj("event", ["stopPropagation"]);
            $event.stopPropagation = jasmine.createSpy("stopPropagation").and.callFake(function (a) {
                console.log("Stop Propagation");
            });
            $event.preventDefault = jasmine.createSpy("preventDefault").and.callFake(function (a) {
                console.log("Stop preventDefault");
            });
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.notificationCollection = angular.copy(notificationCollection);
            spyOn(controller, "getUnreadNotificationCount").and.callThrough();
            spyOn(controller, "getNotifications").and.callThrough();
            controller.deleteNotification(controller.notificationCollection[1], $event);
        })
        it('Then getNotifications method should have been called', function () {
            expect(controller.getNotifications).toHaveBeenCalled();
        });
    });
    describe("When deleteNotification method gets called and if deleteNotification of notificationStore thrown error ", () => {
        var controller, error;
        beforeEach(function () {
            var $event = jasmine.createSpyObj("event", ["stopPropagation"]);
            $event.stopPropagation = jasmine.createSpy("stopPropagation").and.callFake(function (a) {
                console.log("Stop Propagation");
            });
            $event.preventDefault = jasmine.createSpy("preventDefault").and.callFake(function (a) {
                console.log("Stop preventDefault");
            });
            notificationStore.deleteNotification = jasmine.createSpy("deleteNotification").and.callFake(function (a) {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            })
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout
            });
            controller.notificationCollection = angular.copy(notificationCollection);
            spyOn(controller, "setErrorMessage").and.callThrough();
            controller.deleteNotification(controller.notificationCollection[1], $event);
            $timeout.flush();
        })
        it('Then setErrorMessage method should have been called', function () {
            expect(controller.setErrorMessage).toHaveBeenCalled();
        });
    });
    describe("When pollNotificationUnreadCount method gets called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout,
                $interval: $interval
            });
            controller.pollNotificationUnreadCount();
            $interval.flush(3000);
        })
        it('Then getUnreadNotificationCount of notificationStore should have been called', function () {
            expect(notificationStore.getUnreadNotificationCount).toHaveBeenCalled();
        });
        it('Then unreadNotificationCount should be equal to 2', function () {
            expect(controller.unreadNotificationCount).toEqual(2);
        });
    });
    describe("When pollNotificationUnreadCount method gets called and if getUnreadNotificationCount of notificationStore thrown error", () => {
        var controller, error;
        beforeEach(function () {
            notificationStore.getUnreadNotificationCount = jasmine.createSpy("getUnreadNotificationCount").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            })
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                $timeout: $timeout,
                $interval: $interval
            });
            spyOn(controller, "logError").and.callThrough();
            controller.pollNotificationUnreadCount();
            $interval.flush(3000);
        })
        it('Then logError method should have been called', function () {
            expect(controller.logError).toHaveBeenCalled();
        });
    });
    describe("When onDNDValueChange method gets called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                SettingsService: settingsService,
                UserInfoService: userInfoService,
                $timeout: $timeout,
                $interval: $interval
            });
            spyOn(controller, "saveNotificationDNDSetting").and.callThrough();
            controller.onDNDValueChange(true);
        })
        it('Then saveNotificationDNDSetting method should have been called', function () {
            expect(controller.saveNotificationDNDSetting).toHaveBeenCalled();
        });
    });

    describe("When saveNotificationDNDSetting method gets called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                SettingsService: settingsService,
                UserInfoService: userInfoService,
                $timeout: $timeout,
                $interval: $interval
            });            
            controller.saveNotificationDNDSetting(true);
        })
        it('Then readContext of fxpContextService should have been called', function () {
            expect(fxpContextService.readContext).toHaveBeenCalled();
        });
        it('Then saveSettings of settingService should have been called', function () {
            expect(settingsService.saveSettings).toHaveBeenCalled();
        });
        it('Then logEvent of fxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
    });
    describe("When saveNotificationDNDSetting method gets called and saveSettings of settingservice thrown error", () => {
        var controller,error;
        beforeEach(function () {
            settingsService.saveSettings = jasmine.createSpy("getUnreadNotificationCount").and.callFake(function (a,b,c,d) {
                var defer = $q.defer();
                error = {
                    messege: "Error in notificationStore"
                };
                defer.reject(error);
                return defer.promise;
            })
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                SettingsService: settingsService,
                UserInfoService: userInfoService,
                $timeout: $timeout,
                $interval: $interval
            });
            controller.saveNotificationDNDSetting(true);
            $interval.flush(3000);
        })
        it('Then addMessage of fxpMessageService should have been called', function () {
            expect(fxpMessage.addMessage).toHaveBeenCalled();
        });             
        it('Then logError of fxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
    describe("When pauseNotificationsPoll method gets called", () => {
        var controller, error;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                SettingsService: settingsService,
                UserInfoService: userInfoService,
                $timeout: $timeout,
                $interval: $interval
            });
            controller.pauseNotificationsPoll();
            $timeout.flush();
            $timeout.flush();
        })
        it('Then currentOffset should have been 0', function () {
            expect(controller.currentOffset).toEqual(0);
        });
        it('Then offsetExpirationPromise should have been null', function () {
            expect(controller.offsetExpirationPromise).toBeNull();
        });
        it('Then unreadPollIntervalPromise should have been null', function () {
            expect(controller.unreadPollIntervalPromise).toBeNull();
        });
    });
    describe("When resumeNotificationsPoll  method gets called", () => {
        var controller, error;
        beforeEach(function () {
            controller = $controller('NotificationsController', {
                $scope: $scope,
                FxpConfigurationService: fxpConfigurationService,
                NotificationStore: notificationStore,
                SettingsService: settingsService,
                UserInfoService: userInfoService,
                $timeout: $timeout,
                $interval: $interval
            });
            controller.offsetExpirationPromise = {};
            spyOn(controller, "pollNotificationUnreadCount").and.callThrough();
            spyOn(controller, "getUnreadNotificationCount").and.callThrough();
            controller.resumeNotificationsPoll();
            $timeout.flush();
        })
        it('Then offsetExpirationPromise should be null', function () {
            expect(controller.offsetExpirationPromise).toBeNull();
        });
        it('Then pollNotificationUnreadCount should have been called', function () {
            expect(controller.pollNotificationUnreadCount).toHaveBeenCalled();
        });
        it('Then getUnreadNotificationCount should have been called', function () {
            expect(controller.getUnreadNotificationCount).toHaveBeenCalled();
        });
    });
});