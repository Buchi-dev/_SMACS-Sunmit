import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading, error, and state management
 * 
 * @param {Function} fetchFunction - The API function to call
 * @param {Object} options - Options for the fetch
 * @param {Array} options.dependencies - Dependencies for useEffect to trigger refetch
 * @param {Object} options.initialParams - Initial parameters to pass to the fetch function
 * @param {boolean} options.fetchOnMount - Whether to fetch data on component mount
 * @returns {Object} Data, loading state, error, refetch function, and parameters
 */
const useFetch = (fetchFunction, options = {}) => {
  const {
    dependencies = [],
    initialParams = {},
    fetchOnMount = true,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (requestParams = params) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction(requestParams);
      
      // Check if response has a data property (from axios)
      const responseData = response.data ? response.data : response;
      
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  const refetch = useCallback(async (newParams = null) => {
    if (newParams) {
      setParams(prev => ({ ...prev, ...newParams }));
      return fetchData({ ...params, ...newParams });
    }
    return fetchData();
  }, [fetchData, params]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [...dependencies, fetchFunction]);

  return { data, loading, error, refetch, params, setParams };
};

export default useFetch; 