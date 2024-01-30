"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyMessage = exports.getPackageConfiguration = void 0;
function getPackageConfiguration() {
    console.log('HIHIHI I AM THE TMEPNPK ADAPTER');
    let struct = {
        Temperature: 1,
        Humidity: 2,
    };
    return struct;
}
exports.getPackageConfiguration = getPackageConfiguration;
function modifyMessage(message) {
    console.log(message);
    // MODIFY HERE!
    let output = message;
    return output;
}
exports.modifyMessage = modifyMessage;
//# sourceMappingURL=CW_SS_TMEPNPK.js.map