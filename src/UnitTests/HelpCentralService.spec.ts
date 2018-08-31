/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {HelpCentralService} from '../js/services/HelpCentralService';
window["tenantConfiguration"] = {
    "TenantId": "ES",
    "UIStrings": {
        "Domain": "Domain",
        "AppHeader": "Enterprise Services Experience - SIT",
        "AppHeaderAlias": "ES",
        "HelpCentralAppId": "esxp"
    }
};
declare var angular:any;
describe("Given HelpCentralService", () => {
    var $httpBackend, fxpConfigurationService, fxpDataService, helpCentralService;
    beforeEach(angular.mock.module('FxPApp'));

    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("FxpConfigurationService", function () {
                this.FxpAppSettings = {
                    "HelpCentralServiceEndpoint": "https://mockhelpcentralservice/",
                    "HelpCentralServiceAppId": "esxp"
                };
            });
            $provide.service("UserInfoService", function () {
                this.getCurrentUserData = jasmine.createSpy("getCurrentUserData").and.callFake(function () {
                    return {
                        roleGroupId: "2",
                        TenantName: "es",
                        fullName: "MyName"
                    }
                });
            });
            $provide.service("DeviceFactory", function () {
                this.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                    return false;
                });
            });
        })
    })

    beforeEach(angular.mock.inject(function (_$httpBackend_,FxpConfigurationService, UserInfoService, _HelpCentralService_) {
        $httpBackend = _$httpBackend_; 
        helpCentralService = _HelpCentralService_;
        fxpConfigurationService = FxpConfigurationService;
    }));

    describe("When getContextualHelpArticles is called", () => {
        var result = {};
        var articles = { "totalCount": 3, "pageCount": 0, "top": 3, "result": [{ "id": "1", "title": "df", "description": "sadf", "articleContent": null, "appId": "esxp" }, { "id": "2", "title": "ed", "description": "sad", "articleContent": null, "appId": "esxp" }, { "id": "3", "title": "rtfg", "description": "sdf", "articleContent": null, "appId": "esxp" }] };
        beforeEach(function () {
            $httpBackend.expectGET("https://mockhelpcentralservice/tenants/es/app/esxp/search?Filter=Meta_ViewPort:Desktop;Meta_RoleGroup:2;Meta_L0:100;&top=3&skip=0")
                .respond(200, articles);
            helpCentralService.getContextualHelpArticles(3,100,null).then(function (response) {
                result = response.data.result;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch the  Contextual Help Articles", function () {
            expect(result).toEqual(articles.result); 
        });
    });

    describe("When getContextualHelpArticleContent is called", () => {
        var result, article = { "id": null, "title": "df", "description": "sadf", "articleContent": "<p>dsf</p>", "appId": "ESXP" };
        beforeEach(function () { 
            $httpBackend.expectGET("https://mockhelpcentralservice/articles/1?tenantid=es&appid=esxp")
                .respond(200, article);
            helpCentralService.getContextualHelpArticleContent(1).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch the  Contextual Help Articles", function () {
            expect(result).toEqual(article);
        });
    });

	describe("When saveArticleFeedback is called to save hlep article feedback", () => {
		var result, feedback = { "id": "3caab4c5-934b-4bd9-a91c-b7b3758c36dd", isHelpFul: true };
		beforeEach(function () {
			$httpBackend.expectPOST("https://mockhelpcentralservice/article/feedback?tenantid=es&appid=esxp", feedback)
				.respond(200, "success");
			helpCentralService.saveArticleFeedback(feedback).then(function (response) {
				result = response;
			}).catch(function (ex) {
				result = ex;
			});
			$httpBackend.flush();
		});
		it("Then it should fetch the  Contextual Help Articles", function () {
			expect(result.status).toEqual(200);
		});
	});

	describe("When saveArticleViewCount is called to save help article view count", () => {
		var result;
		var articleId = "3caab4c5-934b-4bd9-a91c-b7b3758c36dd";
		beforeEach(function () {
			$httpBackend.expectPOST("https://mockhelpcentralservice/articles/3caab4c5-934b-4bd9-a91c-b7b3758c36dd/readhistory?tenantid=es&appid=esxp")
				.respond(200, "success");
			helpCentralService.saveArticleViewCount(articleId).then(function (response) {
				result = response;
			}).catch(function (ex) {
				result = ex;
			});
			$httpBackend.flush();
		});
		it("Then it should save the Article View Count", function () {
			expect(result.status).toEqual(200);
		});
	});
   
});