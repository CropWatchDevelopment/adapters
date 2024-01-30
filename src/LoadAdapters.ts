import * as fs from 'fs';
import * as path from 'path';
import { IAdapter } from './interfaces/Adapter.interface';

interface AdapterStore {
    [company: string]: {
        [product: string]: {
            [version: string]: IAdapter<any>
        }
    }
}

export class LoadAdapters {
    private adapterStore: AdapterStore = {};

    constructor(private baseDir: string = './src/adapters') {
        this.loadAdapters();
    }

    private loadAdapters(): void {
        fs.readdirSync(this.baseDir, { withFileTypes: true }).forEach(companyDir => {
            if (companyDir.isDirectory()) {
                const companyPath = path.join(this.baseDir, companyDir.name);
                this.adapterStore[companyDir.name] = {};

                fs.readdirSync(companyPath, { withFileTypes: true }).forEach(productDir => {
                    if (productDir.isDirectory()) {
                        const productPath = path.join(companyPath, productDir.name);
                        this.adapterStore[companyDir.name][productDir.name] = {};

                        fs.readdirSync(productPath, { withFileTypes: true }).forEach(async versionDir => {
                            if (versionDir.isDirectory()) {
                                const versionPath = path.join(productPath, versionDir.name);
                                const adapterPath = `${__dirname}/adapters/${companyDir.name}/${productDir.name}/${versionDir.name}/`;
                                fs.readdir(adapterPath, (err, files) => {
                                    files.forEach(async file => {
                                        console.log(file);
                                        console.log("Current directory:", __dirname);
                                        if (!file.includes('.map')) {
                                            const withFileName = `${adapterPath}${file}`;
                                            const AdapterClass = require(withFileName).default; // Assuming each version directory has a default export of the adapter class
                                            this.adapterStore[companyDir.name][productDir.name][versionDir.name] = new AdapterClass();
                                        }
                                    });
                                });

                            }
                        });
                    }
                });
            }
        });
    }

    public getAdapter(company: string, product: string, version: string): IAdapter<any> | null {
        return this.adapterStore[company]?.[product]?.[version] || null;
    }
}
