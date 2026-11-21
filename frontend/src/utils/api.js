
const API_BASE_URL = "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("smartlib_token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong with the API");
  }

  return data;
};

export default api;
