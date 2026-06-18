import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /** Set when a 401 response is retried after refreshing the access token. */
    _retry?: boolean;
  }
}
