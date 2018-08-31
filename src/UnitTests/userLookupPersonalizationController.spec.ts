import {UserLookupPersonalizationController} from '../js/controllers/userLookupPersonalizationController';
declare var angular:any;
describe('UserLookupPersonalizationController controller Test Suite', function () {
    var $scope;
    var $state;
    var $rootScope;
    var userProfileService;
    var personalizationService;
    var fxpLoggerService;
    var actOnBehalfOfHelper;
    var fxpConfigurationService;
    var userLookupPersonalizationController;
    var fxpContextService;
    var fxplogger;
    var $controller;
    var $log;
    var $q;
    var deferredflag = true;
    var nodata = true;
    var obodeferredflag = true;
    var witherrorcode = true;
    var errorCode = 404;
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module('FxPApp'));


    beforeEach(function () {
        var propBag = function () {
            return {
                addToBag: function (a, b) {
                    $log.log('propbag =>' + a + ':' + b);
                }
            };
        }
        angular.mock.module(function ($provide) {

            $provide.service("FxpLoggerService", function () {
                this.logInformation = function (a, b) {
                    $log.log(a + ':' + b);
                };
                this.logError = function (a, b) {
                    $log.log(a + ':' + b);
                };
                this.logMetric = function (a, b, c, d) {
                    $log.log(a + ' - ' + b + ' - ' + c + ' - ' + d);
                };
                this.createPropertyBag = function (a, b) {
                    return propBag();
                };
                this.logEvent = function (a) {
                    $log.log(a);
                }
                this.logWarning = function (a) {
                    $log.log(a);
                }
                this.logTrace = function (a) {
                    $log.log(a);
                };
                this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function () {
                    console.log('logPageLoadMetrics');
                });
            });


            $provide.service("FxpConfigurationService", function () {
                var appSettings = {
                }
                return fxpConfigurationService = appSettings;
            });
            $provide.service("ActOnBehalfOfHelper", function () {
                this.getPropBag = function () {
                    return propBag();
                }
                this.getMetricPropBag = function () {
                    return {};
                }
            });
            $provide.service("PersonalizationService", function () {
                this.setCurentPerssonalizationUser = function (user) {
                    return {};
                }
                this.getRoleGroup = jasmine.createSpy("getRoleGroup").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    data: {
                                        Id: 4
                                    }
                                }
                            );
                        }
                    }
                });
                this.removePersistedUserPersonalization = jasmine.createSpy("removePersistedUserPersonalization").and.callFake(function () {
                    console.log('removePersistedUserPersonalization: ' );
                });
                this.persistUserPersonalization = jasmine.createSpy("persistUserPersonalization").and.callFake(function (a, b) {
                    console.log('persistUserPersonalization: '+ a + ', '+ b);
                });
            });
            $provide.service("UserProfileService", function () {
                this.searchProfile = function (search, parent) {
                    var defer = $q.defer();
                    var res = { data: 'v-sekond' };
                    var emptyres = { data: { data: {} } };
                    var errwithcode = { status: errorCode };
                    var errwithoutcode = { status: 505 };
                    if (deferredflag) {
                        if (nodata)
                            defer.resolve(res);
                        else
                            defer.resolve(emptyres);
                    }
                    else {
                        if (witherrorcode)
                            defer.reject(errwithcode);
                        else
                            defer.reject(errwithoutcode);

                    }
                    return defer.promise;
                }

            });
            $provide.service("FxpContextService", function () {
                this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (a, b) {
                    console.log('saveContext: ' + a + '' + b);
                });
            });
            $provide.service("PageLoaderService", function () {
                this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function () {
                    console.log('hided');
                });
            });
        });

    });

    beforeEach(angular.mock.inject(function (_$state_, _$q_, _$rootScope_, _$log_, _$controller_, _UserProfileService_, _FxpLoggerService_, _ActOnBehalfOfHelper_, _FxpConfigurationService_, _PersonalizationService_, _FxpContextService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $state = _$state_;
        $q = _$q_;
        $log = _$log_;
        userProfileService = _UserProfileService_;
        fxplogger = _FxpLoggerService_;
        actOnBehalfOfHelper = _ActOnBehalfOfHelper_;
        fxpConfigurationService = _FxpConfigurationService_;
        personalizationService = _PersonalizationService_;
        fxpContextService = _FxpConfigurationService_;
    }));

    describe('When checked for UserLookupPersonalizationController methods', () => {
        beforeEach(() => {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            spyOn(fxplogger, 'logError').and.callThrough();
            spyOn(fxplogger, 'logInformation').and.callThrough();
            spyOn(fxplogger, 'logMetric').and.callThrough();
            $rootScope.fxpUIConstants = {
                UIMessages:
                {

                    GeneralExceptionError:
                    { ErrorMessage: 'System Error has occurred. Please try again. If the problem persists, please contact IT support.' },
                    UserProfileDoesNotExist:
                    { ErrorMessage: 'There are no profiles for the search criteria. Please enter a valid user name or alias to proceed.' },
                    UserProfileBusinessRoleIdErrorMessage:
                    { ErrorMessage: 'His profile is missing Business role association.' },
                    UserProfilePersonaIdErrorMessage: { ErrorMessage: 'This profile is missing Persona association.' }

                },
                UIStrings: {
                    AdminUIStrings: {
                        PersonalizeUserNavigation: "Personalize User Navigation",
                        InstructionalText: "Search for the user below whose navigation you would like to override.",
                        InstructionalTextPersonalizeScreen: "Use this screen to make changes to the user’s navigation by adding to or removing from the user navigation list.",
                        Placeholder: "Start typing user or alias",
                        Next: "Next"
                    }
                }
            };
            userLookupPersonalizationController = $controller('UserLookupPersonalizationController',
                {
                    $state: $state,
                    $rootScope: $rootScope,
                    $scope: $scope,
                    UserProfileService: userProfileService,
                    Fxplogger: fxplogger,
                    ActOnBehalfOfHelper: actOnBehalfOfHelper,
                    FxpConfigurationService: fxpConfigurationService,
                    PersonalizationService: personalizationService
                });
        });

        describe('When userLookupPersonalizationController loaded', () => {
            it('Then logPageLoadMetrics of fxpLoggerService should have been called', () => {
                expect(fxplogger.logPageLoadMetrics).toHaveBeenCalled();
            });
        });

        describe('When calling resetSelectedUser method', () => {
            it('Then it should clear the selected user', () => {
                userLookupPersonalizationController.resetSelectedUser();
                expect($scope.selectedUser).toEqual('');
                expect($scope.UserProfileDoesNotExist).toBeFalsy();
            });
        });

        describe('When calling searchUser method', () => {
            it('Then it should return the data for searching user', () => {
                var user = 'v-sekond';
                deferredflag = true;
                var response = userLookupPersonalizationController.searchUser(user);
                $scope.$apply();
                expect($scope.UserProfileDoesNotExist).toBeFalsy();
                expect($scope.errorMessage).toEqual('');
            });

            it('Then it should return the empty data list', () => {
                var user = 'sekond';
                deferredflag = true;
                nodata = false;
                var response = userLookupPersonalizationController.searchUser(user);
                $scope.$apply();
                expect($scope.userProfileDoesNotExist).toEqual(true);
                expect($scope.errorMessage).toEqual('There are no profiles for the search criteria. Please enter a valid user name or alias to proceed.');
            });
            it('Then it should not return the data for invalid search criteria', () => {
                var user = 'vabc';
                deferredflag = false;
                witherrorcode = true;
                errorCode = 404;
                var response = userLookupPersonalizationController.searchUser(user);
                $scope.$apply();
                expect($scope.selectedUser).toEqual('');
                expect($scope.errorMessage).toEqual($rootScope.fxpUIConstants.UIMessages.UserProfileDoesNotExist.ErrorMessage);
            });
            it('Then it should not return the data for Api Service Error', () => {
                var user = 'vrest';
                deferredflag = false;
                witherrorcode = true;
                errorCode = 505;
                var response = userLookupPersonalizationController.searchUser(user);
                console.log(response);
                $scope.$apply();
                expect($scope.selectedUser).toEqual('');
                expect($scope.errorMessage).toEqual('System Error has occurred. Please try again. If the problem persists, please contact IT support.');
            });

        });
        describe('When calling setSelectedUser method if we have the user RoleGroupID', () => {
            var object =
                { FirstName: 'Seetha', MiddleName: null, LastName: 'Ramulu Konda', FullName: 'Ramulu Konda', Alias: 'v-sekond', BusinessRole: 'Non Services User', BusinessRoleId: 59, CostCenterCode: '10130132 ', DisplayName: 'Seetha Ramulu Konda', Domain: 'corpnet', EmailName: 'v-sekond@microsoft.com', HiringDate: null, PersonnelNumber: 1005686, PreferredFirstName: null, ReportsTo: 'vemami', ResourceCategoryId: null, ResourceType: null, Seniority: null, StandardTitle: 'XR - MSR IT Operations', RoleGroupID: 5 }
            beforeEach(() => {
                userLookupPersonalizationController.setSelectedUser(object);
            })
            it('Then it should assign the selected user object to selectedUserObject in scope', () => {                
                expect($scope.selectedUserObject).toEqual(object);
            }); 
            it('Then $scope.isSelectedUserProfile value should be true', () => {
                expect($scope.isSelectedUserProfile).toEqual(true);
            });           
        });
        describe('When calling setSelectedUser method if we dont have the user RoleGroupID', () => {
            var object =
                { FirstName: 'Seetha', MiddleName: null, LastName: 'Ramulu Konda', FullName: 'Ramulu Konda', Alias: 'v-sekond', BusinessRole: 'Non Services User', BusinessRoleId: 59, CostCenterCode: '10130132 ', DisplayName: 'Seetha Ramulu Konda', Domain: 'corpnet', EmailName: 'v-sekond@microsoft.com', HiringDate: null, PersonnelNumber: 1005686, PreferredFirstName: null, ReportsTo: 'vemami', ResourceCategoryId: null, ResourceType: null, Seniority: null, StandardTitle: 'XR - MSR IT Operations' }            
            beforeEach(() => {                
                userLookupPersonalizationController.setSelectedUser(object);
            })
            it('Then it should not assign the selected user object to selectedUserObject in scope', () => {                
                expect($scope.selectedUserObject).toEqual({});
            });
            it('Then $scope.isSelectedUserProfile value should be false', () => {
                expect($scope.isSelectedUserProfile).toEqual(false);
            });
            it('Then logError of fxpLoggerService should have been called', () => {
                expect(fxplogger.logError).toHaveBeenCalled();
            });
        });
        describe('When calling navigateToPersonalizationView method', () => {
            var object =
                { FirstName: 'Seetha', MiddleName: null, LastName: 'Ramulu Konda', FullName: 'Ramulu Konda', Alias: 'v-sekond', BusinessRole: 'Non Services User', BusinessRoleId: 59, CostCenterCode: '10130132 ', DisplayName: 'Seetha Ramulu Konda', Domain: 'corpnet', EmailName: 'v-sekond@microsoft.com', HiringDate: null, PersonnelNumber: 1005686, PreferredFirstName: null, ReportsTo: 'vemami', ResourceCategoryId: null, ResourceType: null, Seniority: null, StandardTitle: 'XR - MSR IT Operations' }
            beforeEach(() => {
                userLookupPersonalizationController.setSelectedUser(object);
                $scope.selectedUserObject = object;
                userLookupPersonalizationController.navigateToPersonalizationView();
            })
            it('Then it should assign the selected user to setCurentPerssonalizationUser in personalizationService and navigate to personalize admin page ', () => {                                               
                expect(personalizationService.setCurentPerssonalizationUser).toBeDefined();
            });
            it('Then it should assign default roleGroup Id', () => {               
                expect($scope.selectedUserObject.RoleGroupID).toEqual(4);
            });
        });
        describe('When calling onUserChanged method', () => {
            beforeEach(() => {
                userLookupPersonalizationController.onUserChanged();
            })
            it('Then it should hide the error message', () => {               
                expect($scope.userProfileDoesNotExist).toEqual(false);
            });
        });       
    });
});