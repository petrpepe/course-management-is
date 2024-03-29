import axios from "axios";

const API_URL = "/api/roles/";

const createRole = async (roleData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, roleData, config);

  return response.data;
};

const updateRole = async (roleId, roleData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + roleId, roleData, config);

  return response.data;
};

const getRoles = async (ids, token) => {
  let params = new URLSearchParams();
  if (ids)
    typeof ids === "string"
      ? params.append("id", ids)
      : ids.map((id) => params.append("id", id));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const deleteRole = async (roleId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + roleId, config);

  return response.data;
};

const roleService = {
  createRole,
  updateRole,
  getRoles,
  deleteRole,
};

export default roleService;
