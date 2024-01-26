import { LoadAdapters } from "./LoadAdapters";

const adapters = new LoadAdapters();
adapters.loadAdapters().then(() => {
    adapters.getAdapter(0).getPackageConfiguration();
});