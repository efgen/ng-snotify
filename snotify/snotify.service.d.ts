import { SnotifyToast } from './toast/snotify-toast.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SnotifyInfo } from './interfaces/SnotifyInfo.interface';
import { SnotifyOptions } from './interfaces/SnotifyOptions.interface';
import { SnotifyConfig } from './interfaces/SnotifyConfig.interface';
/**
 * SnotifyService - create, remove, config toasts
 */
export declare class SnotifyService {
    readonly emitter: Subject<SnotifyToast[]>;
    readonly lifecycle: Subject<SnotifyInfo>;
    readonly optionsChanged: Subject<SnotifyOptions>;
    readonly toastChanged: Subject<SnotifyToast>;
    readonly toastDeleted: Subject<number>;
    private config;
    private _options;
    private notifications;
    onInit: (info?: SnotifyToast) => void;
    onClick: (info?: SnotifyToast) => void;
    onHoverEnter: (info?: SnotifyToast) => void;
    onHoverLeave: (info?: SnotifyToast) => void;
    beforeDestroy: (info?: SnotifyToast) => void;
    afterDestroy: (info?: SnotifyToast) => void;
    /**
     * Generates random id
     * @return {number}
     */
    static generateRandomId(): number;
    /**
     * Simple is object check.
     * @param item {Object<any>}
     * @returns {boolean}
     */
    static isObject(item: any): boolean;
    /**
     * Deep merge objects.
     * @param sources {Array<Object>}
     * @returns {Object<any>}
     */
    static mergeDeep(...sources: any[]): {};
    /**
     * Constructor - initialize base configuration objects
     */
    constructor();
    /**
     * emit changes in notifications array
     */
    private emit();
    /**
     * Set global config
     * @param config {SnotifyConfig}
     * @param options {SnotifyOptions}
     */
    setConfig(config: SnotifyConfig, options?: SnotifyOptions): void;
    /**
     * get SnotifyOptions
     * @return {SnotifyOptions}
     */
    readonly options: SnotifyOptions;
    /**
     * returns SnotifyToast object
     * @param id {Number}
     * @return {undefined|SnotifyToast}
     */
    get(id: number): SnotifyToast;
    /**
     * returns copy of notifications array
     * @return {SnotifyToast[]}
     */
    private getAll();
    /**
     * add SnotifyToast to notifications array
     * @param toast {SnotifyToast}
     */
    private add(toast);
    /**
     * If ID passed, emits toast animation remove, if ID & REMOVE passed, removes toast from notifications array
     * @param id {Number}
     * @param remove {Boolean}
     */
    remove(id?: number, remove?: boolean): void;
    /**
     * Clear notifications array
     */
    clear(): void;
    /**
     * Creates toast and add it to array, returns toast id
     * @param snotify {Snotify}
     * @return {number}
     */
    private create(snotify);
    /**
     * Create toast with Success style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    success(title: string, body: string, config?: SnotifyConfig): number;
    /**
     * Create toast with Error style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    error(title: string, body: string, config?: SnotifyConfig): number;
    /**
     * Create toast with Info style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    info(title: string, body: string, config?: SnotifyConfig): number;
    /**
     * Create toast with Warining style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    warning(title: string, body: string, config?: SnotifyConfig): number;
    /**
     * Create toast without style, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    simple(title: string, body: string, config?: SnotifyConfig): number;
    /**
     * Create toast with Confirm style {with two buttons}, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    confirm(title: string, body: string, config: SnotifyConfig): number;
    /**
     * Create toast with Prompt style {with two buttons}, returns toast id;
     * @param title {String}
     * @param body {String}
     * @param config {SnotifyConfig}
     * @return {number}
     */
    prompt(title: string, body: string, config: SnotifyConfig): number;
    /**
     * Creates async toast with Info style. Pass action, and resolve or reject it.
     * @param title {String}
     * @param body {String}
     * @param action {Promise<SnotifyConfig> | Observable<SnotifyConfig>}
     * @return {number}
     */
    async(title: string, body: string, action: Promise<SnotifyConfig> | Observable<SnotifyConfig>): number;
}
