var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var EventType;
(function (EventType) {
    EventType["CLICK"] = "click";
    EventType["LOAD"] = "load";
    EventType["MARKER_SCANNED"] = "marker-scanned";
    EventType["MARKER_SESSION"] = "marker-session";
    EventType["BROWSER_INFO"] = "browser-info";
    EventType["DEVICE_INFO"] = "device-info";
    EventType["DEVICE_LOCATION"] = "device-location";
    EventType["QUERY_PARAM"] = "query-param";
})(EventType || (EventType = {}));
var Analytics = /** @class */ (function () {
    function Analytics(_a) {
        var appName = _a.appName, customerId = _a.customerId, campaignId = _a.campaignId, serverUrl = _a.serverUrl;
        this.MAX_RETRY = 3;
        this.sessionStartTime = null;
        this.appName = appName;
        this.customerId = customerId;
        this.campaignId = campaignId;
        this.analyticsServerUrl = serverUrl;
    }
    Analytics.prototype.sendDataToAnalyticsServer = function (event, retries) {
        if (retries === void 0) { retries = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var body, serverResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 6]);
                        body = {
                            appName: this.appName,
                            customerId: this.customerId,
                            campaignId: this.campaignId,
                            eventType: event.type,
                            value: event.payload,
                        };
                        return [4 /*yield*/, fetch(this.analyticsServerUrl, {
                                method: "POST",
                                mode: "no-cors",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json", // Specify JSON content type
                                },
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        serverResponse = _a.sent();
                        if (serverResponse.ok) {
                            console.log("Server response send");
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        error_1 = _a.sent();
                        if (!(retries < this.MAX_RETRY)) return [3 /*break*/, 4];
                        console.log("Error sending data to analytics server. Retrying... Attempt ".concat(retries + 1));
                        return [4 /*yield*/, this.sendDataToAnalyticsServer(event, retries + 1)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        console.error("Max retries reached. Unable to send data to analytics server.");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Analytics.prototype.trackPageLoad = function (event) {
        if (event.eventType === EventType.LOAD)
            this.sendDataToAnalyticsServer({
                type: event.eventType,
                payload: event.payload,
            });
    };
    Analytics.prototype.trackClick = function (event) {
        if (event.eventType === EventType.CLICK) {
            this.sendDataToAnalyticsServer({
                type: event.eventType,
                payload: event.payload,
            });
        }
    };
    Analytics.prototype.trackMarkerScanned = function () {
        this.sessionStartTime = new Date();
        this.sendDataToAnalyticsServer({
            type: EventType.MARKER_SCANNED,
            payload: "Scanned - ".concat(this.sessionStartTime.toUTCString()),
        });
    };
    Analytics.prototype.trackMarkerSession = function () {
        var endTime = new Date();
        if (this.sessionStartTime) {
            var sessionTimeInMilliseconds = endTime.getTime() - this.sessionStartTime.getTime();
            var sessionTimeInSeconds = sessionTimeInMilliseconds / 1000;
            this.sendDataToAnalyticsServer({
                type: EventType.MARKER_SESSION,
                payload: sessionTimeInSeconds,
            });
        }
    };
    Analytics.prototype.getDeviceInfo = function () {
        var userAgent = navigator.userAgent;
        if (userAgent.includes("Windows NT 10.0")) {
            return "Windows 10";
        }
        else if (userAgent.includes("Windows")) {
            return "Windows";
        }
        else if (userAgent.includes("Mac")) {
            return "MacOS";
        }
        else if (userAgent.includes("Linux")) {
            return "Linux";
        }
        else if (userAgent.includes("iPhone") ||
            userAgent.includes("iPad") ||
            userAgent.includes("iPod")) {
            return "iOS";
        }
        else if (userAgent.includes("Android")) {
            return "Android";
        }
        else {
            return "Unknown";
        }
    };
    Analytics.prototype.getBrowserInfo = function () {
        var browser = {
            name: "",
            version: "",
        };
        var userAgent = navigator.userAgent.toLowerCase();
        if (!userAgent)
            return "error";
        if (userAgent.indexOf("firefox") > -1) {
            browser.name = "Firefox";
            var match = userAgent.match(/firefox\/([\d.]+)/);
            if (match) {
                browser.version = match[1];
            }
        }
        else if (userAgent.indexOf("opera") > -1 ||
            userAgent.indexOf("opr") > -1) {
            browser.name = "Opera";
            var match = userAgent.match(/(?:opera|opr)[\s\/]([\d.]+)/);
            if (match) {
                browser.version = match[1];
            }
        }
        else if (userAgent.indexOf("chrome") > -1) {
            browser.name = "Chrome";
            var match = userAgent.match(/chrome\/([\d.]+)/);
            if (match) {
                browser.version = match[1];
            }
        }
        else if (userAgent.indexOf("safari") > -1) {
            browser.name = "Safari";
            var match = userAgent.match(/version\/([\d.]+)/);
            if (match) {
                browser.version = match[1];
            }
        }
        else if (userAgent.indexOf("msie") > -1 ||
            userAgent.indexOf("trident") > -1) {
            browser.name = "Internet Explorer";
            var match = userAgent.match(/(?:msie |rv:)(\d+(\.\d+)?)/);
            if (match) {
                browser.version = match[1];
            }
        }
        return "".concat(browser.name, " ").concat(browser.version);
    };
    Analytics.prototype.getLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                var latitude = position.coords.latitude;
                                var longitude = position.coords.longitude;
                                resolve({
                                    lat: latitude,
                                    lon: longitude,
                                });
                            }, function (error) {
                                console.error("Error getting location:", error);
                                reject("Location unavailable");
                            });
                        }
                        else {
                            console.error("Geolocation not supported by browser");
                            reject("Location unavailable");
                        }
                    })];
            });
        });
    };
    Analytics.prototype.getQueryParam = function () {
        var urlParams = new URLSearchParams(window.location.search);
        var params = {};
        var searchParam = urlParams;
        searchParam.forEach(function (value, key) {
            params[key] = value;
        });
        return params;
    };
    Analytics.prototype.sendQueryParam = function () {
        var query = this.getQueryParam();
        this.sendDataToAnalyticsServer({
            type: EventType.QUERY_PARAM,
            payload: query,
        });
    };
    Analytics.prototype.sendBrowserInfo = function () {
        var browserInfo = this.getBrowserInfo();
        this.sendDataToAnalyticsServer({
            type: EventType.BROWSER_INFO,
            payload: browserInfo,
        });
    };
    Analytics.prototype.sendDeviceInfo = function () {
        var deviceInfo = this.getDeviceInfo();
        this.sendDataToAnalyticsServer({
            type: EventType.DEVICE_INFO,
            payload: deviceInfo,
        });
    };
    Analytics.prototype.sendLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, lat, lon, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getLocation()];
                    case 1:
                        _a = _b.sent(), lat = _a.lat, lon = _a.lon;
                        this.sendDataToAnalyticsServer({
                            type: EventType.DEVICE_LOCATION,
                            payload: { lat: lat, lon: lon },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Analytics.prototype.sendEvent = function (eventType, payload) {
        var event = {
            eventType: eventType,
            payload: payload,
        };
        this.sendDataToAnalyticsServer({
            type: event.eventType,
            payload: event.payload,
        });
    };
    return Analytics;
}());
//
// const analytics = new Analytics({
//   appName: "Dwar",
//   campaignId: 23123,
//   customerId: 34234,
//   serverUrl: "https://google.com",
// });
// analytics.trackClick({
//   eventType:"click",
//   payload:""
// })
// analytics.getQueryParam();
