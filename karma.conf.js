// Karma configuration https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-component/dist/angular-component.js',
      'node_modules/angular-mocks/angular-mocks.js',      
      'node_modules/@uirouter/angularjs/release/angular-ui-router.js',      
      'node_modules/angular-cookies/angular-cookies.js',
      'node_modules/moment/min/moment.min.js',
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js',
      'node_modules/angular-moment/angular-moment.min.js',
      'externalLibraries/adal.js',
      'node_modules/angular-base64/angular-base64.js',
      'node_modules/underscore/underscore-min.js',
      //'src/js/utils/systemDownOverlay.js',
      'src/UnitTests/*.ts'
    ],


    // list of files to exclude
    exclude: [
      'src/**/*.d.ts',
      'src/UnitTests/FxpRouteService.spec.ts',
      'src/UnitTests/GlobalExceptionHandler.spec.ts',
      'src/UnitTests/UserInfoService.spec.ts',
      //'src/UnitTests/sampleTest.spec.ts',
      'src/UnitTests/PersonalizationService.spec.ts',
      'src/UnitTests/LeftNavController.spec.ts',
      'src/UnitTests/OBOUserService.spec.ts',
      'src/UnitTests/AdminLandingService.spec.ts',
      'src/UnitTests/FxpAuthorizationService.spec.ts',
      'src/UnitTests/fxpboot.spec.ts',
      'src/UnitTests/AdalLoginHelperService.spec.ts',
      'src/UnitTests/FxpBreadcrumbService.spec.ts',      
      'src/UnitTests/FxpConfiguration.spec.ts',
      'src/UnitTests/FxpFeedbackService.spec.ts',
      'src/UnitTests/AppControllerHelper.spec.ts',
      'src/UnitTests/FxpMessageService.spec.ts',
      'src/UnitTests/FxpHTTPCorrelationInterceptorFactory.Spec.ts',
      'src/UnitTests/DashBoardController.spec.ts',
      'src/UnitTests/AuthorNotificationRoleGroupHelper.spec.ts',
      'src/UnitTests/AuthorNotificationController.spec.ts',
      'src/UnitTests/ActOnBehalfOfHelper.spec.ts',
      'src/UnitTests/ActOnBehalfOfController.spec.ts',
      'src/UnitTests/CreateAskOpsController.spec.ts',
      'src/UnitTests/DashBoardHelper.spec.ts',
      'src/UnitTests/DashboardService.spec.ts',
      'src/UnitTests/AppCntrl.spec.ts',
      'src/UnitTests/fxpBreadcrumbsLink.spec.ts',
      'src/UnitTests/fxpItems.directive.spec.ts',
      'src/UnitTests/fxpLeftnavLink.spec.ts',
      'src/UnitTests/FxpModalService.spec.ts',
      'src/UnitTests/FxpStorageService.spec.ts',
      'src/UnitTests/FxpToastNotificationService.spec.ts',
      'src/UnitTests/FxpUIDataFactory.spec.ts',
      'src/UnitTests/helpArticleImageController.spec.ts',
      'src/UnitTests/HelpCentralService.spec.ts',
      'src/UnitTests/HelpController.spec.ts',
      'src/UnitTests/leftNavPersonalizationController.spec.ts',
      'src/UnitTests/NotificationActionCenter.spec.ts',
      'src/UnitTests/NotificationController.spec.ts',
      'src/UnitTests/NotificationService.spec.ts',
      'src/UnitTests/NotificationStore.spec.ts',
      'src/UnitTests/pageTourEventService.spec.ts',
      'src/UnitTests/PlannedDownTimeService.spec.ts',
      'src/UnitTests/roleNavPersonalizationCtrl.spec.ts',
      'src/UnitTests/SettingsServiceProvider.spec.ts',
      'src/UnitTests/systemMessagesCtrl.spec.ts',
      'src/UnitTests/SystemMessagesService.spec.ts',
      'src/UnitTests/TelemetryContext.spec.ts',
      'src/UnitTests/TelemetryData.spec.ts',
      'src/UnitTests/toastNotificationController.spec.ts',
      'src/UnitTests/userLookupPersonalizationController.spec.ts',
      'src/UnitTests/UserProfileService.spec.ts',
      'src/UnitTests/FxpLogger.spec.ts',
      'src/UnitTests/FxpOnlineLogginStrategy.spec.ts',
      'src/UnitTests/FxpStateTransitionService.spec.ts',
      'src/UnitTests/PartnerAppRegistrationService.spec.ts'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/UnitTests/*.ts': ['webpack', 'sourcemap', 'coverage']
    },



    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'summary', 'kjhtml'],

    summaryReporter: {
      // 'failed', 'skipped' or 'all'
      show: 'all',
      // Limit the spec label to this length
      specLength: 50,
      overviewColumn: true
    },

    // https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
    coverageReporter: {
      reporters: [
        { type: 'html', dir: 'coverage/' },
        { type: 'cobertura', dir: 'coverage/' }
      ],

    },

    // the default configuration for junitReporter. Used for generating report on Build Server
    // https://github.com/karma-runner/karma-junit-reporter
    junitReporter: {
      outputDir: '', // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {} // key value pair of properties to add to the <properties> section of the report
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    browserNoActivityTimeout: 80000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: require('./webpack/webpack.config.test'),

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    client: {
      clearContext: false
    },

    plugins: [
      "karma-chrome-launcher",
      "karma-phantomjs-launcher",
      //"karma-firefox-launcher",
      //"karma-ie-launcher",
      "karma-jasmine",
      "karma-webpack",
      "karma-sourcemap-loader",
      "karma-summary-reporter",
      "karma-junit-reporter",
      "karma-jasmine-html-reporter",
      "karma-coverage"
    ]
  })
}
