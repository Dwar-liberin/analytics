"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var EventType;
(function (EventType) {
    EventType["CLICK"] = "click";
    EventType["LOAD"] = "load";
    EventType["MARKER_SCANNED"] = "marker-scanned";
    EventType["MARKER_SESSION"] = "marker-session";
    EventType["QUERY_PARAM"] = "query-param";
})(EventType || (EventType = {}));
const queryKeys = ["shortCode", "ref"];
class Analytics {
    constructor({ appName, customerId, campaignName, serverUrl, }) {
        var _a;
        this.MAX_RETRY = 2;
        this.sessionStartTime = null;
        this.shortCode = (_a = new URLSearchParams(window.location.search).get("shortCode")) !== null && _a !== void 0 ? _a : "";
        this.appName = appName;
        this.customerId = customerId;
        this.campaignName = campaignName;
        this.analyticsServerUrl = serverUrl;
    }
    sendDataToAnalyticsServer(event, retries = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Analytics.active) {
                return false;
            }
            try {
                const body = {
                    appName: this.appName,
                    customerId: this.customerId,
                    campaignName: this.campaignName,
                    eventType: event.type,
                    eventTypeValue: event.payload,
                    shortCode: this.shortCode,
                };
                const serverResponse = yield fetch(this.analyticsServerUrl, {
                    method: "POST",
                    headers: new Headers({ "Content-Type": "application/json" }),
                    body: JSON.stringify(body),
                });
                if (serverResponse.ok) {
                    console.log("Server response send");
                    return true;
                }
            }
            catch (error) {
                if (retries < this.MAX_RETRY) {
                    console.log(`Error sending data to analytics server. Retrying... Attempt ${retries + 1}`);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.sendDataToAnalyticsServer(event, retries + 1);
                    }), 2000);
                }
                else {
                    console.error("Max retries reached. Unable to send data to analytics server.");
                }
            }
        });
    }
    trackPageLoad(event) {
        if (event.eventType === EventType.LOAD)
            this.sendDataToAnalyticsServer({
                type: event.eventType,
                payload: true,
            });
    }
    trackClick(event) {
        var _a;
        if (event.eventType === EventType.CLICK) {
            if (event.payload.length === 0) {
                event.payload = "click";
            }
            this.sendDataToAnalyticsServer({
                type: event.eventType,
                payload: (_a = event.payload) !== null && _a !== void 0 ? _a : "click",
            });
        }
    }
    trackMarkerScanned() {
        this.sessionStartTime = new Date();
        this.sendDataToAnalyticsServer({
            type: EventType.MARKER_SCANNED,
            payload: true,
        });
    }
    // trackMarkerSession() {
    //   const endTime = new Date();
    //   if (this.sessionStartTime) {
    //     const sessionTimeInMilliseconds =
    //       endTime.getTime() - this.sessionStartTime.getTime();
    //     const sessionTimeInSeconds = sessionTimeInMilliseconds / 1000;
    //     this.sendDataToAnalyticsServer({
    //       type: EventType.MARKER_SESSION,
    //       payload: sessionTimeInSeconds,
    //     });
    //   }
    // }
    getQueryParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        const searchParam = urlParams;
        searchParam.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }
    sendQueryParam() {
        const query = this.getQueryParam();
        for (let q in query) {
            const isValidQueryKey = queryKeys.includes(q);
            if (isValidQueryKey)
                this.sendDataToAnalyticsServer({
                    type: EventType.QUERY_PARAM,
                    payload: query[q],
                });
        }
    }
    sendEvent(eventType, payload) {
        const event = {
            eventType,
            payload,
        };
        this.sendDataToAnalyticsServer({
            type: event.eventType,
            payload: event.payload,
        });
    }
}
Analytics.active = true;
//# sourceMappingURL=script.js.map