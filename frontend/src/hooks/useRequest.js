import { useCallback, useEffect, useState } from "react";
import {
  REQUEST_RETRY_CONFIG,
  getRequestFailureReason,
} from "../services/createApiClient";

const getTimeoutSeconds = () => Math.ceil(REQUEST_RETRY_CONFIG.timeoutMs / 1000);

const initialState = {
  isLoading: false,
  error: null,
  attempt: 0,
  maxAttempts: REQUEST_RETRY_CONFIG.maxAttempts,
  remainingSeconds: getTimeoutSeconds(),
  lastFailureReason: null,
};

export const useRequest = ({ onSuccess, onError } = {}) => {
  const [state, setState] = useState(initialState);

  const run = useCallback(
    async (requestFn) => {
      setState({
        isLoading: true,
        error: null,
        attempt: 1,
        maxAttempts: REQUEST_RETRY_CONFIG.maxAttempts,
        remainingSeconds: getTimeoutSeconds(),
        lastFailureReason: null,
      });

      const requestConfig = {
        onRetryAttempt: ({ attempt, maxAttempts, failureReason }) => {
          setState((current) => ({
            ...current,
            attempt,
            maxAttempts,
            remainingSeconds: getTimeoutSeconds(),
            lastFailureReason: failureReason,
          }));
        },
      };

      try {
        const result = await requestFn(requestConfig);
        setState((current) => ({
          ...current,
          isLoading: false,
          error: null,
        }));
        onSuccess?.(result);
        return result;
      } catch (error) {
        setState((current) => ({
          ...current,
          isLoading: false,
          error,
          lastFailureReason: getRequestFailureReason(error),
        }));
        onError?.(error);
        throw error;
      }
    },
    [onError, onSuccess],
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setState((current) => {
        if (!current.isLoading || current.remainingSeconds <= 0) {
          return current;
        }

        return {
          ...current,
          remainingSeconds: current.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.attempt, state.isLoading]);

  return {
    ...state,
    isRetrying: state.isLoading && state.attempt > 1,
    timeoutMs: REQUEST_RETRY_CONFIG.timeoutMs,
    run,
    reset,
  };
};
