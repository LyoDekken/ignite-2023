import axios, { AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";

type PromiseType = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

type ProcessQueueParams = {
  error: Error | null;
  token: string | null;
};

interface RegisterInterceptTokenManager {
  signOut: () => void;
  refreshTokenUpdated: (newToken: string) => void;
}

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: ({}: RegisterInterceptTokenManager) => () => void;
}

const api = axios.create({
  baseURL: process.env.BASE_URL as string,
}) as APIInstanceProps;

let isRefresh = false;

let failedQueue: Array<PromiseType> = [];

const processQueue = ({ error, token = null }: ProcessQueueParams): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

api.registerInterceptTokenManager = ({ signOut, refreshTokenUpdated }) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const oldToken = await storageAuthTokenGet();

          if (!oldToken) {
            signOut();

            return Promise.reject(requestError);
          }

          const originalRequest = requestError.config;

          if (isRefresh) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve,
                reject,
              });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;

                return axios(originalRequest);
              })
              .catch((error) => {
                throw error;
              });
          }

          isRefresh = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                token: oldToken,
              });

              await storageAuthTokenSave(data.token);

              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;
              
              originalRequest.headers["Authorization"] = `Bearer ${data.token}`;

              refreshTokenUpdated(data.token);

              processQueue({
                error: null,
                token: data.token,
              });

              resolve(originalRequest);
            } catch (error: any) {
              processQueue({
                error,
                token: null,
              });

              signOut();

              reject(error);
            } finally {
              isRefresh = false;
            }
          });
        }

        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      }

      return Promise.reject(new AppError(requestError));
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
