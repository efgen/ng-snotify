(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/Subject'), require('rxjs/observable/PromiseObservable')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/Subject', 'rxjs/observable/PromiseObservable'], factory) :
	(factory((global['ng-snotify'] = global['ng-snotify'] || {}),global._angular_core,global._angular_common,global.rxjs_Subject,global.rxjs_observable_PromiseObservable));
}(this, (function (exports,_angular_core,_angular_common,rxjs_Subject,rxjs_observable_PromiseObservable) { 'use strict';

/**
 * Toast main model
 */
var SnotifyToast = (function () {
    function SnotifyToast(id, title, body, config) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.config = config;
    }
    return SnotifyToast;
}());

(function (SnotifyType) {
    SnotifyType[SnotifyType["SIMPLE"] = 0] = "SIMPLE";
    SnotifyType[SnotifyType["SUCCESS"] = 1] = "SUCCESS";
    SnotifyType[SnotifyType["ERROR"] = 2] = "ERROR";
    SnotifyType[SnotifyType["WARNING"] = 3] = "WARNING";
    SnotifyType[SnotifyType["INFO"] = 4] = "INFO";
    SnotifyType[SnotifyType["ASYNC"] = 5] = "ASYNC";
    SnotifyType[SnotifyType["CONFIRM"] = 6] = "CONFIRM";
    SnotifyType[SnotifyType["PROMPT"] = 7] = "PROMPT";
})(exports.SnotifyType || (exports.SnotifyType = {}));

(function (SnotifyPosition) {
    SnotifyPosition[SnotifyPosition["left_top"] = 0] = "left_top";
    SnotifyPosition[SnotifyPosition["left_center"] = 1] = "left_center";
    SnotifyPosition[SnotifyPosition["left_bottom"] = 2] = "left_bottom";
    SnotifyPosition[SnotifyPosition["right_top"] = 3] = "right_top";
    SnotifyPosition[SnotifyPosition["right_center"] = 4] = "right_center";
    SnotifyPosition[SnotifyPosition["right_bottom"] = 5] = "right_bottom";
    SnotifyPosition[SnotifyPosition["center_top"] = 6] = "center_top";
    SnotifyPosition[SnotifyPosition["center_center"] = 7] = "center_center";
    SnotifyPosition[SnotifyPosition["center_bottom"] = 8] = "center_bottom";
})(exports.SnotifyPosition || (exports.SnotifyPosition = {}));

(function (SnotifyAction) {
    SnotifyAction[SnotifyAction["onInit"] = 3] = "onInit";
    SnotifyAction[SnotifyAction["beforeDestroy"] = 0] = "beforeDestroy";
    SnotifyAction[SnotifyAction["afterDestroy"] = 1] = "afterDestroy";
    SnotifyAction[SnotifyAction["onClick"] = 10] = "onClick";
    SnotifyAction[SnotifyAction["onHoverEnter"] = 11] = "onHoverEnter";
    SnotifyAction[SnotifyAction["onHoverLeave"] = 12] = "onHoverLeave";
})(exports.SnotifyAction || (exports.SnotifyAction = {}));

/**
 * SnotifyService - create, remove, config toasts
 */
var SnotifyService = (function () {
    /**
     * Constructor - initialize base configuration objects
     */
    function SnotifyService() {
        this.emitter = new rxjs_Subject.Subject();
        this.lifecycle = new rxjs_Subject.Subject();
        this.optionsChanged = new rxjs_Subject.Subject();
        this.toastChanged = new rxjs_Subject.Subject();
        this.toastDeleted = new rxjs_Subject.Subject();
        this.notifications = [];
        this.config = {
            showProgressBar: true,
            timeout: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            buttons: [
                { text: 'Ok', action: null, bold: true },
                { text: 'Cancel', action: null, bold: false },
            ],
            placeholder: 'Enter answer here...',
            bodyMaxLength: 150,
            titleMaxLength: 16,
            backdrop: -1
        };
        this._options = {
            newOnTop: true,
            position: exports.SnotifyPosition.right_bottom,
            maxOnScreen: 8,
            transition: 400,
            maxHeight: 300
        };
    }
    /**
     * Generates random id
     * @return {number}
     */
    SnotifyService.generateRandomId = function () {
        return Math.floor(Math.random() * (Date.now() - 1)) + 1;
    };
    /**
     * Simple is object check.
     * @param item {Object<any>}
     * @returns {boolean}
     */
    SnotifyService.isObject = function (item) {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };
    /**
     * Deep merge objects.
     * @param sources {Array<Object>}
     * @returns {Object<any>}
     */
    SnotifyService.mergeDeep = function () {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        var target = {};
        if (!sources.length) {
            return target;
        }
        var _loop_1 = function () {
            var source = sources.shift();
            if (SnotifyService.isObject(source)) {
                var _loop_2 = function (key) {
                    if (SnotifyService.isObject(source[key])) {
                        target[key] = SnotifyService.mergeDeep(target[key], source[key]);
                    }
                    else if (Array.isArray(source[key])) {
                        if (!target[key]) {
                            Object.assign(target, (_a = {}, _a[key] = source[key], _a));
                        }
                        else {
                            target[key].forEach(function (value, i) {
                                target[key][i] = SnotifyService.mergeDeep(value, source[key][i]);
                            });
                        }
                    }
                    else {
                        Object.assign(target, (_b = {}, _b[key] = source[key], _b));
                    }
                    var _a, _b;
                };
                for (var key in source) {
                    _loop_2(key);
                }
            }
        };
        while (sources.length > 0) {
            _loop_1();
        }
        return target;
    };
    /**
     * emit changes in notifications array
     */
    SnotifyService.prototype.emit = function () {
        this.emitter.next(this.getAll());
    };
    /**
     * Set global config
     * @param config {SnotifyConfig}
     * @param options {SnotifyOptions}
     */
    SnotifyService.prototype.setConfig = function (config, options) {
        this.config = Object.assign(this.config, config);
        this._options = Object.assign(this._options, options);
        this.optionsChanged.next(this._options);
    };
    Object.defineProperty(SnotifyService.prototype, "options", {
        /**
         * get SnotifyOptions
         * @return {SnotifyOptions}
         */
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns SnotifyToast object
     * @param id {Number}
     * @return {undefined|SnotifyToast}
     */
    SnotifyService.prototype.get = function (id) {
        return this.notifications.find(function (toast) { return toast.id === id; });
    };
    /**
     * returns copy of notifications array
     * @return {SnotifyToast[]}
     */
    SnotifyService.prototype.getAll = function () {
        return this.notifications.slice();
    };
    /**
     * add SnotifyToast to notifications array
     * @param toast {SnotifyToast}
     */
    SnotifyService.prototype.add = function (toast) {
        if (this._options.newOnTop) {
            this.notifications.unshift(toast);
        }
        else {
            this.notifications.push(toast);
        }
        this.emit();
    };
    /**
     * If ID passed, emits toast animation remove, if ID & REMOVE passed, removes toast from notifications array
     * @param id {Number}
     * @param remove {Boolean}
     */
    SnotifyService.prototype.remove = function (id, remove) {
        if (!id) {
            return this.clear();
        }
        else if (remove) {
            this.notifications = this.notifications.filter(function (toast) { return toast.id !== id; });
            return this.emit();
        }
        this.toastDeleted.next(id);
    };
    /**
     * Clear notifications array
     */
    SnotifyService.prototype.clear = function () {
        this.notifications = [];
        this.emit();
    };
    /**
     * Creates toast and add it to array, returns toast id
     * @param snotify {Snotify}
     * @return {number}
     */
    SnotifyService.prototype.create = function (snotify) {
        var id = SnotifyService.generateRandomId();
        this.add(new SnotifyToast(id, snotify.title, snotify.body, snotify.config || null));
        return id;
    };
    /**
     * Create toast with Success style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.success = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: Object.assign({}, this.config, config, { type: exports.SnotifyType.SUCCESS })
        });
    };
    /**
     * Create toast with Error style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.error = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: Object.assign({}, this.config, config, { type: exports.SnotifyType.ERROR })
        });
    };
    /**
     * Create toast with Info style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.info = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: Object.assign({}, this.config, config, { type: exports.SnotifyType.INFO })
        });
    };
    /**
     * Create toast with Warining style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.warning = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: Object.assign({}, this.config, config, { type: exports.SnotifyType.WARNING })
        });
    };
    /**
     * Create toast without style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.simple = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: Object.assign({}, this.config, config)
        });
    };
    /**
     * Create toast with Confirm style {with two buttons}, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.confirm = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: SnotifyService.mergeDeep(this.config, config, { type: exports.SnotifyType.CONFIRM }, { closeOnClick: false })
        });
    };
    /**
     * Create toast with Prompt style {with two buttons}, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    SnotifyService.prototype.prompt = function (title, body, config) {
        return this.create({
            title: title,
            body: body,
            config: SnotifyService.mergeDeep(this.config, config, { type: exports.SnotifyType.PROMPT }, { timeout: 0, closeOnClick: false })
        });
    };
    /**
     * Creates async toast with Info style. Pass action, and resolve or reject it.
     * @param title {String}
     * @param body {String}
     * @param action {Promise<SnotifyConfig> | Observable<SnotifyConfig>}
     * @return {number}
     */
    SnotifyService.prototype.async = function (title, body, action) {
        var _this = this;
        var async;
        if (action instanceof Promise) {
            async = rxjs_observable_PromiseObservable.PromiseObservable.create(action);
        }
        else {
            async = action;
        }
        var id = this.simple(title, body, {
            pauseOnHover: false,
            closeOnClick: false,
            timeout: 0,
            showProgressBar: false,
            type: exports.SnotifyType.ASYNC
        });
        var toast = this.get(id);
        var latestToast = Object.assign({}, toast);
        var updateToast = function (type, data) {
            if (!data) {
                latestToast = SnotifyService.mergeDeep(toast, latestToast, { config: { type: type } });
            }
            else {
                latestToast = SnotifyService.mergeDeep(toast, data, { config: { type: type } });
            }
            _this.toastChanged.next(latestToast);
        };
        var lifecycleSubscription = this.lifecycle.subscribe(function (info) {
            if (info.action === exports.SnotifyAction.onInit && info.toast.id === id) {
                var subscription_1 = async.subscribe(function (next) {
                    updateToast(exports.SnotifyType.ASYNC, next);
                }, function (error) {
                    updateToast(exports.SnotifyType.ERROR, error);
                    subscription_1.unsubscribe();
                }, function () {
                    updateToast(exports.SnotifyType.SUCCESS);
                    subscription_1.unsubscribe();
                    lifecycleSubscription.unsubscribe();
                });
            }
        });
        return id;
    };
    return SnotifyService;
}());
SnotifyService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
SnotifyService.ctorParameters = function () { return []; };

var SnotifyComponent = (function () {
    function SnotifyComponent(service, render, snotify) {
        this.service = service;
        this.render = render;
        this.snotify = snotify;
    }
    /**
     * Init base options. Subscribe to options, lifecycle change
     */
    SnotifyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setOptions(this.service.options);
        this.optionsSubscription = this.service.optionsChanged.subscribe(function (options) {
            _this.setOptions(options);
        });
        this.setPosition(this.service.options.position);
        this.emitter = this.service.emitter.subscribe(function (toasts) {
            _this.notifications = toasts;
            var list = _this.notifications.filter(function (toast) { return toast.config.backdrop >= 0; });
            if (list.length) {
                _this.backdrop = 0;
                setTimeout(function () {
                    _this.backdrop = list[list.length - 1].config.backdrop;
                }, 10);
            }
            else {
                _this.backdrop = 0;
                setTimeout(function () {
                    _this.backdrop = -1;
                }, _this.service.options.transition);
            }
        });
        this.lifecycleSubscription = this.service.lifecycle.subscribe(function (info) {
            switch (info.action) {
                case exports.SnotifyAction.onInit:
                    if (_this.service.onInit) {
                        _this.service.onInit(info.toast);
                    }
                    break;
                case exports.SnotifyAction.onClick:
                    if (_this.service.onClick) {
                        _this.service.onClick(info.toast);
                    }
                    break;
                case exports.SnotifyAction.onHoverEnter:
                    if (_this.service.onHoverEnter) {
                        _this.service.onHoverEnter(info.toast);
                    }
                    break;
                case exports.SnotifyAction.onHoverLeave:
                    if (_this.service.onHoverLeave) {
                        _this.service.onHoverLeave(info.toast);
                    }
                    break;
                case exports.SnotifyAction.beforeDestroy:
                    if (_this.service.beforeDestroy) {
                        _this.service.beforeDestroy(info.toast);
                    }
                    break;
                case exports.SnotifyAction.afterDestroy:
                    if (_this.service.afterDestroy) {
                        _this.service.afterDestroy(info.toast);
                    }
                    break;
            }
        });
    };
    /**
     * Setup global options object
     * @param options {SnotifyOptions}
     */
    SnotifyComponent.prototype.setOptions = function (options) {
        if (this.service.options.newOnTop) {
            this.dockSize_a = -options.maxOnScreen;
            this.dockSize_b = undefined;
        }
        else {
            this.dockSize_a = 0;
            this.dockSize_b = options.maxOnScreen;
        }
        this.setPosition(options.position);
    };
    /**
     * Setup notifications position
     * @param position {SnotifyPosition}
     */
    SnotifyComponent.prototype.setPosition = function (position) {
        this.render.removeAttribute(this.snotify.nativeElement, 'class');
        switch (position) {
            case exports.SnotifyPosition.left_top:
                this.render.addClass(this.snotify.nativeElement, 'snotify-leftTop');
                break;
            case exports.SnotifyPosition.left_center:
                this.render.addClass(this.snotify.nativeElement, 'snotify-leftCenter');
                break;
            case exports.SnotifyPosition.left_bottom:
                this.render.addClass(this.snotify.nativeElement, 'snotify-leftBottom');
                break;
            case exports.SnotifyPosition.right_top:
                this.render.addClass(this.snotify.nativeElement, 'snotify-rightTop');
                break;
            case exports.SnotifyPosition.right_center:
                this.render.addClass(this.snotify.nativeElement, 'snotify-rightCenter');
                break;
            case exports.SnotifyPosition.right_bottom:
                this.render.addClass(this.snotify.nativeElement, 'snotify-rightBottom');
                break;
            case exports.SnotifyPosition.center_top:
                this.render.addClass(this.snotify.nativeElement, 'snotify-centerTop');
                break;
            case exports.SnotifyPosition.center_center:
                this.render.addClass(this.snotify.nativeElement, 'snotify-centerCenter');
                break;
            case exports.SnotifyPosition.center_bottom:
                this.render.addClass(this.snotify.nativeElement, 'snotify-centerBottom');
                break;
        }
    };
    /**
     * Unsubscribe subscriptions
     */
    SnotifyComponent.prototype.ngOnDestroy = function () {
        this.emitter.unsubscribe();
        this.optionsSubscription.unsubscribe();
        this.lifecycleSubscription.unsubscribe();
    };
    return SnotifyComponent;
}());
SnotifyComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'app-snotify',
                template: "<div class=\"snotify-backdrop\" *ngIf=\"backdrop >= 0\" [style.opacity]=\"backdrop\"></div> <app-snotify-toast *ngFor=\"let notification of notifications| slice:dockSize_a:dockSize_b\" [toast]=\"notification\"> </app-snotify-toast> ",
                styles: [":host { display: block; position: fixed; width: 300px; z-index: 9999; box-sizing: border-box; } :host * { box-sizing: border-box; } :host(.snotify-leftTop), :host(.snotify-leftCenter), :host(.snotify-leftBottom) { left: 10px; } :host(.snotify-rightTop), :host(.snotify-rightCenter), :host(.snotify-rightBottom) { right: 10px; } :host(.snotify-centerTop), :host(.snotify-centerCenter), :host(.snotify-centerBottom) { left: calc(50% - 300px/2); } :host(.snotify-leftTop), :host(.snotify-rightTop), :host(.snotify-rightTop) { top: 10px; } :host(.snotify-leftCenter), :host(.snotify-rightCenter), :host(.snotify-centerCenter) { top: 50%; transform: translateY(-50%); } :host(.snotify-leftBottom), :host(.snotify-rightBottom), :host(.snotify-centerBottom) { bottom: 10px; } .snotify-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: #000000; opacity: 0; z-index: -1; transition: opacity .3s; } "]
            },] },
];
/** @nocollapse */
SnotifyComponent.ctorParameters = function () { return [
    { type: SnotifyService, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };

var ToastComponent = (function () {
    function ToastComponent(service) {
        this.service = service;
        /**
         * Toast state
         * @type {Object}
         */
        this.state = {
            toast: {
                progress: 0,
                isShowing: false,
                isRemoving: false,
                isDestroying: false
            },
            prompt: {
                input: '',
                isPromptFocused: false,
                isPromptActive: false
            }
        };
        /**
         * Active style for toast
         * @type {Object}
         */
        this.types = {
            success: false,
            warning: false,
            error: false,
            info: false,
            simple: false,
            async: false,
            confirm: false,
            prompt: false,
        };
    }
    /*
    Life cycles
     */
    /**
     * Init base options. Subscribe to toast changed, toast deleted
     */
    ToastComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.transitionTime = this.service.options.transition;
        this.maxHeight = this.service.options.maxHeight;
        this.initToast();
        this.toastChangedSubscription = this.service.toastChanged.subscribe(function (toast) {
            if (_this.toast.id === toast.id) {
                _this.initToast(toast);
            }
        });
        this.toastDeletedSubscription = this.service.toastDeleted.subscribe(function (id) {
            if (_this.toast.id === id) {
                _this.onRemove().then(function () {
                    _this.service.remove(id, true);
                });
            }
        });
    };
    /**
     * Delay on toast show
     */
    ToastComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.onShow(); }, 50);
    };
    /**
     * Unsubscribe subscriptions
     */
    ToastComponent.prototype.ngOnDestroy = function () {
        this.lifecycle(exports.SnotifyAction.afterDestroy);
        this.toastChangedSubscription.unsubscribe();
        this.toastDeletedSubscription.unsubscribe();
    };
    /*
    Event hooks
     */
    /**
     * Trigger OnClick lifecycle
     */
    ToastComponent.prototype.onClick = function () {
        this.lifecycle(exports.SnotifyAction.onClick);
        if (this.toast.config.closeOnClick) {
            this.service.remove(this.toast.id);
        }
    };
    /**
     * Trigger beforeDestroy lifecycle. Removes toast
     */
    ToastComponent.prototype.onRemove = function () {
        var _this = this;
        this.maxHeight = 0;
        clearInterval(this.interval);
        this.state.toast.isDestroying = true;
        this.lifecycle(exports.SnotifyAction.beforeDestroy);
        this.state.toast.isRemoving = true;
        return new Promise(function (resolve, reject) { return setTimeout(resolve, _this.service.options.transition); });
    };
    /**
     * Trigger onInit lifecycle
     */
    ToastComponent.prototype.onShow = function () {
        this.state.toast.isShowing = true;
        this.lifecycle(exports.SnotifyAction.onInit);
    };
    /**
     * Trigger onHoverEnter lifecycle
     */
    ToastComponent.prototype.onMouseEnter = function () {
        this.lifecycle(exports.SnotifyAction.onHoverEnter);
        if (this.toast.config.pauseOnHover) {
            clearInterval(this.interval);
        }
    };
    /**
     * Trigger onHoverLeave lifecycle
     */
    ToastComponent.prototype.onMouseLeave = function () {
        if (this.toast.config.pauseOnHover && !this.types.prompt) {
            this.startTimeout(this.state.toast.progress);
        }
        this.lifecycle(exports.SnotifyAction.onHoverLeave);
    };
    // Prompt
    /**
     * Expand input
     */
    ToastComponent.prototype.onPromptEnter = function () {
        this.state.prompt.isPromptActive = true;
    };
    /**
     * Collapse input
     */
    ToastComponent.prototype.onPromptLeave = function () {
        if (!this.state.prompt.input.length && !this.state.prompt.isPromptFocused) {
            this.state.prompt.isPromptActive = false;
        }
    };
    /*
     Common
     */
    /**
     * Initialize base toast config
     * @param toast {SnotifyToast}
     */
    ToastComponent.prototype.initToast = function (toast) {
        if (toast) {
            if (this.toast.config.type !== toast.config.type) {
                clearInterval(this.interval);
            }
            this.toast = toast;
        }
        this.setType(this.toast.config.type);
        if (this.toast.config.timeout > 0) {
            this.startTimeout(0);
        }
        else {
            this.toast.config.showProgressBar = false;
            this.toast.config.pauseOnHover = false;
        }
    };
    /**
     * Setup toast type
     * @param type {SnotifyType}
     */
    ToastComponent.prototype.setType = function (type) {
        this.resetTypes();
        switch (type) {
            case exports.SnotifyType.SUCCESS:
                this.types.success = true;
                break;
            case exports.SnotifyType.ERROR:
                this.types.error = true;
                break;
            case exports.SnotifyType.WARNING:
                this.types.warning = true;
                break;
            case exports.SnotifyType.INFO:
                this.types.info = true;
                break;
            case exports.SnotifyType.ASYNC:
                this.types.async = true;
                break;
            case exports.SnotifyType.CONFIRM:
                this.types.confirm = true;
                break;
            case exports.SnotifyType.PROMPT:
                this.types.prompt = true;
                break;
            default:
                this.types.simple = true;
                break;
        }
    };
    /**
     * Reset toast type
     */
    ToastComponent.prototype.resetTypes = function () {
        this.types.info =
            this.types.error =
                this.types.warning =
                    this.types.simple =
                        this.types.success =
                            this.types.async =
                                this.types.confirm =
                                    this.types.prompt =
                                        false;
    };
    /**
     * Start progress bar
     * @param currentProgress {Number}
     */
    ToastComponent.prototype.startTimeout = function (currentProgress) {
        var _this = this;
        var refreshRate = 10;
        if (this.state.toast.isDestroying) {
            return;
        }
        this.state.toast.progress = currentProgress;
        var step = refreshRate / this.toast.config.timeout * 100;
        this.interval = setInterval(function () {
            _this.state.toast.progress += step;
            if (_this.state.toast.progress >= 100) {
                _this.service.remove(_this.toast.id);
            }
        }, refreshRate);
    };
    /**
     * Lifesycle trigger
     * @param action {SnotifyAction}
     */
    ToastComponent.prototype.lifecycle = function (action) {
        return this.service.lifecycle.next({
            action: action,
            toast: this.toast
        });
    };
    return ToastComponent;
}());
ToastComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'app-snotify-toast',
                template: "<div class=\"snotifyToast\" [ngClass]=\"{ 'snotify-success': types.success, 'snotify-warning': types.warning, 'snotify-info': types.info, 'snotify-error': types.error, 'snotify-simple': types.simple, 'snotify-async': types.async, 'snotify-confirm': types.confirm, 'snotify-prompt': types.prompt, 'snotifyToast-show': state.toast.isShowing, 'snotifyToast-remove': state.toast.isRemoving }\" [ngStyle]=\"{ 'transition': 'transform ' + transitionTime + 'ms, opacity '+transitionTime/2+'ms, max-height ease '+transitionTime+'ms', 'max-height': maxHeight + 'px' }\" (click)=\"onClick()\" (mouseenter)=\"onMouseEnter()\" (mouseleave)=\"onMouseLeave()\"> <div class=\"snotifyToast__inner\"> <div class=\"snotifyToast__progressBar\" *ngIf=\"toast.config.showProgressBar\"> <span class=\"snotifyToast__progressBar__percentage\" [ngStyle]=\"{'width': state.toast.progress + '%'}\"></span> </div> <div class=\"snotifyToast__title\">{{toast.title | truncate : toast.config.titleMaxLength}}</div> <div class=\"snotifyToast__body\">{{toast.body | truncate : toast.config.bodyMaxLength}}</div> <span *ngIf=\"types.prompt\" class=\"input\" [ngClass]=\"{'input--filled': state.prompt.isPromptActive}\" (mouseenter)=\"onPromptEnter()\" (mouseleave)=\"onPromptLeave()\"> <input (input)=\"state.prompt.input = $event.target.value\" class=\"input__field\" type=\"text\" [id]=\"toast.id\" (focus)=\"state.prompt.isPromptFocused = true\" (blur)=\"state.prompt.isPromptFocused = false; onPromptLeave()\"/> <label class=\"input__label\" [for]=\"toast.id\"> <span class=\"input__labelContent\">{{toast.config.placeholder | truncate}}</span> </label> </span> <app-icon *ngIf=\"!toast.config.icon; else elseBlock\" class=\"snotify-icon\" [types]=\"types\"></app-icon> <ng-template #elseBlock> <img class=\"snotify-icon\" [src]='toast.config.icon' /> </ng-template> </div> <div *ngIf=\"types.prompt || types.confirm\" class=\"snotifyToast__buttons\"> <button (click)=\"toast.config.buttons[0].action(types.prompt ? state.prompt.input : null)\" [ngClass]=\"{'snotifyToast__buttons--bold': toast.config.buttons[0].bold}\"> {{toast.config.buttons[0].text}} </button> <button (click)=\"toast.config.buttons[1].action(types.prompt ? state.prompt.input : null)\" [ngClass]=\"{'snotifyToast__buttons--bold': toast.config.buttons[1].bold}\"> {{toast.config.buttons[1].text}} </button> </div> </div> ",
                styles: [":host { display: block; cursor: pointer; } .snotifyToast { background-color: #fff; max-height: 300px; height: 100%; margin: 5px; opacity: 0; transform: translate(0, -50%); border-radius: 5px; overflow: hidden; } .snotifyToast__inner { position: relative; padding: 10px 65px 10px 15px; font-size: 16px; color: #000; } .snotifyToast__progressBar { position: absolute; top: 0; left: 0; right: 0; height: 10px; background-color: #c7c7c7; } .snotifyToast__progressBar__percentage { position: absolute; top: 0; left: 0; height: 10px; background-color: #4c4c4c; max-width: 100%; } .snotifyToast__progressBar + .snotifyToast__title { margin-top: 5px; } .snotifyToast__progressBar ~ .snotifyToast-icon { margin-top: 5px; } .snotifyToast__title { font-size: 1.8em; margin-bottom: 5px; color: #fff; } .snotifyToast__body { font-size: 1em; } .snotifyToast__buttons { display: flex; flex-flow: row nowrap; justify-content: space-between; border-top: 1px solid rgba(0, 0, 0, 0.1); } .snotifyToast__buttons button { position: relative; width: 100%; border: none; background: transparent; padding: 8px; text-transform: capitalize; color: #fff; } .snotifyToast__buttons button:hover, .snotifyToast__buttons button:focus { background: rgba(0, 0, 0, 0.1); outline: none; } .snotifyToast__buttons button:active { background: rgba(0, 0, 0, 0.5); } .snotifyToast__buttons button:last-child::before { content: ''; width: 2px; position: absolute; top: 0; bottom: 0; left: -1px; background-color: rgba(0, 0, 0, 0.1); } .snotifyToast__buttons--bold { font-weight: 700; } .snotifyToast-show { transform: translate(0, 0); opacity: 1; } .snotifyToast-remove { max-height: 0; overflow: hidden; transform: translate(0, 50%); opacity: 0; } .input { position: relative; z-index: 1; display: inline-block; margin: 0; width: 100%; vertical-align: top; transition: all .5s; transition-delay: .3s; transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1); } .input__field { position: relative; display: block; float: right; padding: 0.85em 0.5em; width: 100%; border: none; border-radius: 0; background: transparent; color: #333; font-weight: bold; -webkit-appearance: none; /* for box shadows to show on iOS */ opacity: 0; transition: opacity 0.3s; } .input__field:focus { outline: none; } .input__label { display: inline-block; float: right; padding: 0 0.85em; width: 100%; color: #e0f2f1; font-weight: bold; font-size: 70.25%; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; position: absolute; left: 0; height: 100%; text-align: left; pointer-events: none; } .input__label::before, .input__label::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: transform 0.3s; } .input__label::before { border-top: 2px solid #fff; transform: translate3d(0, 100%, 0) translate3d(0, -2px, 0); transition-delay: 0.3s; } .input__label::after { z-index: -1; background: #b2dfdb; transform: scale3d(1, 0, 1); transform-origin: 50% 0; } .input__labelContent { position: relative; display: block; padding: 1.6em 0; width: 100%; transition: transform 0.3s 0.3s; } .input--filled { margin-top: 1.5em; } .input--filled:focus, .input--filled .input__field { opacity: 1; transition-delay: 0.3s; } .input__field:focus + .input__label .input__labelContent, .input--filled .input__labelContent { transform: translate(0, -80%); transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1); } .input__field:focus + .input__label::before, .input--filled .input__label::before { transition-delay: 0s; } .input__field:focus + .input__label::before, .input--filled .input__label::before { transform: translate(0, 0); } .input__field:focus + .input__label::after, .input--filled .input__label::after { transform: scale(1, 1); transition-delay: 0.3s; transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1); } /*************** ** Modifiers ** **************/ .snotify-simple .snotifyToast__title, .snotify-simple .snotifyToast__body { color: #000; } .snotify-success { background-color: #4CAF50; } .snotify-success .snotifyToast__progressBar { background-color: #388E3C; } .snotify-success .snotifyToast__progressBar__percentage { background-color: #81c784; } .snotify-success .snotifyToast__body { color: #C8E6C9; } .snotify-info { background-color: #1e88e5; } .snotify-info .snotifyToast__progressBar { background-color: #1565c0; } .snotify-info .snotifyToast__progressBar__percentage { background-color: #64b5f6; } .snotify-info .snotifyToast__body { color: #e3f2fd; } .snotify-warning { background-color: #ff9800; } .snotify-warning .snotifyToast__progressBar { background-color: #ef6c00; } .snotify-warning .snotifyToast__progressBar__percentage { background-color: #ffcc80; } .snotify-warning .snotifyToast__body { color: #fff3e0; } .snotify-error { background-color: #f44336; } .snotify-error .snotifyToast__progressBar { background-color: #c62828; } .snotify-error .snotifyToast__progressBar__percentage { background-color: #ef9a9a; } .snotify-error .snotifyToast__body { color: #ffebee; } .snotify-async { background-color: #1e88e5; } .snotify-async .snotifyToast__progressBar { background-color: #1565c0; } .snotify-async .snotifyToast__progressBar__percentage { background-color: #64b5f6; } .snotify-async .snotifyToast__body { color: #e3f2fd; } .snotify-confirm { background-color: #009688; } .snotify-confirm .snotifyToast__progressBar { background-color: #4db6ac; } .snotify-confirm .snotifyToast__progressBar__percentage { background-color: #80cbc4; } .snotify-confirm .snotifyToast__body { color: #e0f2f1; } .snotify-prompt { background-color: #009688; } .snotify-prompt .snotifyToast__inner { padding: 10px 15px; } .snotify-prompt .snotifyToast__title { margin-bottom: 0; } .snotify-prompt .snotifyToast__body { color: #e0f2f1; } .snotify-icon { position: absolute; right: 10px; top: 50%; line-height: 0; transform: translate(0, -50%); max-height: 48px; max-width: 48px; } "]
            },] },
];
/** @nocollapse */
ToastComponent.ctorParameters = function () { return [
    { type: SnotifyService, },
]; };
ToastComponent.propDecorators = {
    'toast': [{ type: _angular_core.Input },],
};

