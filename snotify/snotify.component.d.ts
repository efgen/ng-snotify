import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SnotifyService } from './snotify.service';
import { SnotifyToast } from './toast/snotify-toast.model';
import { Subscription } from 'rxjs/Subscription';
import { SnotifyOptions } from './interfaces/SnotifyOptions.interface';
import { SnotifyPosition } from './enum/SnotifyPosition.enum';
export declare class SnotifyComponent implements OnInit, OnDestroy {
    private service;
    private render;
    private snotify;
    /**
     * Toasts array
     */
    notifications: SnotifyToast[];
    emitter: Subscription;
    /**
     * Listens for options has been changed
     */
    optionsSubscription: Subscription;
    /**
     * Listens for lifecycle has been triggered
     */
    lifecycleSubscription: Subscription;
    /**
     * Helper for slice pipe (maxOnScreen)
     */
    dockSize_a: number;
    /**
     * Helper for slice pipe (maxOnScreen)
     */
    dockSize_b: number | undefined;
    /**
     * Backdrop Opacity
     */
    backdrop: number;
    constructor(service: SnotifyService, render: Renderer2, snotify: ElementRef);
    /**
     * Init base options. Subscribe to options, lifecycle change
     */
    ngOnInit(): void;
    /**
     * Setup global options object
     * @param options {SnotifyOptions}
     */
    setOptions(options: SnotifyOptions): void;
    /**
     * Setup notifications position
     * @param position {SnotifyPosition}
     */
    setPosition(position: SnotifyPosition): void;
    /**
     * Unsubscribe subscriptions
     */
    ngOnDestroy(): void;
}
