export var SnotifyAction;
(function (SnotifyAction) {
    SnotifyAction[SnotifyAction["onInit"] = 3] = "onInit";
    SnotifyAction[SnotifyAction["beforeDestroy"] = 0] = "beforeDestroy";
    SnotifyAction[SnotifyAction["afterDestroy"] = 1] = "afterDestroy";
    SnotifyAction[SnotifyAction["onClick"] = 10] = "onClick";
    SnotifyAction[SnotifyAction["onHoverEnter"] = 11] = "onHoverEnter";
    SnotifyAction[SnotifyAction["onHoverLeave"] = 12] = "onHoverLeave";
})(SnotifyAction || (SnotifyAction = {}));
