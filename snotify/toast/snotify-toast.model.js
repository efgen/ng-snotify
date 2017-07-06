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
export { SnotifyToast };
