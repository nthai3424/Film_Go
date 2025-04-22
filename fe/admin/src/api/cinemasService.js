import api from "./index";

const getCinemasByProvinceId = async (province_id) => {
  try {
    const res = await api.post("/cinemas", { province_id });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi Api cinema", error);
  }
};

export { getCinemasByProvinceId };
