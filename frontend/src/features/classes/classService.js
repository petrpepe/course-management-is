import axios from "axios";

const API_URL = "/api/classes/";

const createClass = async (classData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, classData, config);

  return response.data;
};

const updateClass = async (classId, classData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + classId, classData, config);

  return response.data;
};

const getClasses = async (ids, keyword, token) => {
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

  const response = await axios.get(API_URL, config);

  return response.data;
};

const deleteClass = async (classId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + classId, config);

  return response.data;
};

const classService = {
  createClass,
  updateClass,
  getClasses,
  deleteClass,
};

export default classService;
