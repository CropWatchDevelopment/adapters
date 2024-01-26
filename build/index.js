"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoadAdapters_1 = require("./LoadAdapters");
const adapters = new LoadAdapters_1.LoadAdapters();
adapters.loadAdapters().then(() => {
    adapters.getAdapter(0).getPackageConfiguration();
});
//# sourceMappingURL=index.js.map