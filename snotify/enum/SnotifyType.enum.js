export var SnotifyType;
(function (SnotifyType) {
    SnotifyType[SnotifyType["SIMPLE"] = 0] = "SIMPLE";
    SnotifyType[SnotifyType["SUCCESS"] = 1] = "SUCCESS";
    SnotifyType[SnotifyType["ERROR"] = 2] = "ERROR";
    SnotifyType[SnotifyType["WARNING"] = 3] = "WARNING";
    SnotifyType[SnotifyType["INFO"] = 4] = "INFO";
    SnotifyType[SnotifyType["ASYNC"] = 5] = "ASYNC";
    SnotifyType[SnotifyType["CONFIRM"] = 6] = "CONFIRM";
    SnotifyType[SnotifyType["PROMPT"] = 7] = "PROMPT";
})(SnotifyType || (SnotifyType = {}));
