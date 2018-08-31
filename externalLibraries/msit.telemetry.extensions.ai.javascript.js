var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            (function (ItEventType) {
                ItEventType[ItEventType["FeatureUsageEvent"] = 0] = "FeatureUsageEvent";
                ItEventType[ItEventType["BusinessProcessEvent"] = 1] = "BusinessProcessEvent";
                ItEventType[ItEventType["BusinessEventMessageExchange"] = 2] = "BusinessEventMessageExchange";
                ItEventType[ItEventType["BusinessEventEntityUpdate"] = 3] = "BusinessEventEntityUpdate";
                ItEventType[ItEventType["BusinessEventDatabaseRecord"] = 4] = "BusinessEventDatabaseRecord";
                ItEventType[ItEventType["SystemEvent"] = 5] = "SystemEvent";
                ItEventType[ItEventType["Other"] = 6] = "Other";
            })(AI.ItEventType || (AI.ItEventType = {}));
            var ItEventType = AI.ItEventType;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            (function (ComponentType) {
                ComponentType[ComponentType["Web"] = 0] = "Web";
                ComponentType[ComponentType["SmartApp"] = 1] = "SmartApp";
                ComponentType[ComponentType["Device"] = 2] = "Device";
                ComponentType[ComponentType["BackgroundProcess"] = 3] = "BackgroundProcess";
                ComponentType[ComponentType["WebService"] = 4] = "WebService";
                ComponentType[ComponentType["Executable"] = 5] = "Executable";
                ComponentType[ComponentType["DynamicLinkLibrary"] = 6] = "DynamicLinkLibrary";
                ComponentType[ComponentType["JobService"] = 7] = "JobService";
                ComponentType[ComponentType["WorkflowComponent"] = 8] = "WorkflowComponent";
                ComponentType[ComponentType["DataStore"] = 9] = "DataStore";
                ComponentType[ComponentType["Other"] = 10] = "Other";
            })(AI.ComponentType || (AI.ComponentType = {}));
            var ComponentType = AI.ComponentType;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var BaseEvent = (function () {
                function BaseEvent() {
                }
                return BaseEvent;
            }());
            AI.BaseEvent = BaseEvent;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var BpmValidation = (function () {
                function BpmValidation(businessProcessName, partBValidation, properties) {
                    this.businessProcessName = businessProcessName;
                    this.partBValidation = partBValidation;
                    this.properties = properties;
                }
                Object.defineProperty(BpmValidation.prototype, "BusinessProcessName", {
                    get: function () {
                        return this.businessProcessName;
                    },
                    set: function (value) {
                        this.businessProcessName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BpmValidation.prototype, "PartBValidation", {
                    get: function () {
                        return this.partBValidation;
                    },
                    set: function (value) {
                        this.PartBValidation = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BpmValidation.prototype, "Properties", {
                    get: function () {
                        return this.properties;
                    },
                    set: function (values) {
                        this.properties = values;
                    },
                    enumerable: true,
                    configurable: true
                });
                return BpmValidation;
            }());
            AI.BpmValidation = BpmValidation;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var CorrelationConstants = (function () {
                function CorrelationConstants() {
                }
                CorrelationConstants.CorrelationHeaaderName = "X-CorrelationId";
                CorrelationConstants.CorrelationSchemaAttribute = "XCV";
                CorrelationConstants.SubCorrelationHeaderName = "Sub-CorrelationId";
                CorrelationConstants.SubCorrelationSchemaAttribute = "SubXCV";
                return CorrelationConstants;
            }());
            AI.CorrelationConstants = CorrelationConstants;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var EnvironmentValues = (function () {
                function EnvironmentValues(environmentName, serviceOffering, serviceLine, program, capability, componentName, ictoId) {
                    this.EnvironmetName = environmentName;
                    this.ServiceOffering = serviceOffering;
                    this.ServiceLine = serviceLine;
                    this.Program = program;
                    this.Capability = capability;
                    this.ComponentName = componentName;
                    this.IctoId = ictoId;
                }
                return EnvironmentValues;
            }());
            AI.EnvironmentValues = EnvironmentValues;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var ExtensionsConfig = (function () {
                function ExtensionsConfig() {
                }
                Object.defineProperty(ExtensionsConfig.prototype, "getBpmValidations", {
                    get: function () {
                        return this.bpmValidations;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionsConfig.prototype, "getEnableBpmValidation", {
                    get: function () {
                        return this.EnableBpmValidation;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionsConfig.prototype.ReadBpmValidation = function (bpmName) {
                    var defObject = null;
                    if (bpmName != null && typeof bpmName != 'undefined' && this['BpmValidations'] != null && this['BpmValidations'].length > 0) {
                        var bpmValidationsArray = this['BpmValidations'];
                        for (var index = 0; index < bpmValidationsArray.length; index++) {
                            if (bpmValidationsArray[index].BusinessProcessName == bpmName) {
                                return bpmValidationsArray[index];
                            }
                        }
                    }
                    return defObject;
                };
                return ExtensionsConfig;
            }());
            AI.ExtensionsConfig = ExtensionsConfig;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var FeatureUsageEvent = (function () {
                function FeatureUsageEvent(eventName, componentType, startDateTime, endDateTime) {
                    this.EventName = eventName;
                    this.ComponentType = componentType;
                    this.startDateTime = startDateTime;
                    this.endDateTime = endDateTime;
                }
                Object.defineProperty(FeatureUsageEvent.prototype, "EventName", {
                    get: function () {
                        return this.eventName;
                    },
                    set: function (value) {
                        this.eventName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "Duration", {
                    get: function () {
                        return this.duration;
                    },
                    set: function (value) {
                        this.duration = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "ComponentUri", {
                    get: function () {
                        return this.componentUri;
                    },
                    set: function (value) {
                        this.componentUri = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "EventType", {
                    get: function () {
                        return this.eventType;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "TemplateType", {
                    get: function () {
                        return "Internal.FeatureUsageEvent";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "ComponentType", {
                    get: function () {
                        return this.componentType;
                    },
                    set: function (value) {
                        this.componentType = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "Xcv", {
                    get: function () {
                        return this.xcv;
                    },
                    set: function (value) {
                        this.xcv = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "UserRoleName", {
                    get: function () {
                        return this.userRoleName;
                    },
                    set: function (value) {
                        this.userRoleName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "StartDateTime", {
                    get: function () {
                        return this.startDateTime;
                    },
                    set: function (value) {
                        this.startDateTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FeatureUsageEvent.prototype, "EndDateTime", {
                    get: function () {
                        return this.endDateTime;
                    },
                    set: function (value) {
                        this.endDateTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                FeatureUsageEvent.prototype.IsValidEvent = function () {
                    if (!this.eventName || 0 === this.eventName.length) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                return FeatureUsageEvent;
            }());
            AI.FeatureUsageEvent = FeatureUsageEvent;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var BusinessProcessEvent = (function () {
                function BusinessProcessEvent(businessProcessName, componentType, startDateTime, endDateTime, templateType) {
                    this.BusinessProcessName = businessProcessName;
                    this.eventName = businessProcessName;
                    this.ComponentType = componentType;
                    this.startDateTime = startDateTime;
                    this.endDateTime = endDateTime;
                    if (typeof this.templateType != 'undefined') {
                        this.templateType = templateType;
                    }
                    else {
                        this.templateType = "Internal.BusinessProcessEvent";
                    }
                }
                Object.defineProperty(BusinessProcessEvent.prototype, "BusinessProcessName", {
                    get: function () {
                        return this.businessProcessName;
                    },
                    set: function (value) {
                        this.businessProcessName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "TargetEntityKey", {
                    get: function () {
                        return this.targetEntityKey;
                    },
                    set: function (value) {
                        this.targetEntityKey = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "ActionUri", {
                    get: function () {
                        return this.actionUri;
                    },
                    set: function (value) {
                        this.actionUri = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "AppAction", {
                    get: function () {
                        return this.appAction;
                    },
                    set: function (value) {
                        this.appAction = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "EventType", {
                    get: function () {
                        return this.eventType;
                    },
                    set: function (value) {
                        this.eventType = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "TemplateType", {
                    get: function () {
                        return "Internal.BusinessProcessEvent";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "ComponentType", {
                    get: function () {
                        return this.componentType;
                    },
                    set: function (value) {
                        this.componentType = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "Xcv", {
                    get: function () {
                        return this.xcv;
                    },
                    set: function (value) {
                        this.xcv = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "UserRoleName", {
                    get: function () {
                        return this.userRoleName;
                    },
                    set: function (value) {
                        this.userRoleName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "StartDateTime", {
                    get: function () {
                        return this.startDateTime;
                    },
                    set: function (value) {
                        this.startDateTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "EndDateTime", {
                    get: function () {
                        return this.endDateTime;
                    },
                    set: function (value) {
                        this.endDateTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "EventName", {
                    get: function () {
                        return this.eventName;
                    },
                    set: function (value) {
                        this.eventName = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "SenderId", {
                    get: function () {
                        return this.senderId;
                    },
                    set: function (value) {
                        this.senderId = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "ReceiverId", {
                    get: function () {
                        return this.receiverId;
                    },
                    set: function (value) {
                        this.receiverId = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "MessageId", {
                    get: function () {
                        return this.messageId;
                    },
                    set: function (value) {
                        this.messageId = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BusinessProcessEvent.prototype, "EventOccurrenceTime", {
                    get: function () {
                        return this.eventOccurenceTime;
                    },
                    set: function (value) {
                        this.eventOccurenceTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                BusinessProcessEvent.prototype.IsValidEvent = function (isValid) {
                    if (!isValid) {
                        if (!this.businessProcessName || 0 === this.businessProcessName.length) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        return ((typeof this.appAction != "undefined" && 0 !== this.appAction.length) && (typeof this.businessProcessName != "undefined" && 0 !== this.businessProcessName.length) && (typeof this.receiverId != "undefined" && 0 !== this.receiverId.length) && (typeof this.senderId != "undefined" && 0 !== this.senderId.length) && (typeof this.eventOccurenceTime != "undefined"));
                    }
                };
                return BusinessProcessEvent;
            }());
            AI.BusinessProcessEvent = BusinessProcessEvent;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var SerializationHelper = (function () {
                function SerializationHelper() {
                }
                SerializationHelper.toInstance = function (obj, json) {
                    var jsonObj = JSON.parse(json);
                    if (typeof obj["fromJSON"] === "function") {
                        obj["fromJSON"](jsonObj);
                    }
                    else {
                        for (var propName in jsonObj) {
                            obj[propName] = jsonObj[propName];
                        }
                    }
                    return obj;
                };
                return SerializationHelper;
            }());
            AI.SerializationHelper = SerializationHelper;
            var ItTelemetryConfiguration = (function (_super) {
                __extends(ItTelemetryConfiguration, _super);
                function ItTelemetryConfiguration() {
                    _super.apply(this, arguments);
                }
                ItTelemetryConfiguration.prototype.IsJsonString = function (str) {
                    try {
                        JSON.parse(str);
                    }
                    catch (e) {
                        return false;
                    }
                    return true;
                };
                ItTelemetryConfiguration.prototype.Initialize = function (ECObject) {
                    this.active = SerializationHelper.toInstance(new AI.ExtensionsConfig(), ECObject);
                };
                Object.defineProperty(ItTelemetryConfiguration.prototype, "getActive", {
                    get: function () {
                        return this.active;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ItTelemetryConfiguration.prototype, "getBpmValidations", {
                    get: function () {
                        return this.getActive.BpmValidations;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ItTelemetryConfiguration.prototype, "getEnableBpmValidation", {
                    get: function () {
                        return this.getActive.EnableBpmValidation;
                    },
                    enumerable: true,
                    configurable: true
                });
                ItTelemetryConfiguration.prototype.ReadBpmValidation = function (bpmName) {
                    var defObject = null;
                    if (bpmName != null && typeof bpmName != 'undefined' && this.getBpmValidations != null && this.getBpmValidations.length > 0) {
                        var bpmValidationsArray = this.getBpmValidations;
                        for (var index = 0; index < bpmValidationsArray.length; index++) {
                            if (bpmValidationsArray[index].BusinessProcessName == bpmName) {
                                return bpmValidationsArray[index];
                            }
                        }
                    }
                    return defObject;
                };
                return ItTelemetryConfiguration;
            }(SerializationHelper));
            AI.ItTelemetryConfiguration = ItTelemetryConfiguration;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            var SystemEvent = (function (_super) {
                __extends(SystemEvent, _super);
                function SystemEvent(businessProcessName, componentType, systemMessage) {
                    _super.call(this, businessProcessName, componentType, null, null);
                    this.systemMessage = systemMessage;
                    this.EventType = AI.ItEventType.SystemEvent;
                }
                Object.defineProperty(SystemEvent.prototype, "SystemMessage", {
                    get: function () {
                        return this.systemMessage;
                    },
                    set: function (value) {
                        this.systemMessage = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SystemEvent;
            }(AI.BusinessProcessEvent));
            AI.SystemEvent = SystemEvent;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));
function getISO8601String(givenDate) {
    var dateString = givenDate.toISOString();
    var dateWithoutZulu = dateString.substring(0, dateString.length - 1);
    function z(n) { return (n < 10 ? '0' : '') + n; }
    var offset = new Date().getTimezoneOffset();
    var sign = offset < 0 ? '+' : '-';
    offset = Math.abs(offset);
    return dateWithoutZulu + sign + z(offset / 60 | 0) + z(offset % 60);
}
var Telemetry;
(function (Telemetry) {
    var Extensions;
    (function (Extensions) {
        var AI;
        (function (AI) {
            "use strict";
            AI.ExtensionVersion = "javascript:2.4.2-Build5026";
            var AppInsights = (function () {
                function AppInsights() {
                }
                AppInsights.prototype.TrackFeatureUsageEvent = function (appInsights, eventData, properties, measurements) {
                    if (typeof window !== "undefined" && typeof JSON !== "undefined" && appInsights != null && eventData != null) {
                        var isTrackable = this.isValidEvent(eventData, properties);
                        if (isTrackable) {
                            properties = this.BuildFeatureEventProperties(eventData, properties);
                            appInsights.trackEvent(eventData.EventName, properties, measurements);
                        }
                        else {
                            throw "One or more attributes in the in the event Feature Usage Event are not valid";
                        }
                    }
                };
                AppInsights.prototype.TrackBusinessProcessEvent = function (appInsights, eventData, properties, measurements) {
                    if (typeof appInsights !== "undefined" && typeof JSON !== "undefined" && appInsights != null && eventData != null) {
                        var isTrackable = this.isValidEvent(eventData, properties);
                        if (isTrackable) {
                            properties = this.BuildBusinessEventProperties(eventData, properties);
                            appInsights.trackEvent(eventData.BusinessProcessName, properties, measurements);
                        }
                        else {
                            throw "One or more attributes in the event Business Process Event are not valid";
                        }
                    }
                };
                AppInsights.prototype.TrackSystemEvent = function (appInsights, eventData, properties, measurements) {
                    if (typeof appInsights !== "undefined" && typeof JSON !== "undefined" && appInsights != null && eventData != null) {
                        var isTrackable = this.isValidEvent(eventData, properties);
                        if (isTrackable) {
                            properties = this.BuildSystemEventProperties(eventData, properties);
                            appInsights.trackEvent(eventData.BusinessProcessName, properties, measurements);
                        }
                        else {
                            throw "One or more attributes in the event System Event are not valid";
                        }
                    }
                };
                AppInsights.prototype.AddMsitTelemetryInitializers = function (appInsights, environmentData, correlationProvider) {
                    var _this = this;
                    appInsights.context.addTelemetryInitializer(function (envelope) {
                        _this.correlationProvider = correlationProvider;
                        var telemetryItem = envelope.data.baseData;
                        telemetryItem.properties = telemetryItem.properties || {};
                        telemetryItem.properties["AiAppKey"] = appInsights.config.instrumentationKey;
                        if (environmentData != null) {
                            telemetryItem.properties["EnvironmentName"] = environmentData.EnvironmetName == null ? "" : environmentData.EnvironmetName;
                            telemetryItem.properties["ServiceOffering"] = environmentData.ServiceOffering == null ? "" : environmentData.ServiceOffering;
                            telemetryItem.properties["ServiceLine"] = environmentData.ServiceLine == null ? "" : environmentData.ServiceLine;
                            telemetryItem.properties["Program"] = environmentData.Program == null ? "" : environmentData.Program;
                            telemetryItem.properties["Capability"] = environmentData.Capability == null ? "" : environmentData.Capability;
                            telemetryItem.properties["ComponentName"] = environmentData.ComponentName == null ? "" : environmentData.ComponentName;
                            telemetryItem.properties["IctoId"] = environmentData.IctoId == null ? "" : environmentData.IctoId;
                            telemetryItem.properties["ItExtVersion"] = AI.ExtensionVersion;
                        }
                        var correlationId = "";
                        if (_this.correlationProvider != null)
                            correlationId = correlationProvider();
                        if (correlationId != null && correlationId !== "") {
                            telemetryItem.properties["XCV"] = correlationId;
                        }
                    });
                };
                AppInsights.prototype.AddMsitTelemetryInitializerswithSubCorrelation = function (appInsights, environmentData, correlationProvider, subCorrelationProvider) {
                    var _this = this;
                    appInsights.context.addTelemetryInitializer(function (envelope) {
                        _this.correlationProvider = correlationProvider;
                        var telemetryItem = envelope.data.baseData;
                        telemetryItem.properties = telemetryItem.properties || {};
                        telemetryItem.properties["AiAppKey"] = appInsights.config.instrumentationKey;
                        if (environmentData != null) {
                            telemetryItem.properties["EnvironmentName"] = environmentData.EnvironmetName == null ? "" : environmentData.EnvironmetName;
                            telemetryItem.properties["ServiceOffering"] = environmentData.ServiceOffering == null ? "" : environmentData.ServiceOffering;
                            telemetryItem.properties["ServiceLine"] = environmentData.ServiceLine == null ? "" : environmentData.ServiceLine;
                            telemetryItem.properties["Program"] = environmentData.Program == null ? "" : environmentData.Program;
                            telemetryItem.properties["Capability"] = environmentData.Capability == null ? "" : environmentData.Capability;
                            telemetryItem.properties["ComponentName"] = environmentData.ComponentName == null ? "" : environmentData.ComponentName;
                            telemetryItem.properties["ItExtVersion"] = AI.ExtensionVersion;
                        }
                        var correlationId = "";
                        if (_this.correlationProvider != null)
                            correlationId = correlationProvider();
                        if (correlationId != null && correlationId !== "") {
                            telemetryItem.properties["XCV"] = correlationId;
                        }
                        var subcorrelationId = "";
                        if (_this.subCorrelationProvider != null)
                            correlationId = subCorrelationProvider();
                        if (subcorrelationId != null && subcorrelationId !== "") {
                            telemetryItem.properties["SubXCV"] = subcorrelationId;
                        }
                    });
                };
                AppInsights.prototype.BuildFeatureEventProperties = function (eventData, properties) {
                    var eventProperties;
                    eventProperties = properties || {};
                    eventProperties["ComponentUri"] = eventData.ComponentUri === undefined ? "" : eventData.ComponentUri;
                    eventProperties["Duration "] = eventData.Duration === undefined ? null : eventData.Duration;
                    eventProperties["ComponentType"] = (eventData.ComponentType !== undefined && eventData.ComponentType != null) ? AI.ComponentType[eventData.ComponentType].toString() : "";
                    eventProperties["UserRoleName"] = eventData.UserRoleName === undefined ? "" : eventData.UserRoleName;
                    eventProperties["XCV"] = eventData.Xcv === undefined ? "" : eventData.Xcv;
                    eventProperties["EventType"] = eventData.EventType !== undefined && eventData.EventType != null ? AI.ItEventType[eventData.EventType].toString() : "";
                    eventProperties["StartDateTime"] = eventData.StartDateTime === undefined || eventData.StartDateTime === null ? "" : eventData.StartDateTime.toUTCString();
                    eventProperties["EndDateTime"] = eventData.EndDateTime === undefined || eventData.EndDateTime === null ? "" : eventData.EndDateTime.toUTCString();
                    eventProperties["TemplateType"] = eventData.TemplateType === undefined || eventData.TemplateType === null ? "" : eventData.TemplateType;
                    eventProperties["MsitPartB"] = "true";
                    return eventProperties;
                };
                AppInsights.prototype.BuildBusinessEventProperties = function (eventData, properties) {
                    var eventProperties;
                    eventProperties = properties || {};
                    eventProperties["ActionUri"] = eventData.ActionUri === undefined ? "" : eventData.ActionUri;
                    eventProperties["AppAction"] = eventData.AppAction === undefined ? "" : eventData.AppAction;
                    eventProperties["ComponentType"] = (eventData.ComponentType !== undefined && eventData.ComponentType != null) ? AI.ComponentType[eventData.ComponentType].toString() : "";
                    eventProperties["TargetEntityKey"] = eventData.TargetEntityKey === undefined ? "" : eventData.TargetEntityKey;
                    eventProperties["UserRoleName"] = eventData.UserRoleName === undefined ? "" : eventData.UserRoleName;
                    eventProperties["XCV"] = eventData.Xcv === undefined ? "" : eventData.Xcv;
                    eventProperties["EventType"] = eventData.EventType !== undefined && eventData.EventType != null ? AI.ItEventType[eventData.EventType].toString() : "";
                    eventProperties["StartDateTime"] = eventData.StartDateTime === undefined || eventData.StartDateTime === null ? "" : eventData.StartDateTime.toUTCString();
                    eventProperties["EndDateTime"] = eventData.EndDateTime === undefined || eventData.EndDateTime === null ? "" : eventData.EndDateTime.toUTCString();
                    eventProperties["SenderId"] = eventData.SenderId === undefined ? "" : eventData.SenderId;
                    eventProperties["RecieverId"] = eventData.ReceiverId === undefined ? "" : eventData.ReceiverId;
                    eventProperties["MessageId"] = eventData.MessageId === undefined ? "" : eventData.MessageId;
                    eventProperties["EventOccurrenceTime"] = eventData.EventOccurrenceTime === undefined || eventData.EventOccurrenceTime === null || isNaN(eventData.EventOccurrenceTime.getDate()) ? "" : getISO8601String(new Date(eventData.EventOccurrenceTime.toString()));
                    eventProperties["BusinessProcessName"] = eventData.BusinessProcessName === undefined ? "" : eventData.BusinessProcessName;
                    eventProperties["TemplateType"] = eventData.TemplateType === undefined || eventData.TemplateType === null ? "" : eventData.TemplateType;
                    eventProperties["MsitPartB"] = "true";
                    return eventProperties;
                };
                AppInsights.prototype.BuildSystemEventProperties = function (eventData, properties) {
                    var eventProperties;
                    eventProperties = properties || {};
                    eventProperties["ActionUri"] = eventData.ActionUri === undefined ? "" : eventData.ActionUri;
                    eventProperties["AppAction"] = eventData.AppAction === undefined ? "" : eventData.AppAction;
                    eventProperties["ComponentType"] = (eventData.ComponentType !== undefined && eventData.ComponentType != null) ? AI.ComponentType[eventData.ComponentType].toString() : "";
                    eventProperties["TargetEntityKey"] = eventData.TargetEntityKey === undefined ? "" : eventData.TargetEntityKey;
                    eventProperties["UserRoleName"] = eventData.UserRoleName === undefined ? "" : eventData.UserRoleName;
                    eventProperties["XCV"] = eventData.Xcv === undefined ? "" : eventData.Xcv;
                    eventProperties["EventType"] = eventData.EventType !== undefined && eventData.EventType != null ? AI.ItEventType[eventData.EventType].toString() : "";
                    eventProperties["StartDateTime"] = eventData.StartDateTime === undefined || eventData.StartDateTime === null ? "" : eventData.StartDateTime.toUTCString();
                    eventProperties["EndDateTime"] = eventData.EndDateTime === undefined || eventData.EndDateTime === null ? "" : eventData.EndDateTime.toUTCString();
                    eventProperties["SenderId"] = eventData.SenderId === undefined ? "" : eventData.SenderId;
                    eventProperties["RecieverId"] = eventData.ReceiverId === undefined ? "" : eventData.ReceiverId;
                    eventProperties["MessageId"] = eventData.MessageId === undefined ? "" : eventData.MessageId;
                    eventProperties["EventOccurrenceTime"] = eventData.EventOccurrenceTime === undefined || eventData.EventOccurrenceTime === null || isNaN(eventData.EventOccurrenceTime.getDate()) ? "" : getISO8601String(new Date(eventData.EventOccurrenceTime.toString()));
                    eventProperties["BusinessProcessName"] = eventData.BusinessProcessName === undefined ? "" : eventData.BusinessProcessName;
                    eventProperties["SystemMessage"] = eventData.SystemMessage === undefined || eventData.SystemMessage === null ? "" : eventData.SystemMessage;
                    eventProperties["TemplateType"] = eventData.TemplateType === undefined || eventData.TemplateType === null ? "" : eventData.TemplateType;
                    eventProperties["MsitPartB"] = "true";
                    return eventProperties;
                };
                AppInsights.prototype.isValidEvent = function (eventData, properties) {
                    var config = this.ItTelemetryConfig;
                    var isTrackable = eventData.IsValidEvent(false);
                    if (config !== null && config !== undefined && config.active.EnableBpmValidation) {
                        var bpmSpecificConfig = config.active.ReadBpmValidation(eventData.EventName);
                        if (bpmSpecificConfig == null) {
                            return isTrackable;
                        }
                        if (bpmSpecificConfig.PartBValidation) {
                            isTrackable = eventData.IsValidEvent(bpmSpecificConfig.PartBValidation);
                        }
                        if (bpmSpecificConfig.Properties != null) {
                            var keys = Object.keys(properties);
                            var bpmPropertiesLocal = bpmSpecificConfig.Properties;
                            var numberOfPropertiesFound = 0;
                            for (var index = 0; index < bpmPropertiesLocal.length; index++) {
                                var item = bpmPropertiesLocal[index];
                                var check = keys.indexOf(item);
                                if (check >= 0) {
                                    if (typeof properties[item] != 'undefined') {
                                        numberOfPropertiesFound += 1;
                                    }
                                    else {
                                        isTrackable = false;
                                        break;
                                    }
                                }
                            }
                            if (numberOfPropertiesFound == bpmPropertiesLocal.length && isTrackable != false) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    else {
                        return isTrackable;
                    }
                };
                return AppInsights;
            }());
            AI.AppInsights = AppInsights;
        })(AI = Extensions.AI || (Extensions.AI = {}));
    })(Extensions = Telemetry.Extensions || (Telemetry.Extensions = {}));
})(Telemetry || (Telemetry = {}));

