import * as fs from 'fs';
import * as path from 'path';
import { IAdapter } from './interfaces/Adapter.interface';
import { IDatabaseStructure } from './interfaces/DatabaseStructure.interface';

export class LoadAdapters {
    adapterRepository: any[] = [];

    // Maybe make this a singleton for safety?
    constructor() {

    }

    public getAdapter(adapterIndex: number /* THIS IS AN EXAMPLE ONLY!!! DO-NOT-DO-THIS */): IAdapter<IDatabaseStructure> {
        // TODO: Implement some sort of Adapter lookup here!
        return this.adapterRepository[adapterIndex];
    }

    public async reloadAdapters() {
        // TODO: Implement some sort of adapter reload logic but in a safe way!
    }

    public async loadAdapters() {
        try {
            const results = await this._walk('./build/adapters');
            for (let i = 0; i < results.length; i++) {
                if (!results[i].includes('.map')) {
                    const dynamicallyImported = await import(results[i]) as IAdapter<IDatabaseStructure>;
                    console.debug(dynamicallyImported);
                    if (dynamicallyImported) {
                        this.adapterRepository.push(dynamicallyImported);
                    }
                }
            }
        } catch (err) {
            console.error('Error loading adapters:', err);
        }
    }

    private _walk(dir: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, list) => {
                if (err) return reject(err);
                let results: string[] = [];
                let pending = list.length;
                if (!pending) return resolve(results);
                list.forEach((file) => {
                    file = path.resolve(dir, file);
                    fs.stat(file, (err, stat) => {
                        if (err) return reject(err);
                        if (stat && stat.isDirectory()) {
                            this._walk(file).then(res => {
                                results = results.concat(res);
                                if (!--pending) resolve(results);
                            }).catch(reject);
                        } else {
                            results.push(file);
                            if (!--pending) resolve(results);
                        }
                    });
                });
            });
        });
    }
}