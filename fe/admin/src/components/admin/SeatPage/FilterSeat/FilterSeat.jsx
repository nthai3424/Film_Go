import { useEffect, useState } from "react";
import { getProvinces } from "@/api/provincesService";
import { getCinemasByProvinceId } from "@/api/cinemasService";
import { getScreensByCinemaId } from "@/api/screensService";
import { Select, Button } from "antd";
import { getSeatsByScreenId } from "@/api/seatsService";
import SeatLayout from "@/components/admin/SeatPage/SeatLayout/SeatLayout";
import AddSeatForm from "@/components/admin/SeatPage/AddSeatForm/AddSeatForm";
import Modal from "react-modal"; // Import Modal

function FilterSeat() {
  const [selectedProvince, setSelectedProvince] = useState(undefined);
  const [provinces, setProvinces] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(undefined);
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(undefined);
  const [seats, setSeats] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    getProvinces().then((res) => {
      if (res && res.data && res.data.length > 0) {
        setProvinces(res.data);
        // console.log(res.data)
      }
    });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCinemasByProvinceId(selectedProvince).then((res) => {
        if (res && res.data) {
          setCinemas(res.data);
          // console.log(res.data)
        }
      });
    } else {
      setCinemas([]);
    }
  }, [selectedProvince]); // Gọi lại useEffect khi selectedProvince thay đổi

  useEffect(() => {
    if (selectedCinema) {
      getScreensByCinemaId(selectedCinema).then((res) => {
        if (res && res.data) {
          setScreens(res.data);
          // console.log(res.data)
        }
      });
    } else {
      setScreens([]);
    }
  }, [selectedCinema]); // Gọi lại useEffect khi selectedProvince thay đổi

  useEffect(() => {
    if (selectedScreen) {
      getSeatsByScreenId(selectedScreen).then((res) => {
        if (res && res.data) {
          setSeats(res.data);
          // console.log(res.data)
        }
      });
    } else {
      setSeats([]);
    }
  }, [selectedScreen]); // Gọi lại useEffect khi selectedScreen thay đổi

  const handleChangeProvince = (value) => {
    setSelectedProvince(value);
    setSelectedCinema(undefined); // Reset cinema
    setScreens([]); // Reset screen
    setSelectedScreen(undefined); // Reset selectedScreen
    setSeats([]); // Reset seats
  };

  const refetchSeats = () => {
      getSeatsByScreenId(selectedScreen).then((res) => {
        if (res && res.data) {
          setSeats(res.data);
        } else {
          setSeats([]);
        }
      });
  };

  const handleChangeCinema = (value) => {
    setSelectedCinema(value);
    setSelectedScreen(undefined); // Reset screen
    setSeats([]); // Reset seats
  };

  const handleChangeScreen = (value) => {
    setSelectedScreen(value);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  return (
    <>
      <div className="d-flex">
        {provinces.length > 0 && (
          <Select
            value={selectedProvince}
            onChange={handleChangeProvince} // Truyền handleChangeProvince
            options={provinces.map((province) => ({
              value: province.id,
              label: province.name,
            }))}
            placeholder="Tỉnh thành"
            style={{ width: "30%", marginRight: "3%" }} // Thêm style
          />
        )}
        {cinemas.length > 0 && (
          <Select
            value={selectedCinema}
            onChange={handleChangeCinema} // Truyền handleChangeCinema
            options={cinemas.map((cinema) => ({
              value: cinema.id,
              label: cinema.name,
            }))}
            placeholder="Chọn rạp phim"
            style={{ width: "30%", marginRight: "3%" }} // Thêm style
          />
        )}
        {screens.length > 0 && (
          <Select
            value={selectedScreen}
            onChange={handleChangeScreen} // Truyền handleChangeScreen
            options={screens.map((screen) => ({
              value: screen.id,
              label: screen.name,
            }))}
            placeholder="Chọn rạp chiếu"
            style={{ width: "30%", marginRight: "3%" }} // Thêm style
          />
        )}
        {selectedScreen && (
          <div>
            <Button variant="solid" color="primary" onClick={handleAddClick}>
              Thêm
            </Button>
            <Modal
              isOpen={showAddForm} // Hiển thị modal khi showAddForm là true
              onRequestClose={() => setShowAddForm(false)} // Đóng modal khi click ra ngoài hoặc nhấn Esc
              contentLabel="Thêm Ghế Mới" // Nhãn cho modal (cho mục đích trợ năng)
              ariaHideApp={false}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền tối
                  zIndex: 1000, // Đảm bảo modal nằm trên các phần tử khác
                },
                content: {
                  width: "600px", // Chiều rộng modal
                  margin: "auto", // Căn giữa modal
                  padding: "20px",
                },
              }}
            >
              <AddSeatForm screenId={selectedScreen} setShowAddForm={setShowAddForm} refetchSeats={refetchSeats}/>
            </Modal>
          </div>
        )}
      </div>
      {seats.length > 0 && <SeatLayout seats={seats} refetchSeats={refetchSeats}/>}
    </>
  );
}

export default FilterSeat;
