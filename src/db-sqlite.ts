import { DB } from './db.js';
import * as Keyv from 'keyv';

class SQLiteDB implements DB {
    private keyv: Keyv<any, Record<string, unknown>>;

    constructor() {
        this.keyv = new Keyv.default('sqlite://db/db.sqlite');

        this.keyv.on('error', (err) => {
            console.error('Keyv connection error: ', err);
        });
    }

    async get<V>(key: string): Promise<V> {
        return this.keyv.get(key);
    }

    async set<V>(key: string, value: V): Promise<boolean> {
        return this.keyv.set(key, value);
    }

    async has(key: string): Promise<boolean> {
        return this.keyv.has(key);
    }
}

export { SQLiteDB };
