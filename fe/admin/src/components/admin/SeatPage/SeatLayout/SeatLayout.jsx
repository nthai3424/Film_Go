import Seat from "@/components/admin/SeatPage/Seat/Seat";
import PropTypes from "prop-types"; // Import PropTypes
import setScreenImage from "@/assets/images/ic-screen.png";
import SeatTypePanel from "@/components/admin/SeatPage/SeatTypePanel/SeatTypePanel";

const SeatLayout = ({ seats, refetchSeats }) => {
  // Nhóm ghế theo row và số thứ tự của ghế
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const orderedGroups = {};
  for (const row in groupedSeats) {
    orderedGroups[row] = groupedSeats[row].sort((a, b) => a.number - b.number);
  }

  return (
    <div className="w-full mx-auto mt-5">
      <div className="grid place-items-center">
        <img src={setScreenImage} alt="Seat" className="w-full" />
      </div>
      {Object.keys(orderedGroups).map((row) => (
        <div key={row} className="flex justify-center flex-wrap">
          {orderedGroups[row].slice(0, 20).map((seat) => (
            <Seat key={seat.id} seat={seat} refetchSeats={refetchSeats} />
          ))}
        </div>
      ))}
      <SeatTypePanel></SeatTypePanel>
    </div>
  );
};

SeatLayout.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      screen_id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      // Thêm các thuộc tính khác nếu có
    })
  ).isRequired,
  refetchSeats: PropTypes.func.isRequired,
};
export default SeatLayout;
