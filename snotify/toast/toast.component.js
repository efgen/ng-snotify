import { Component, Input } from '@angular/core';
import { SnotifyService } from '../snotify.service';
import { SnotifyAction } from '../enum/SnotifyAction.enum';
import { SnotifyType } from '../enum/SnotifyType.enum';
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
        this.lifecycle(SnotifyAction.afterDestroy);
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
        this.lifecycle(SnotifyAction.onClick);
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
        this.lifecycle(SnotifyAction.beforeDestroy);
        this.state.toast.isRemoving = true;
        return new Promise(function (resolve, reject) { return setTimeout(resolve, _this.service.options.transition); });
    };
    /**
     * Trigger onInit lifecycle
     */
    ToastComponent.prototype.onShow = function () {
        this.state.toast.isShowing = true;
        this.lifecycle(SnotifyAction.onInit);
    };
    /**
     * Trigger onHoverEnter lifecycle
     */
    ToastComponent.prototype.onMouseEnter = function () {
        this.lifecycle(SnotifyAction.onHoverEnter);
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
        this.lifecycle(SnotifyAction.onHoverLeave);
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
            case SnotifyType.SUCCESS:
                this.types.success = true;
                break;
            case SnotifyType.ERROR:
                this.types.error = true;
                break;
            case SnotifyType.WARNING:
                this.types.warning = true;
                break;
            case SnotifyType.INFO:
                this.types.info = true;
                break;
            case SnotifyType.ASYNC:
                this.types.async = true;
                break;
            case SnotifyType.CONFIRM:
                this.types.confirm = true;
                break;
            case SnotifyType.PROMPT:
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
export { ToastComponent };
ToastComponent.decorators = [
    { type: Component, args: [{
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
    'toast': [{ type: Input },],
};
