import axios from "axios";

const API_URL = "/api/users/";

const createUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, userData, config);

  return response.data;
};

const updateUser = async (userId, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + userId, userData, config);

  return response.data;
};

const getUsers = async (ids, keyword, token) => {
  let params = new URLSearchParams();
  if (ids)
    typeof ids === "string"
      ? params.append("id", ids)
      : ids.map((id) => params.append("id", id));
  if (keyword) params.append("keyword", keyword);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const response = await axios.get(API_URL + "all", config);

  return response.data;
};

const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + userId, config);

  return response.data;
};

const userService = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
};

export default userService;
