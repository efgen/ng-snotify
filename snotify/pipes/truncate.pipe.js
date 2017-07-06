import { Pipe } from '@angular/core';
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
export { TruncatePipe };
TruncatePipe.decorators = [
    { type: Pipe, args: [{
                name: 'truncate'
            },] },
];
/** @nocollapse */
TruncatePipe.ctorParameters = function () { return []; };
