import seatVIPImage from "@/assets/images/Seat.png";
import seatNormalImage from "@/assets/images/seatnormal.png";
import seatCoupleImage from "@/assets/images/seatcouple.png";
import seatNormalImageErr from "@/assets/images/seat-error-normal.png";

function SeatTypePanel() {
  return (
    <div className="seat-type-panel flex justify-center mt-4">
      <div className="w-[100px] text-center">
        <img src={seatNormalImage} alt="Seat" className="w-[30px] h-[30px] m-auto" />
        <p>Ghế thường</p>
      </div>
      <div className="w-[100px] text-center">
        <img src={seatVIPImage} alt="Seat" className="w-[30px] h-[30px] m-auto" />
        <p>Ghế VIP</p>
      </div>
      <div className="w-[100px] text-center">
        <img src={seatCoupleImage} alt="Seat" className="w-[58px] h-[30px] m-auto" />
        <p>Ghế đôi</p>
      </div>
      <div className="w-[100px] text-center">
      <img src={seatNormalImageErr} alt="Seat" className="w-[30px] h-[30px] m-auto" />
        <p>Ghế hỏng</p>
      </div>
    </div>
  );
}

export default SeatTypePanel;