var IconComponent = (function () {
    function IconComponent() {
    }
    return IconComponent;
}());
IconComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'app-icon',
                template: "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 48 48;\" xml:space=\"preserve\" width=\"48px\" height=\"48px\"> <g *ngIf=\"types.warning\" class=\"snotify-icon__warning\"> <path d=\"M256,512c141.15,0,256-114.84,256-256S397.15,0,256,0,0,114.84,0,256,114.85,512,256,512Zm0-480.49c123.79,0,224.49,100.71,224.49,224.49S379.79,480.49,256,480.49,31.51,379.79,31.51,256,132.21,31.51,256,31.51Z\"/><circle cx=\"260.08\" cy=\"343.87\" r=\"26.35\"/><path d=\"M254.68,278.39a15.76,15.76,0,0,0,15.75-15.75V128.72a15.75,15.75,0,1,0-31.51,0V262.63A15.76,15.76,0,0,0,254.68,278.39Z\"/> </g> <g *ngIf=\"types.success\" class=\"snotify-icon__success\"> <path d=\"M256,0C114.85,0,0,114.84,0,256S114.85,512,256,512,512,397.16,512,256,397.15,0,256,0Zm0,492.31c-130.29,0-236.31-106-236.31-236.31S125.71,19.69,256,19.69,492.31,125.71,492.31,256,386.29,492.31,256,492.31Z\"/><path class=\"cls-1\" d=\"M376.64,151,225.31,321.24l-91.17-72.93a9.85,9.85,0,0,0-12.3,15.38l98.46,78.77a9.86,9.86,0,0,0,13.52-1.15L391.36,164.08A9.85,9.85,0,0,0,376.64,151Z\"/> </g> <g *ngIf=\"types.info && !types.async\" class=\"snotify-icon__info\"> <path d=\"M256,0C114.84,0,0,114.84,0,256S114.84,512,256,512,512,397.16,512,256,397.15,0,256,0Zm0,478.43C133.35,478.43,33.57,378.64,33.57,256S133.35,33.58,256,33.58,478.42,133.36,478.42,256,378.64,478.43,256,478.43Z\"/><path d=\"M251.26,161.24a22.39,22.39,0,1,0-22.38-22.39A22.39,22.39,0,0,0,251.26,161.24Z\"/><path d=\"M286.84,357.87h-14v-160A16.79,16.79,0,0,0,256,181.05H225.17a16.79,16.79,0,0,0,0,33.58h14.05V357.87H225.17a16.79,16.79,0,0,0,0,33.57h61.67a16.79,16.79,0,1,0,0-33.57Z\"/> </g> <g *ngIf=\"types.error\" class=\"snotify-icon__error\"> <path d=\"M437,75A256,256,0,1,0,75,437,256,256,0,1,0,437,75ZM416.43,416.43a226.82,226.82,0,0,1-320.86,0C7.11,328,7.11,184,95.57,95.57a226.82,226.82,0,0,1,320.86,0C504.89,184,504.89,328,416.43,416.43Z\"/><path d=\"M368.81,143.19a14.5,14.5,0,0,0-20.58,0L256,235.42l-92.23-92.23a14.55,14.55,0,0,0-20.58,20.58L235.42,256l-92.23,92.23a14.6,14.6,0,0,0,10.24,24.89,14.19,14.19,0,0,0,10.24-4.31l92.23-92.23,92.23,92.23a14.64,14.64,0,0,0,10.24,4.31,14,14,0,0,0,10.24-4.31,14.5,14.5,0,0,0,0-20.58l-92-92.23,92.23-92.23A14.5,14.5,0,0,0,368.81,143.19Z\"/> </g> <g *ngIf=\"types.async\" class=\"snotify-icon__async\"> <path d=\"M256,0a32,32,0,0,0-32,32V96a32,32,0,0,0,64,0V32A32,32,0,0,0,256,0Zm0,384a32,32,0,0,0-32,32v64a32,32,0,0,0,64,0V416A32,32,0,0,0,256,384ZM391.74,165.5,437,120.22A32,32,0,0,0,391.74,75L346.5,120.22a32,32,0,0,0,45.25,45.28Zm-271.52,181L75,391.74A32,32,0,0,0,120.22,437l45.25-45.25a32,32,0,0,0-45.25-45.25Zm0-271.52A32,32,0,1,0,75,120.22l45.25,45.28a32,32,0,1,0,45.25-45.28ZM391.74,346.5a32,32,0,0,0-45.25,45.25L391.74,437A32,32,0,0,0,437,391.74ZM480,224H416a32,32,0,0,0,0,64h64a32,32,0,0,0,0-64ZM128,256a32,32,0,0,0-32-32H32a32,32,0,0,0,0,64H96A32,32,0,0,0,128,256Z\"/> </g> </svg> ",
                styles: [".snotify-icon__error { fill: #ffcdd2; } .snotify-icon__warning { fill: #ffccbc; } .snotify-icon__info { fill: #bbdefb; } .snotify-icon__success { fill: #c8e6c9; } .snotify-icon__async { fill: #bbdefb; animation: async 3s infinite linear; transform-origin: 50% 50%; } @keyframes async { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } "]
            },] },
];
/** @nocollapse */
IconComponent.ctorParameters = function () { return []; };
IconComponent.propDecorators = {
    'types': [{ type: _angular_core.Input },],
};

