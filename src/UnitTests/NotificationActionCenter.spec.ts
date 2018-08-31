/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import{NotificationActionCenter}from '../js/services/NotificationActionCenter';
declare var angular:any;
describe("Given NotificationActionCenter UT Suite", () => {
    var $rootScope, $scope, $state, fxpConfigurationService, fxpRouteService, notificationActionCenter;

    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {

        angular.mock.module(function ($provide) {
            $provide.service("FxpConfigurationService", function () {
                this.FxpBaseConfiguration = {
                    "NotificationConfiguration": {
                        "ActionConfiguration": [
                            {
                                "Subject": "New Resource Request",
                                "ActionType": "State",
                                "OpenInNewTab": false,
                                "Action": "adminactonbehalf"
                            },
                            {
                                "Subject": "New Request",
                                "ActionType": "State",
                                "OpenInNewTab": true,
                                "Action": "adminactonbehalf"
                            },
                            {
                                "Subject": "New Skill Changed",
                                "ActionType": "Url",
                                "OpenInNewTab": true,
                                "Action": "Skill"
                            },
                            {
                                "Subject": "Profile Added",
                                "ActionType": "Function",
                                "OpenInNewTab": true,
                                "Action": "getProfile"
                            }
                        ],
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
            });
            $provide.service("FxpRouteService", function () {
                this.navigatetoSpecificState = jasmine.createSpy("navigatetoSpecificState").and.callFake(function (a) {
                    console.log("navigatetoSpecificState" + a);
                });
                this.navigateToSpecificUrl = jasmine.createSpy("navigateToSpecificUrl").and.callFake(function (a) {
                    console.log("navigateToSpecificUrl" + a);
                });
            });
        });
    });
    beforeEach(angular.mock.module(function ($stateProvider) {
        $stateProvider
            .state('adminactonbehalf', {
                url: "/ActOnBehalf",
                templateUrl: "https://fxppartnerapp.azurewebsites.net/GrmDashboard.html",
                controller: 'ActOnBehalfController'
            });
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$state_, FxpConfigurationService, FxpRouteService, _NotificationActionCenter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $state = _$state_;
        fxpConfigurationService = FxpConfigurationService;
        fxpRouteService = FxpRouteService;
        notificationActionCenter = _NotificationActionCenter_;
    }));

    describe("When excecuteNotificationAction method is called", () => {
        it("Then navigateToSpecificUrl of fxpRouteService should have been callled", function () {
            var subject = "New Request";
            notificationActionCenter.excecuteNotificationAction(subject);
            expect(fxpRouteService.navigateToSpecificUrl).toHaveBeenCalledWith("http://server/#/ActOnBehalf", "_blank");
        });
        it("Then navigatetoSpecificState of fxpRouteService should have been callled", function () {
            var subject = "New Resource Request";
            notificationActionCenter.excecuteNotificationAction(subject);
            expect(fxpRouteService.navigatetoSpecificState).toHaveBeenCalled();
        });
        it("Then navigateToSpecificUrl of fxpRouteService should have been callled", function () {
            var subject = "New Skill Changed";
            notificationActionCenter.excecuteNotificationAction(subject);
            expect(fxpRouteService.navigateToSpecificUrl).toHaveBeenCalledWith("Skill", "_blank");
        });
        it("Then it should broadcast the action", function () {
            var subject = "Profile Added";
            var isEventBroadcasted = false;
            $scope.$on("getProfile", function () {
                isEventBroadcasted = true;
            })
            notificationActionCenter.excecuteNotificationAction(subject);
            expect(isEventBroadcasted).toEqual(true);
        });
    });

    describe("When registerNotificationAction method is called", () => {
        beforeEach(function () {
            var subject = "New Profile Added", action = "profile", actionType = "State", openInNewTab = false;
            notificationActionCenter.registerNotificationAction(subject, action, actionType, openInNewTab);
        })
        it("Then it should add to the notificationActions array", function () {
            expect(notificationActionCenter.notificationActions.length).toEqual(5);
        });
    });

    describe("When registerNotificationAction method is called to change notification action", () => {
        beforeEach(function () {
            var subject = "New Request", action = "profile", actionType = "State", openInNewTab = false;
            notificationActionCenter.registerNotificationAction(subject, action, actionType, openInNewTab);
        })
        it("Then it should add to the notificationActions array", function () {
            expect(notificationActionCenter.notificationActions.length).toEqual(4);
        });
    });

    describe("When appendPropertiesToNotifications method is called", () => {
        var result;
        beforeEach(function () {
            var notifications = [
                {
                    "Subject": "new approval(s) awaiting action",
                    "PublishedLocalDate": "2015-03-14T06:53:02.2400379Z",
                    "WebNotificationId": 1,
                    "Status": "UnRead",
                    "From": "resourcemanagement"
                },
                {
                    "Subject": "new resource requests",
                    "PublishedLocalDate": "2014-03-14T06:53:02.2400379Z",
                    "WebNotificationId": 2,
                    "Status": "UnRead",
                    "From": "oneprofileskillassessment"
                }
            ];
            result = notificationActionCenter.appendPropertiesToNotifications(angular.copy(notifications));
        })
        it("Then it should add to the notificationActions array", function () {
            expect(result[0].icon).toEqual("icon icon-peopleLegacy");
        });
    });
});