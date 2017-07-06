import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from '../snotify.service';
import { SnotifyToast } from './snotify-toast.model';
import { SnotifyAction } from '../enum/SnotifyAction.enum';
import { SnotifyType } from '../enum/SnotifyType.enum';
import { Subscription } from 'rxjs/Subscription';
export declare class ToastComponent implements OnInit, AfterViewInit, OnDestroy {
    private service;
    /**
     * Get toast from notifications array
     */
    toast: SnotifyToast;
    toastDeletedSubscription: Subscription;
    toastChangedSubscription: Subscription;
    /**
     * Toast state
     * @type {Object}
     */
    state: {
        toast: {
            progress: number;
            isShowing: boolean;
            isRemoving: boolean;
            isDestroying: boolean;
        };
        prompt: {
            input: string;
            isPromptFocused: boolean;
            isPromptActive: boolean;
        };
    };
    /**
     * Toast maximum height in pixels
     */
    maxHeight: number;
    /**
     * toast transition milliseconds
     */
    transitionTime: number;
    /**
     * Toast progress interval
     */
    interval: any;
    /**
     * Active style for toast
     * @type {Object}
     */
    types: {
        success: boolean;
        warning: boolean;
        error: boolean;
        info: boolean;
        simple: boolean;
        async: boolean;
        confirm: boolean;
        prompt: boolean;
    };
    constructor(service: SnotifyService);
    /**
     * Init base options. Subscribe to toast changed, toast deleted
     */
    ngOnInit(): void;
    /**
     * Delay on toast show
     */
    ngAfterViewInit(): void;
    /**
     * Unsubscribe subscriptions
     */
    ngOnDestroy(): void;
    /**
     * Trigger OnClick lifecycle
     */
    onClick(): void;
    /**
     * Trigger beforeDestroy lifecycle. Removes toast
     */
    onRemove(): Promise<{}>;
    /**
     * Trigger onInit lifecycle
     */
    onShow(): void;
    /**
     * Trigger onHoverEnter lifecycle
     */
    onMouseEnter(): void;
    /**
     * Trigger onHoverLeave lifecycle
     */
    onMouseLeave(): void;
    /**
     * Expand input
     */
    onPromptEnter(): void;
    /**
     * Collapse input
     */
    onPromptLeave(): void;
    /**
     * Initialize base toast config
     * @param toast {SnotifyToast}
     */
    initToast(toast?: SnotifyToast): void;
    /**
     * Setup toast type
     * @param type {SnotifyType}
     */
    setType(type: SnotifyType): void;
    /**
     * Reset toast type
     */
    resetTypes(): void;
    /**
     * Start progress bar
     * @param currentProgress {Number}
     */
    startTimeout(currentProgress: number): void;
    /**
     * Lifesycle trigger
     * @param action {SnotifyAction}
     */
    lifecycle(action: SnotifyAction): void;
}
