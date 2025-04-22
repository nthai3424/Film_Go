import api from "./index";

const getScreensByCinemaId = async (cinema_id) => {
  try {
    const res = await api.post("/get-screen-by-cinema", { cinema_id });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi Api screen", error);
  }
};

export { getScreensByCinemaId };
