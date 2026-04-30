import { useCallback, useState } from "react";
import { REQUEST_RETRY_CONFIG } from "../services/createApiClient";

const initialState = {
  isLoading: false,
  error: null,
  attempt: 0,
  maxAttempts: REQUEST_RETRY_CONFIG.maxAttempts,
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
      });

      const requestConfig = {
        onRetryAttempt: ({ attempt, maxAttempts }) => {
          setState((current) => ({
            ...current,
            attempt,
            maxAttempts,
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

  return {
    ...state,
    isRetrying: state.isLoading && state.attempt > 1,
    timeoutMs: REQUEST_RETRY_CONFIG.timeoutMs,
    run,
    reset,
  };
};
