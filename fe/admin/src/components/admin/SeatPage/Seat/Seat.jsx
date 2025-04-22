import { useState } from "react";
import PropTypes from "prop-types";
import seatVIPImage from "@/assets/images/Seat.png";
import seatVIPImageErr from "@/assets/images/seat-error-vip.png";
import seatNormalImage from "@/assets/images/seatnormal.png";
import seatNormalImageErr from "@/assets/images/seat-error-normal.png";
import seatCoupleImage from "@/assets/images/seatcouple.png";
import seatCoupleImageErr from "@/assets/images/seat-error-double.png";
import UpdateSeatForm from "@/components/admin/SeatPage/UpdateSeatForm/UpdateSeatForm";
import { updateSeat } from "@/api/seatsService";
import { deleteSeat } from "@/api/seatsService";
import { message } from "antd"; // Import message

const Seat = ({ seat, refetchSeats }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  let seatImage = seatNormalImage;
  if (seat.type === "Ghế vip" && seat.status === "available") {
    seatImage = seatVIPImage;
  } else if (seat.type === "Ghế đôi" && seat.status === "available") {
    seatImage = seatCoupleImage;
  } else if (seat.type === "Ghế vip" && seat.status === "reserved") {
    seatImage = seatVIPImageErr;
  } else if (seat.type === "Ghế đôi" && seat.status === "reserved") {
    seatImage = seatCoupleImageErr;
  } else if (seat.type === "Ghế thường" && seat.status === "reserved") {
    seatImage = seatNormalImageErr;
  }

  const handleClick = () => {
    setShowUpdateForm(true);
  };
  const handleCancel = () => {
    setShowUpdateForm(false);
  };

  const handleDelete = async () => {
    try {
      await deleteSeat(seat.id);
      refetchSeats();
      message.success("Xóa ghế thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa ghế:", error);
    }
  };

  const handleUpdate = async (updatedSeat) => {
    try {
      await updateSeat(updatedSeat.id, updatedSeat);
      setShowUpdateForm(false);
      refetchSeats();
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  };

  return (
    <>
      <span
        className="relative h-[30px] m-[5px] border-none cursor-pointer"
        onClick={() => handleClick()}
      >
        <img src={seatImage} alt="Seat" className="w-full h-full" />
        {seat.status === "available" && (
          <span className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[10px]">
            {seat.seat_code}
          </span>
        )}
        {seat.status === "reserved" && (
          <span className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[10px] text-white">
            {seat.seat_code}
          </span>
        )}
      </span>
      <UpdateSeatForm
        seat={seat}
        visible={showUpdateForm}
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};

Seat.propTypes = {
  // Thêm propTypes ở đây
  seat: PropTypes.object.isRequired,
  refetchSeats: PropTypes.func.isRequired,
};

export default Seat;
