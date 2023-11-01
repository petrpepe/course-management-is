import axios from "axios";

const API_URL = "/api/attendances/";

const createAttendance = async (attendanceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, attendanceData, config);

  return response.data;
};

const updateAttendance = async (attendanceId, attendanceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + attendanceId,
    attendanceData,
    config,
  );

  return response.data;
};

const getAttendances = async (names, itemId, token) => {
  let params = new URLSearchParams();
  params.append("names", names ? names : false);
  if (itemId) params.append("itemId", itemId);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const deleteAttendance = async (attendanceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + attendanceId, config);

  return response.data;
};

const attendanceService = {
  createAttendance,
  updateAttendance,
  getAttendances,
  deleteAttendance,
};

export default attendanceService;
