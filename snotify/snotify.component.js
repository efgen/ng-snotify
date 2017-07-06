import { Component, ElementRef, Renderer2 } from '@angular/core';
import { SnotifyService } from './snotify.service';
import { SnotifyAction } from './enum/SnotifyAction.enum';
import { SnotifyPosition } from './enum/SnotifyPosition.enum';
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
                case SnotifyAction.onInit:
                    if (_this.service.onInit) {
                        _this.service.onInit(info.toast);
                    }
                    break;
                case SnotifyAction.onClick:
                    if (_this.service.onClick) {
                        _this.service.onClick(info.toast);
                    }
                    break;
                case SnotifyAction.onHoverEnter:
                    if (_this.service.onHoverEnter) {
                        _this.service.onHoverEnter(info.toast);
                    }
                    break;
                case SnotifyAction.onHoverLeave:
                    if (_this.service.onHoverLeave) {
                        _this.service.onHoverLeave(info.toast);
                    }
                    break;
                case SnotifyAction.beforeDestroy:
                    if (_this.service.beforeDestroy) {
                        _this.service.beforeDestroy(info.toast);
                    }
                    break;
                case SnotifyAction.afterDestroy:
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
            case SnotifyPosition.left_top:
                this.render.addClass(this.snotify.nativeElement, 'snotify-leftTop');
                break;
            case SnotifyPosition.left_center:
                this.render.addClass(this.snotify.nativeElement, 'snotify-leftCenter');
                break;
            case SnotifyPosition.left_bottom:
                this.render.addClass(this.snotify.nativeElement, 'snotify-leftBottom');
                break;
            case SnotifyPosition.right_top:
                this.render.addClass(this.snotify.nativeElement, 'snotify-rightTop');
                break;
            case SnotifyPosition.right_center:
                this.render.addClass(this.snotify.nativeElement, 'snotify-rightCenter');
                break;
            case SnotifyPosition.right_bottom:
                this.render.addClass(this.snotify.nativeElement, 'snotify-rightBottom');
                break;
            case SnotifyPosition.center_top:
                this.render.addClass(this.snotify.nativeElement, 'snotify-centerTop');
                break;
            case SnotifyPosition.center_center:
                this.render.addClass(this.snotify.nativeElement, 'snotify-centerCenter');
                break;
            case SnotifyPosition.center_bottom:
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
export { SnotifyComponent };
SnotifyComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-snotify',
                template: "<div class=\"snotify-backdrop\" *ngIf=\"backdrop >= 0\" [style.opacity]=\"backdrop\"></div> <app-snotify-toast *ngFor=\"let notification of notifications| slice:dockSize_a:dockSize_b\" [toast]=\"notification\"> </app-snotify-toast> ",
                styles: [":host { display: block; position: fixed; width: 300px; z-index: 9999; box-sizing: border-box; } :host * { box-sizing: border-box; } :host(.snotify-leftTop), :host(.snotify-leftCenter), :host(.snotify-leftBottom) { left: 10px; } :host(.snotify-rightTop), :host(.snotify-rightCenter), :host(.snotify-rightBottom) { right: 10px; } :host(.snotify-centerTop), :host(.snotify-centerCenter), :host(.snotify-centerBottom) { left: calc(50% - 300px/2); } :host(.snotify-leftTop), :host(.snotify-rightTop), :host(.snotify-rightTop) { top: 10px; } :host(.snotify-leftCenter), :host(.snotify-rightCenter), :host(.snotify-centerCenter) { top: 50%; transform: translateY(-50%); } :host(.snotify-leftBottom), :host(.snotify-rightBottom), :host(.snotify-centerBottom) { bottom: 10px; } .snotify-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: #000000; opacity: 0; z-index: -1; transition: opacity .3s; } "]
            },] },
];
/** @nocollapse */
SnotifyComponent.ctorParameters = function () { return [
    { type: SnotifyService, },
    { type: Renderer2, },
    { type: ElementRef, },
]; };
