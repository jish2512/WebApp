import {FxpUIData} from '../js/factory/FxpUIDataFactory';
declare var angular:any;
describe("Given FxpUIDataFactory suite", function () {
    var fxpUIData, rootScope, fxpFeedbackService;
    beforeEach(angular.mock.module('FxPApp'));

    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("FxpFeedbackService", function () {
                this.setScreenRoute = jasmine.createSpy("setScreenRoute").and.callFake(function (a) {
                    console.log(a);
                });
                this.setBrowserTitle = jasmine.createSpy("setBrowserTitle").and.callFake(function (a) {
                    console.log(a);
                });
            });
        });
    });

    beforeEach(angular.mock.inject(function (_FxpUIData_, _$rootScope_, FxpFeedbackService) {
        fxpUIData = _FxpUIData_;
        rootScope = _$rootScope_;
        fxpFeedbackService = fxpFeedbackService;
    }));
    describe("When we have getHeaderText of FXPUIDataFactory", function () {
        var result;
        beforeEach(function () {
            fxpUIData.setHeaderText("HeaderText");
            result = fxpUIData.getHeaderText();
        })
        it("Then it should return HeaderText on getHeaderText call", function () {
            expect(result).toBeDefined();
            expect(result).toEqual("HeaderText");
        });
    });
    describe("When we set null in Header Text Of FXPUIDataFactory", function () {
        var result;
        beforeEach(function () {
            fxpUIData.setHeaderText(null);
            result = fxpUIData.getHeaderText();
        })
        it("Then it should return null on getHeaderText call", function () {
            expect(result).toBeNull();
            expect(fxpUIData.HeaderText).not.toEqual("HeaderText");
        });
    });

    describe("When we have setHeaderText of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpUIData.setHeaderText("HeaderText");
        })
        it("Then it should set HeaderText on setHeaderText call", function () {

            expect(fxpUIData.headerText).not.toBeNull();
            expect(fxpUIData.headerText).toEqual("HeaderText");
        });

        it("Then it should broadcast AppHeaderChanged with Header Text", function () {
            expect(rootScope.$broadcast).toHaveBeenCalledWith("AppHeaderChanged", 'HeaderText');
        });

    });

    describe("When we set null in setHeaderText of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpUIData.setHeaderText(null);
        })
        it("Then should broadcast AppHeaderChanged with null HeaderText", function () {
            expect(fxpUIData.headerText).toBeNull();
            expect(rootScope.$broadcast).toHaveBeenCalledWith("AppHeaderChanged", null);
        });
    });

    describe("When we have getPageTitle of FXPUIDataFactory", function () {
        var result;
        beforeEach(function () {
            fxpUIData.setPageTitle("Page Title");
            result = fxpUIData.getPageTitle();
        })
        it("Then getPageTitle should return value set on setPageTitle", function () {
            expect(result).toBeDefined();
            expect(result).toEqual("Page Title");
        });
    });

    describe("When we set Title Page null in setPageTitle of FXPUIDataFactory", function () {
        var result;
        beforeEach(function () {
            fxpUIData.setPageTitle(null);
            result = fxpUIData.getPageTitle();
        })
        it("Then it should return Title page is null on getPageTitle call", function () {
            expect(result).toBeNull();
            expect(result).not.toEqual("HeaderText");
        });
    });

    describe("When we have setPageTitle of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpUIData.setPageTitle("PageTitle");
        })
        it("Then it should set Page Title on setPageTitle call", function () {
            expect(fxpUIData.pageTitle).not.toBeNull();
            expect(fxpUIData.pageTitle).toEqual("PageTitle");
        });

        it("Then it should broadcast PageTitleChanged with Page Title", function () {
            expect(rootScope.$broadcast).toHaveBeenCalledWith("PageTitleChanged", 'PageTitle');
        });

    });

    describe("When we set null in setPageTitle of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpUIData.setPageTitle(null);
        })
        it("Then it should broadcast PageTitleChanged with null PageTitle", function () {
            expect(fxpUIData.pageTitle).toBeNull();
            expect(rootScope.$broadcast).toHaveBeenCalledWith("PageTitleChanged", null);
        });

    });

    describe("When we call from setPageTitleFromRoute of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(fxpUIData, 'setPageTitle');;
            var toState = {
                name: "DashBoard",
                params: {
                    pageTitle: "GrmDashboard"
                }
            };
            fxpUIData.setPageTitleFromRoute(toState);
        })
        it("Then it should set page title to setPageTitle method", function () {
            expect(fxpUIData.setPageTitle).toHaveBeenCalledWith("GrmDashboard");
        });
    });

    describe("When we call from setPageTitleFromRoute parms with null of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(fxpUIData, 'setPageTitle');
            var toState = {
                name: "DashBoard",
                params: {
                    pageTitle: null
                }
            };
            fxpUIData.setPageTitleFromRoute(toState);
        })
        it("Then it setPageTitle method should not have been called", function () {
            expect(fxpUIData.setPageTitle).toHaveBeenCalledWith("");
        });
    });

    describe("When we call from setAppHeaderFromRoute of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(fxpUIData, 'setHeaderText');
            var toState = {
                name: "DashBoard",
                params: {
                    headerName: "GrmDashboard"
                }
            };
            fxpUIData.setAppHeaderFromRoute(toState);
        })
        it("Then it should set page title to setPageTitle method", function () {
            expect(fxpUIData.setHeaderText).toHaveBeenCalledWith("GrmDashboard");
        });
    });

    describe("When we call from setAppHeaderFromRoute parms with null of FXPUIDataFactory", function () {
        beforeEach(function () {
            spyOn(fxpUIData, 'setHeaderText');
            var toState = {
                name: "DashBoard",
                params: {
                    headerName: null
                }
            };
            fxpUIData.setAppHeaderFromRoute(toState);
        })
        it("Then setHeaderText method should have been called", function () {
            expect(fxpUIData.setHeaderText).toHaveBeenCalledWith("");
        });
    });

    describe("When we call from setPageTitleFromRoute parms with Data of FXPUIDataFactory and call fxpFeedbackService", function () {
        beforeEach(function () {
            spyOn(fxpUIData, 'setPageTitle');
            var toState = {
                name: "GrmDashboard",
                params: {
                    pageTitle: "TamDashBoard"
                }
            };
            fxpUIData.setPageTitleFromRoute(toState);
        })
        it("Then it should set page title default  to setPageTitle method", function () {
            expect(fxpUIData.fxpFeedbackService.setScreenRoute).toHaveBeenCalledWith("GrmDashboard");
        });

        it("Then it should set page title default  to setPageTitle method", function () {
            expect(fxpUIData.fxpFeedbackService.setBrowserTitle).toHaveBeenCalledWith("TamDashBoard");
        });
    });

    describe("When we call from setPageTitleFromRoute parms with null of FXPUIDataFactory and call fxpFeedbackService", function () {
        beforeEach(function () {
            spyOn(fxpUIData, 'setPageTitle');
            var toState = {
                name: null,
                params: {
                    pageTitle: null
                }
            };
            fxpUIData.setPageTitleFromRoute(toState);
        })
        it("Then it should set page title default  to setPageTitle method", function () {
            expect(fxpUIData.fxpFeedbackService.setScreenRoute).toHaveBeenCalledWith(null);
        });

        it("Then setBrowserTitle method should not have been called", function () {
            expect(fxpUIData.fxpFeedbackService.setBrowserTitle).toHaveBeenCalledWith("");
        });
    });

});
