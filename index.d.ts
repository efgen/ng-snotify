import { ModuleWithProviders } from '@angular/core';
export * from './snotify/snotify.component';
export * from './snotify/snotify.service';
export * from './snotify/interfaces/Snotify.interface';
export * from './snotify/interfaces/SnotifyButton.interface';
export * from './snotify/interfaces/SnotifyConfig.interface';
export * from './snotify/interfaces/SnotifyInfo.interface';
export * from './snotify/interfaces/SnotifyOptions.interface';
export * from './snotify/enum/SnotifyAction.enum';
export * from './snotify/enum/SnotifyPosition.enum';
export * from './snotify/enum/SnotifyType.enum';
export * from './snotify/toast/snotify-toast.model';
export * from './snotify/pipes/truncate.pipe';
export declare class SnotifyModule {
    static forRoot(): ModuleWithProviders;
}
