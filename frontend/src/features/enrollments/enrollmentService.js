import axios from "axios";

const API_URL = "/api/enrollments/";

const createEnrollment = async (enrollmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, enrollmentData, config);

  return response.data;
};

const updateEnrollment = async (enrollmentId, enrollmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + enrollmentId,
    enrollmentData,
    config
  );

  return response.data;
};

const getEnrollments = async (ids, token) => {
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

const deleteEnrollment = async (enrollmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + enrollmentId, config);

  return response.data;
};

const enrollmentService = {
  createEnrollment,
  updateEnrollment,
  getEnrollments,
  deleteEnrollment,
};

export default enrollmentService;
