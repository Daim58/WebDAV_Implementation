var HotPatcher = require("hot-patcher")
let __patcher = new HotPatcher();
export function getPatcher(): typeof HotPatcher {
    if (!__patcher) {
        __patcher = new HotPatcher();
    }
    return __patcher;
}