var TruncatePipe = (function () {
    function TruncatePipe() {
    }
    TruncatePipe.prototype.transform = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var limit = 40;
        var trail = '...';
        if (args.length > 0) {
            limit = args.length > 0 ? parseInt(args[0], 10) : limit;
            trail = args.length > 1 ? args[1] : trail;
        }
        return value.length > limit ? value.substring(0, limit) + trail : value;
    };
    return TruncatePipe;
}());
TruncatePipe.decorators = [
    { type: _angular_core.Pipe, args: [{
                name: 'truncate'
            },] },
];
/** @nocollapse */
TruncatePipe.ctorParameters = function () { return []; };

var SnotifyModule = (function () {
    function SnotifyModule() {
    }
    SnotifyModule.forRoot = function () {
        return {
            ngModule: SnotifyModule,
            providers: [SnotifyService]
        };
    };
    return SnotifyModule;
}());
SnotifyModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule
                ],
                declarations: [
                    SnotifyComponent, ToastComponent, IconComponent, TruncatePipe
                ],
                exports: [
                    SnotifyComponent, TruncatePipe
                ]
            },] },
];
/** @nocollapse */
SnotifyModule.ctorParameters = function () { return []; };

exports.SnotifyModule = SnotifyModule;
exports.SnotifyComponent = SnotifyComponent;
exports.SnotifyService = SnotifyService;
exports.SnotifyToast = SnotifyToast;
exports.TruncatePipe = TruncatePipe;

Object.defineProperty(exports, '__esModule', { value: true });

})));
