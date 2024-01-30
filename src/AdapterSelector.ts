import { IAdapter } from './interfaces/Adapter.interface';
import { LoadAdapters } from './LoadAdapters';

export class AdapterSelector {
    private adapters: LoadAdapters;

    constructor() {
        this.adapters = new LoadAdapters(); // Assumes LoadAdapters constructor initializes the loading process
    }

    public selectAdapter(company: string, product: string, version: string): IAdapter<any> | null {
        return this.adapters.getAdapter(company, product, version);
    }
}
