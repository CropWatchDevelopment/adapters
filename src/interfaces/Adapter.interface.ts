export interface IAdapter<T> {
    getPackageConfiguration(): IAdapter<T>;
    modifyMessage(message: T): T;
}