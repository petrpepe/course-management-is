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
    config
  );

  return response.data;
};

const getAttendances = async (ids, dates, token) => {
  let params = new URLSearchParams();
  if (ids) {
    typeof ids === "string"
      ? params.append("id", ids)
      : ids.map((id) => params.append("id", id));
  }
  if (dates && dates.startDatetime && dates.endDatetime) {
    params.append("startDatetime", dates.startDatetime);
    params.append("endDatetime", dates.endDatetime);
  }
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
