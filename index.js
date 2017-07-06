import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnotifyComponent } from './snotify/snotify.component';
import { ToastComponent } from './snotify/toast/toast.component';
import { IconComponent } from './snotify/toast/icon/icon.component';
import { SnotifyService } from './snotify/snotify.service';
import { TruncatePipe } from './snotify/pipes/truncate.pipe';
export * from './snotify/snotify.component';
export * from './snotify/snotify.service';
export * from './snotify/enum/SnotifyAction.enum';
export * from './snotify/enum/SnotifyPosition.enum';
export * from './snotify/enum/SnotifyType.enum';
export * from './snotify/toast/snotify-toast.model';
export * from './snotify/pipes/truncate.pipe';
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
export { SnotifyModule };
SnotifyModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
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
