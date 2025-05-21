import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import strings from '../strings';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiMethods<T> {
  execute: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
  get: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
  post: <D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
  put: <D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
  deleteReq: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
}

function useApi<T = any>(): [ApiState<T>, ApiMethods<T>] {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const api = axios.create({
    baseURL: strings.url,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Generic execution function
  const execute = async (url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T> | undefined> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    console.log(`[API] Executing request to: ${url}`, config);
    
    try {
      const response = await api(url, config);
      console.log(`[API] Response from ${url}:`, response.data);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
      return response;
    } catch (error) {
      const err = error as AxiosError;
      console.error(`[API] Error in request to ${url}:`, err);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (err.response) {
        console.error(`[API] Response error data:`, err.response.data);
        // Handle error based on the response from the server
        const data = err.response.data as any;
        errorMessage = data.error || data.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        console.error(`[API] Request error - no response:`, err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error(`[API] Request setup error:`, err.message);
        errorMessage = err.message || 'Request setup failed';
      }
      
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
      return undefined;
    }
  };

  // HTTP methods
  const get = (url: string, config: AxiosRequestConfig = {}) => {
    return execute(url, { ...config, method: 'GET' });
  };

  const post = <D>(url: string, data: D, config: AxiosRequestConfig = {}) => {
    return execute(url, { ...config, method: 'POST', data });
  };

  const put = <D>(url: string, data: D, config: AxiosRequestConfig = {}) => {
    return execute(url, { ...config, method: 'PUT', data });
  };

  const deleteReq = (url: string, config: AxiosRequestConfig = {}) => {
    return execute(url, { ...config, method: 'DELETE' });
  };

  return [
    state,
    { execute, get, post, put, deleteReq }
  ];
}

export default useApi; 