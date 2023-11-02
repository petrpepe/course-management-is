import axios from "axios";

const API_URL = "/api/providers/";

const createProvider = async (providerData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, providerData, config);

  return response.data;
};

const updateProvider = async (providerId, providerData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + providerId, providerData, config);

  return response.data;
};

const getProviders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const deleteProvider = async (providerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + providerId, config);

  return response.data;
};

const providerService = {
  createProvider,
  updateProvider,
  getProviders,
  deleteProvider,
};

export default providerService;
