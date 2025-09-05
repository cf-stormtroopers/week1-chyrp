import Axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const BASE_URL = "http://100.109.46.43:8007";

export const AXIOS_INSTANCE = Axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    try {
        const source = Axios.CancelToken.source();

        const promise = AXIOS_INSTANCE({
            ...config,
            ...options,
            cancelToken: source.token,
        }).then(({ data }) => data);

        // @ts-ignore
        promise.cancel = () => {
            source.cancel('Query was cancelled');
        };
        return promise;
    } catch (error: AxiosError | any) {
        throw error
    }
};

export function convertUrlToAbsolute(url: string) {
    return `${BASE_URL}${url}`;
}