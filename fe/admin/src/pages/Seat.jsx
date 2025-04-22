import { lazy, Suspense } from "react";

// Sử dụng lazy để tránh tải trước trong React Router
const FilterSeat = lazy(() =>
  import("@/components/admin/SeatPage/FilterSeat/FilterSeat")
);
function Seat() {
  return (
    <>
      <div className="container">
        <h2 className="mt-3 mb-3">Quản lý ghế</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <FilterSeat />
        </Suspense>
      </div>
    </>
  );
}

export default Seat;
