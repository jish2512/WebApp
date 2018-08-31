/// <chutzpah_reference path="../testlink.js" />
import{LeftnavLink} from '../js/directives/fxpLeftnavLink';
declare var angular:any;
describe("Given fxpLeftnavLink Directive", () => {
    var $state, $rootScope, fxplogger, userInfoService, fxpTelemetryContext, oboUserService, $scope, $compile, element, propBagValue, fxpmessage, fxpBreadcrumbService;

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
            
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage : ' + a + ', ' + b);
                });
            });

            $provide.service("FxpLoggerService", function () {                    
                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    propBagValue = d;
                }); 
                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {
                    propBagValue = c;
                });
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b); return propBag();
                });
            });

            $provide.service("UserInfoService", function () {
                this.getCurrentUserData = jasmine.createSpy("getCurrentUserData").and.callFake(function () {
                    var userInfo = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":1,"roleGroupName":"Resource"}';
                    userInfo = JSON.parse(userInfo);
                    console.log('getCurrentUserData : ' + userInfo);
                    return userInfo;
                });             
            });

            $provide.service("FxpTelemetryContext", function () {
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "India";
                });
            });

            $provide.service("OBOUserService", function () {
                this.getOBOUser = jasmine.createSpy("getOBOUser").and.callFake(function () {
                    return {
                        displayName: "displayName",
                        href: "href",
                        alias: "obouseralias",
                        businessRole:"Non Services User",
                        roleGroupId: "2",
                        roleGroupName: "Requestor"
                    }
                });
            });
            $provide.service("FxpBreadcrumbService", function () {                
                this.isLeftNavItemClicked = false;
            });
        })
    })

    beforeEach(angular.mock.module(function ($stateProvider) {
        $stateProvider
            .state('DashBoard', {
                url: "/Home",
                templateUrl: "https://fxppartnerapp.azurewebsites.net/GrmDashboard.html",
                controller: 'grmDashboardCtrl'
            })
            .state('UserLookupPersonalization', {
                url: "/userlookuppersonalization",
                templateUrl: "/templates/userLookupPersonalization.html",
                controller: 'UserLookupPersonalizationController'
            })
            .state('TimeEntry', {
                url: "/timeentry",
                templateUrl: "/templates/timeentry.html",
                controller: 'TimeEntry'
            });
    }));


    beforeEach(angular.mock.inject(function (_$state_, _$rootScope_, FxpLoggerService, UserInfoService, FxpTelemetryContext, OBOUserService, FxpMessageService, FxpBreadcrumbService, _$compile_) {
        $state = _$state_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        fxplogger = FxpLoggerService;
        fxpmessage = FxpMessageService;
        userInfoService = UserInfoService;
        fxpTelemetryContext = FxpTelemetryContext;
        oboUserService = OBOUserService;
        fxpBreadcrumbService = FxpBreadcrumbService;
        $compile = _$compile_;
    }));

    describe("When fxpLeftnavLink loaded for L0 item which dont have children", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "1",
                "businessProcessName": "FXP Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-dashboard",
                "tooltip": "Takes you to the dashboard defined for your persona",
                "targetUIStateName": "DashBoard",
                "openInline": true,
                "sortOrder": 1,
                "hasChildren": false
            };
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);          
            $scope.$digest();
        })

        it('Then target of the element should be defined ', function () {
            expect(element.attr('target')).toEqual('_self');
        });

        it('Then href of the element should be defined ', function () {
            expect(element.attr('href')).toEqual('#/Home');
        });
    })

    describe("When fxpLeftnavLink loaded for L0 item which have only one child item", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "5",
                "businessProcessName": "Request",
                "displayName": "Request",
                "iconCSS": "icon icon-people",
                "tooltip": "Takes you to the Skill Page",
                "openInline": true,
                "sortOrder": 3,
                "hasChildren": true,
                "children": [
                    {
                        "id": "6",
                        "displayName": "Skill",
                        "iconCSS": "Timeentry",
                        "tooltip": "Takes you to the Skill Page",
                        "targetUIStateName": "NamedView",
                        "isExternal": true,
                        "openInline": false
                    }
                ]
            };
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            $scope.$digest();
        })

        it('Then target of the element should be _self', function () {
            expect(element.attr('target')).toEqual('_self');
        });

        it('Then href of the element should be undefined ', function () {
            expect(element.attr('href')).toEqual(undefined);
        });
    })

    describe("When fxpLeftnavLink loaded for child item", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "3",
                "displayName": "Time Entry",
                "iconCSS": "Timeentry",
                "tooltip": "Takes you to the time entry page",
                "targetUIStateName": "TimeEntry",
                "isExternal": false,
                "openInline": true,
                "sortOrder": 2
            };
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            $scope.$digest();
        })

        it('Then target of the element should be defined ', function () {
            expect(element.attr('target')).toEqual('_self');
        });

        it('Then href of the element should be defined ', function () {
            expect(element.attr('href')).toEqual('#/timeentry');
        });
    })

    describe("When fxpLeftnavLink loaded for L0 item as external link which have only one child item", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "10",
                "businessProcessName": "External Links",
                "displayName": "External Links",
                "iconCSS": "icon icon-external",
                "tooltip": "Takes you to the it MS internal portal",
                "hasChildren": true,
                "sortOrder": 2,
                "openInline": false,
                "children": [
                    {
                        "id": "11",
                        "displayName": "IT Web",
                        "iconCSS": "itwebicon",
                        "tooltip": "Takes you to the it MS internal portal",
                        "targetURL": "https://aka.ms/itweb",
                        "isExternal": false,
                        "openInline": false,
                        "sortOrder": 1
                    }
                ]
            };
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            $scope.$digest();
        })

        it('Then target of the element should be defined ', function () {
            expect(element.attr('target')).toEqual('_blank');
        });

        it('Then href of the element should be defined ', function () {
            expect(element.attr('href')).toEqual(undefined);
        });
    })

    describe("When fxpLeftnavLink loaded for L0 item which have more than one child items", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "2",
                "businessProcessName": "Time Management",
                "displayName": "Time sheet",
                "iconCSS": "icon icon-time",
                "tooltip": "Time management activities for managers",
                "hasChildren": true,
                "openInline": true,
                "sortOrder": 2,
                "children": [
                    {
                        "id": "3",
                        "displayName": "Time Entry",
                        "iconCSS": "Timeentry",
                        "tooltip": "Takes you to the time entry page",
                        "targetUIStateName": "TimeEntry",
                        "isExternal": false,
                        "openInline": true,
                        "sortOrder": 2
                    },
                    {
                        "id": "4",
                        "displayName": "Time Approval",
                        "iconCSS": "Timeapproval",
                        "tooltip": "Takes you to the time approval page",
                        "targetUIStateName": "TimeApproval",
                        "isExternal": false,
                        "openInline": true,
                        "sortOrder": 1
                    }
                ]
            };
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            $scope.$digest();
        })

        it('Then target of the element should be defined ', function () {
            expect(element.attr('target')).toEqual('_self');
        });

        it('Then href of the element should be defined ', function () {
            expect(element.attr('href')).toEqual(undefined );
        });
    })

    describe("When fxpLeftnavLink loaded with no item", () => {
        beforeEach(function () {            
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            $scope.$digest();
        })

        it('Then target of the element should be defined ', function () {
            expect(element.attr('target')).toEqual(undefined);
        });

        it('Then href of the element should be defined ', function () {
            expect(element.attr('href')).toEqual(undefined);
        });
    })

    describe("When clicked on leftnav item which have fxpLeftnavLink directive", () => {
        beforeEach(function () {           
            $scope.innerItem = {
                "id": "1",
                "businessProcessName": "FXP Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-dashboard",
                "tooltip": "Takes you to the dashboard defined for your persona",
                "targetUIStateName": "DashBoard",
                "openInline": true,
                "sortOrder": 1,
                "hasChildren": false
            };
            sessionStorage['alias-userInfo'] = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":1,"roleGroupName":"Resource"}';

            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            compiledelem.triggerHandler('click');
            $scope.$digest();
        })

        it('Then logMetric of fxplogger should have been called for LeftNavigationClickCountbyRole metric', function () {
            expect(fxplogger.logMetric).toHaveBeenCalledWith("Fxp.LeftnavLink", "LeftNavigationClickCountbyRole", 1, propBagValue);
        });

        it('Then logMetric of fxplogger should have been called for LeftNavigationClickCountbyRoleGroup metric', function () {
            expect(fxplogger.logMetric).toHaveBeenCalledWith("Fxp.LeftnavLink", "LeftNavigationClickCountbyRoleGroup", 1, propBagValue);
        });

        it('Then logEvent of fxplogger should have been called', function () {
            expect(fxplogger.logEvent).toHaveBeenCalledWith("Fxp.LeftnavLink", "LeftNavigationClick", propBagValue);
        });
    })

    describe("When clicked on leftnav item which have fxpLeftnavLink directive for obo user", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "1",
                "businessProcessName": "FXP Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-dashboard",
                "tooltip": "Takes you to the dashboard defined for your persona",
                "targetUIStateName": "DashBoard",
                "openInline": true,
                "sortOrder": 1,
                "hasChildren": false
            };
            sessionStorage['alias-userInfo'] = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":1,"roleGroupName":"Resource"}';
            $rootScope.actOnBehalfOfUserActive = true;
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            compiledelem.triggerHandler('click');
            $scope.$digest();
        })

        it('Then logMetric of fxplogger should have been called for LeftNavigationClickCountbyRole metric', function () {
            expect(fxplogger.logMetric).toHaveBeenCalledWith("Fxp.LeftnavLink", "LeftNavigationClickCountbyRole", 1, propBagValue);
        });

        it('Then logMetric of fxplogger should have been called for LeftNavigationClickCountbyRoleGroup metric', function () {
            expect(fxplogger.logMetric).toHaveBeenCalledWith("Fxp.LeftnavLink", "LeftNavigationClickCountbyRoleGroup", 1, propBagValue);
        });

        it('Then logEvent of fxplogger should have been called', function () {
            expect(fxplogger.logEvent).toHaveBeenCalledWith("Fxp.LeftnavLink", "LeftNavigationClick", propBagValue);
        });
    })

    describe("When clicked on leftnav item and it has targetEventName", () => {
        beforeEach(function () {
            $scope.innerItem = {
                "id": "201",
                "businessProcessName": "Profile",
                "displayName": "Overview",               
                "tooltip": "Click here to go to overview",
                "targetUIStateName": "oneprofile.profile.basic",
                "targetEventName":"getBasicProfileInformationRoute",
                "openInline": true,
                "sortOrder": 24              
            };            

            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            compiledelem.triggerHandler('click');
            $scope.$digest();
        })

        it('Then href of the element should not be defined ', function () {
            expect(element.attr('href')).toEqual(undefined);
        });     
    })

    describe("When clicked on leftnav item more than one time if it is in same state", () => {
        beforeEach(function () {            
            spyOn($state, 'reload');    
            $scope.innerItem = {
                "id": "1",
                "businessProcessName": "FXP Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-dashboard",
                "tooltip": "Takes you to the dashboard defined for your persona",
                "targetUIStateName": "DashBoard",
                "openInline": true,
                "sortOrder": 1,
                "hasChildren": false
            };
            $state.current.name = "DashBoard";
            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            compiledelem.triggerHandler('click');
            $scope.$digest();             
        })

        it('Then current state should be reloaded', function () {
            expect($state.reload).toHaveBeenCalled();
        });
    })

    describe("When clicked on leftnav item which have fxpLeftnavLink directive", () => {
        beforeEach(function () {
            $rootScope.fxpUIConstants = {
                "UIMessages": {
                    "StateChangeErrorDueToMissingModules": {
                        "ErrorMessageTitle": "Currently this functionality is not available. Please contact administrator if this happens frequently."
                    }
                }
            }

            $scope.innerItem = {
                "id": "1",
                "businessProcessName": "FXP Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-dashboard",
                "tooltip": "Takes you to the dashboard defined for your persona",
                "targetUIStateName": "DashBoard",
                "openInline": true,
                "sortOrder": 1,
                "hasChildren": false,
                "dependenciesMissing": true
            };
            sessionStorage['alias-userInfo'] = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":1,"roleGroupName":"Resource"}';

            element = angular.element('<a fxp-leftnav-link="{{innerItem}}"></a>');
            var compiledelem = $compile(element)($scope);
            compiledelem.triggerHandler('click');
            $scope.$digest();
        })
        
        it('Then logEvent of fxplogger should have been called', function () {
            expect(fxplogger.logEvent).toHaveBeenCalledWith('Fxp.LeftnavLink', 'LeftNavClickFailDueToMissingDependencies', propBagValue);
        });
    })

})