import axios from "axios";

const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 5000;

const getTimeoutMs = () => {
  const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);
  return Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_TIMEOUT_MS;
};

const getRetryDelayMs = () => {
  const configuredDelay = Number(import.meta.env.VITE_API_RETRY_DELAY_MS);
  return Number.isFinite(configuredDelay) && configuredDelay > 0
    ? configuredDelay
    : DEFAULT_RETRY_DELAY_MS;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getFailureReason = (error) => {
  if (error.code === "ECONNABORTED") {
    return "timeout";
  }

  if (error.code === "ERR_NETWORK") {
    return "network";
  }

  if (error.response?.status >= 500) {
    return "server";
  }

  return "unknown";
};

const shouldRetry = (error) => {
  if (!error.config) {
    return false;
  }

  if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
    return true;
  }

  const status = error.response?.status;
  return status >= 500 && status < 600;
};

export const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: getTimeoutMs(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      if (!config || !shouldRetry(error)) {
        return Promise.reject(error);
      }

      config.__retryAttempt = config.__retryAttempt || 1;

      if (config.__retryAttempt >= DEFAULT_MAX_ATTEMPTS) {
        return Promise.reject(error);
      }

      config.__retryAttempt += 1;

      await wait(getRetryDelayMs());

      config.onRetryAttempt?.({
        attempt: config.__retryAttempt,
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
        failureReason: getFailureReason(error),
      });

      return client(config);
    },
  );

  return client;
};

export const REQUEST_RETRY_CONFIG = {
  maxAttempts: DEFAULT_MAX_ATTEMPTS,
  timeoutMs: getTimeoutMs(),
  retryDelayMs: getRetryDelayMs(),
};

export const getRequestFailureReason = getFailureReason;
