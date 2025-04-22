import api from "./index";

const getSeatsByScreenId = async (screen_id) => {
  try {
    const res = await api.post("/get-seat-by-screen", { screen_id });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi Api seats", error);
  }
};

const updateSeat = async (id, seatData) => {
  try {
    const response = await api.put(`/seats/update/${id}`, seatData); // Hoặc patch nếu API dùng PATCH
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật ghế:", error);
    throw error; // Ném lỗi để component xử lý
  }
};

const deleteSeat = async (id) => {
  try {
    const response = await api.delete(`/seats/delete/${id}`); // Hoặc patch nếu API dùng PATCH
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật ghế:", error);
    throw error; // Ném lỗi để component xử lý
  }
};

export { getSeatsByScreenId, updateSeat, deleteSeat };
