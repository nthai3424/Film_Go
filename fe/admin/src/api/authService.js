import api from "./index";

const getUrlLoginWithGoogle = async () => {
  try {
    const res = await api.get("/auth/google/url");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi Api cinema", error);
  }
};

export { getUrlLoginWithGoogle };
