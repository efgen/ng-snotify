import { Injectable } from '@angular/core';
import { SnotifyToast } from './toast/snotify-toast.model';
import { Subject } from 'rxjs/Subject';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';
import { SnotifyType } from './enum/SnotifyType.enum';
import { SnotifyPosition } from './enum/SnotifyPosition.enum';
import { SnotifyAction } from './enum/SnotifyAction.enum';
/**
 * SnotifyService - create, remove, config toasts
 */
var SnotifyService = (function () {
    /**
     * Constructor - initialize base configuration objects
     */
    function SnotifyService() {
        this.emitter = new Subject();
        this.lifecycle = new Subject();
        this.optionsChanged = new Subject();
        this.toastChanged = new Subject();
        this.toastDeleted = new Subject();
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
            position: SnotifyPosition.right_bottom,
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
            config: Object.assign({}, this.config, config, { type: SnotifyType.SUCCESS })
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
            config: Object.assign({}, this.config, config, { type: SnotifyType.ERROR })
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
            config: Object.assign({}, this.config, config, { type: SnotifyType.INFO })
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
            config: Object.assign({}, this.config, config, { type: SnotifyType.WARNING })
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
            config: SnotifyService.mergeDeep(this.config, config, { type: SnotifyType.CONFIRM }, { closeOnClick: false })
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
            config: SnotifyService.mergeDeep(this.config, config, { type: SnotifyType.PROMPT }, { timeout: 0, closeOnClick: false })
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
            async = PromiseObservable.create(action);
        }
        else {
            async = action;
        }
        var id = this.simple(title, body, {
            pauseOnHover: false,
            closeOnClick: false,
            timeout: 0,
            showProgressBar: false,
            type: SnotifyType.ASYNC
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
            if (info.action === SnotifyAction.onInit && info.toast.id === id) {
                var subscription_1 = async.subscribe(function (next) {
                    updateToast(SnotifyType.ASYNC, next);
                }, function (error) {
                    updateToast(SnotifyType.ERROR, error);
                    subscription_1.unsubscribe();
                }, function () {
                    updateToast(SnotifyType.SUCCESS);
                    subscription_1.unsubscribe();
                    lifecycleSubscription.unsubscribe();
                });
            }
        });
        return id;
    };
    return SnotifyService;
}());
export { SnotifyService };
SnotifyService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SnotifyService.ctorParameters = function () { return []; };
