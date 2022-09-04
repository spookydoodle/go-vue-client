export interface ResponseData<T = undefined> {
    error?: boolean;
    message?: string;
    Data?: T
}
