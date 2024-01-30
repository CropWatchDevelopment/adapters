"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterSelector = void 0;
const LoadAdapters_1 = require("./LoadAdapters");
class AdapterSelector {
    constructor() {
        this.adapters = new LoadAdapters_1.LoadAdapters(); // Assumes LoadAdapters constructor initializes the loading process
    }
    selectAdapter(company, product, version) {
        return this.adapters.getAdapter(company, product, version);
    }
}
exports.AdapterSelector = AdapterSelector;
//# sourceMappingURL=AdapterSelector.js.map