abstract class DB {
    abstract set<V>(key: string, value: V): Promise<boolean>;
    abstract get<V>(key: string): Promise<V>;
    abstract has(key: string): Promise<boolean>;
}

export { DB };
