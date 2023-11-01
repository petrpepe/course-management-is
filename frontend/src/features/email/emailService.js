import axios from "axios";

const API_URL = "/api/sendemail/";

const sendEmail = async (options, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, options, config);

  return response.data;
};

const emailService = {
  sendEmail,
};

export default emailService;
