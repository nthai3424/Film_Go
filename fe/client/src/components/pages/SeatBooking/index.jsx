/* eslint-disable react/prop-types */
import { CopyOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Descriptions, List, message, Modal, Popover, Row, Spin } from 'antd';
import { HttpStatusCode } from 'axios';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import screen from '../../../../public/images/content/screen.png';
import { handleToggleModalAuth } from '../../../app/slices/appSlice';
import { formatTime } from '../../../helpers/formatTime';
import { formatVND } from '../../../helpers/formatVND';
import { handleBuilderMovies } from '../../../helpers/handleReBuildMovies';
import axios from '../../../libs/axios';
import { routes } from '../../../routes';
import { useGetMovie } from '../../../services/movie/useGetMovie';
import { useGetAllProduct } from '../../../services/product/getAllProduct';
import { useGetScreen } from '../../../services/screen/getScreen';
import { useCreateOrder } from '../../../services/seat/createOrder';
import { useGetSeatByScreenBooked } from '../../../services/seat/getSeatBooked';
import { useGetSeatByScreen } from '../../../services/seat/getSeatByScreen';
import { useGetShowTime } from '../../../services/showtime/getShowTime';
import ContainerWapper from '../../templates/ContainerWapper';
import MovieTicketBooking from '../BookingType';

const SeatBooking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const queryParams = useMemo(() => Object?.fromEntries(searchParams.entries()), [searchParams]);
    const [booking, setBooking] = useState([]);
    const [dataHold, setDataHold] = useState([]);

    const { data: movieData } = useGetMovie({ id: queryParams?.filmId });
    const { data: showTimeData } = useGetShowTime({ id: queryParams?.showtime });
    const { data: screenData } = useGetScreen({ id: id });
    const [isModalCheckOut, setIsModalCheckOut] = useState(false);
    const movie = useMemo(() => (movieData?.data ? handleBuilderMovies(movieData?.data) : null), [movieData]);
    const [promoCode, setPromoCode] = useState([]);

    useEffect(() => {
        const _fetch = async () => {
            try {
                const res = await axios.get('https://booking-runtime.vercel.app/booking');
                if (res.data.code === HttpStatusCode.Ok) {
                    setDataHold(res.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const id = setInterval(_fetch, 600);
        return () => clearInterval(id);
    }, []);

    const toggleHold = async (id, type) => {
        try {
            if (type === 'add') {
                await axios.post('https://booking-runtime.vercel.app/booking', {
                    id,
                    show_time_id: queryParams?.showtime,
                });
            } else {
                await axios.delete(`https://booking-runtime.vercel.app/booking/${id}/${queryParams?.showtime}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const _fetch = async () => {
            const { data } = await axios.get(`/promocodes`);
            if (data) {
                setPromoCode(data?.data);
            }
        };
        _fetch();
    }, []);

    const formatDate = useMemo(() => {
        if (!showTimeData?.data?.date) return '';
        const date = new Date(showTimeData?.data?.date);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const formatOptions = isToday
            ? { day: '2-digit', month: 'short' }
            : { weekday: 'short', day: '2-digit', month: 'short' };
        return isToday
            ? `Today, ${new Intl.DateTimeFormat('en-GB', formatOptions).format(date)}`
            : new Intl.DateTimeFormat('en-GB', formatOptions).format(date);
    }, [showTimeData]);

    const dispatch = useDispatch();
    const { isLoginIn } = useSelector((state) => state.app.auth);
    const handleToggle = () => {
        dispatch(handleToggleModalAuth(true));
    };

    useEffect(() => {
        handleToggle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isLoginIn) {
            window.location.href = '/';
        }
    }, [isLoginIn]);

    const { data, isLoading } = useGetSeatByScreen({
        payload: {
            screen_id: id,
        },
    });

    const { data: dataSeatBooked, isLoading: isLoadingSeatBooked } = useGetSeatByScreenBooked({
        payload: {
            showtime_id: queryParams?.showtime,
        },
    });

    const dataRenderSeat = useMemo(
        () =>
            data?.data
                ? (() => {
                      const dataSeatBookedArr = dataSeatBooked?.data ? dataSeatBooked?.data : [];
                      data.data.sort((a, b) => {
                          if (a.row < b.row) return -1;
                          if (a.row > b.row) return 1;
                          return a.number - b.number;
                      });

                      const dataBuildItem = [];
                      data.data.forEach((item) => {
                          const index = dataBuildItem.findIndex((itemChild) => itemChild.row === item.row);
                          const isBooked = dataSeatBookedArr.find(
                              (itemSeatBookedChild) => itemSeatBookedChild.seat_id === item.id,
                          )
                              ? true
                              : false;
                          item.isBooked = isBooked;
                          if (index === -1) {
                              dataBuildItem.push({
                                  row: item.row,
                                  seats: [item],
                              });
                          } else {
                              dataBuildItem[index].seats.push(item);
                          }
                      });

                      return dataBuildItem;
                  })()
                : [],
        [data, dataSeatBooked],
    );

    const handleNextStep = () => {
        if (!booking.length) {
            Swal.fire({
                icon: 'info',
                text: 'Vui lòng chọn ghế trước!',
            });
            return;
        }
        setIsModalCheckOut(true);
    };

    const createOrderMutation = useCreateOrder({
        mutationConfig: {
            onSuccess(data) {
                const popup = window.open(data.payment_url, 'Thanh toán', 'width=600,height=700');

                if (!popup) {
                    Swal.fire({
                        icon: 'warning',
                        text: 'Trình duyệt đang chặn popup. Hãy tắt chặn popup để tiếp tục thanh toán!',
                    });
                    return;
                }

                setInterval(() => {
                    axios.get('/tickets').then((res) => {
                        const { data } = res.data;
                        if (data[0]?.status === 'paid') {
                            popup.close();
                            Swal.fire({
                                icon: 'success',
                                text: 'Đặt vé thành công!',
                            }).then(() => {
                                window.location.href = `/confirmation-screen?id=${data[0]?.ticket_id}`;
                            });
                        }
                    });
                }, 1000);
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'info',
                    text: error.response.data.message,
                });
            },
        },
    });

    const handleCreateOrder = (dataOrder, discount = '') => {
        // const valid = isValidBooking(dataRenderSeat, booking);
        // if (!valid) return;

        const formData = new FormData();
        formData.append('showtime_id', queryParams?.showtime);
        booking.forEach((item) => {
            formData.append('seat_ids[]', item.id);
        });
        dataOrder.forEach((item, index) => {
            formData.append(`products[${index}][product_id]`, item.id);
            formData.append(`products[${index}][quantity]`, item.quantity);
        });
        formData.append('payment_method_id', 1);
        if (discount) {
            const discountFind = promoCode.find((item) => item.code === discount.trim());
            if (discountFind) {
                const currentDate = new Date().toISOString().split('T')[0];
                const disabled = discountFind.status !== 'active' || discountFind.end_date < currentDate;
                if (!disabled) {
                    formData.append('promo_code_id', parseInt(discountFind?.id));
                } else {
                    Swal.fire({
                        icon: 'info',
                        text: 'Mã giảm giá của bạn đã ngừng kích hoạt hoặc hết hạn',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    text: 'Mã giảm giá của bạn không chính sác chúng tôi sẽ tiếp tục tạo đơn hàng cho bạn.',
                });
            }
        }

        createOrderMutation.mutate(formData);
    };

    function isValidBooking(seats, selectedSeats) {
        if (selectedSeats.length === 0) {
            console.error('Không có ghế nào được chọn.');
            return false;
        }

        const seatMap = {};
        const rowMaxCols = {};
        const rowMinCols = {};
        seats.forEach((row) => {
            row.seats.forEach((seat) => {
                const seatCode = seat.row + seat.number;
                const rowIndex = row.row.charCodeAt(0) - 'A'.charCodeAt(0);
                const colIndex = parseInt(seat.number) - 1;
                seatMap[seatCode] = {
                    row: rowIndex,
                    col: colIndex,
                    isBooked: seat.isBooked,
                };
                if (!rowMaxCols[row.row]) {
                    rowMaxCols[row.row] = colIndex;
                    rowMinCols[row.row] = colIndex;
                } else {
                    rowMaxCols[row.row] = Math.max(rowMaxCols[row.row], colIndex);
                    rowMinCols[row.row] = Math.min(rowMinCols[row.row], colIndex);
                }
            });
        });

        for (const seat of selectedSeats) {
            const seatCode = seat.name;
            if (!seatMap[seatCode]) {
                Swal.fire({
                    icon: 'info',
                    text: `Ghế ${seatCode} không tồn tại trong rạp.`,
                });
                return false;
            }
            if (seatMap[seatCode].isBooked) {
                Swal.fire({
                    icon: 'info',
                    text: `Ghế ${seatCode} đã được đặt.`,
                });
                return false;
            }
        }

        const selectedCoords = selectedSeats.map((seat) => seatMap[seat.name]);
        const row = selectedCoords[0].row;
        const cols = selectedCoords.map((coord) => coord.col).sort((a, b) => a - b);

        // Kiểm tra cùng hàng
        if (!selectedCoords.every((coord) => coord.row === row)) {
            Swal.fire({
                icon: 'info',
                text: 'Các ghế không ở cùng một hàng.',
            });
            return false;
        }

        for (let i = 1; i < cols.length; i++) {
            if (cols[i] !== cols[i - 1] + 1) {
                Swal.fire({
                    icon: 'info',
                    text: 'Có ghế trống ở giữa các ghế đã chọn.',
                });
                return false;
            }
        }

        const selectedSet = new Set(selectedSeats.map((seat) => seat.name));
        const rowLabel = String.fromCharCode('A'.charCodeAt(0) + row);
        const maxColInRow = rowMaxCols[rowLabel];
        const minColInRow = rowMinCols[rowLabel];

        const maxCol = Math.max(...cols);
        if (maxCol === maxColInRow - 1) {
            // Ghế thứ 2 từ cuối
            const rightSeatCode = rowLabel + (maxCol + 2);
            if (!selectedSet.has(rightSeatCode) && !seatMap[rightSeatCode].isBooked) {
                Swal.fire({
                    icon: 'info',
                    text: `Việc đặt ghế để lại ghế trống ở bên phải (${rightSeatCode}).`,
                });
                return false;
            }
        }

        const minCol = Math.min(...cols);
        if (minCol === minColInRow + 1) {
            // Ghế thứ 2 từ đầu
            const leftSeatCode = rowLabel + minCol;
            if (!selectedSet.has(leftSeatCode) && !seatMap[leftSeatCode].isBooked) {
                Swal.fire({
                    icon: 'info',
                    text: `Việc đặt ghế để lại ghế trống ở bên trái (${leftSeatCode}).`,
                });
                return false;
            }
        }

        for (const col of cols) {
            if (row > 0) {
                const topRowLabel = String.fromCharCode('A'.charCodeAt(0) + row - 1);
                const maxColInTopRow = rowMaxCols[topRowLabel];
                const minColInTopRow = rowMinCols[topRowLabel];
                const topSeatCode = topRowLabel + (col + 1);

                if (
                    col === maxColInTopRow - 1 &&
                    seatMap[topSeatCode] &&
                    !selectedSet.has(topSeatCode) &&
                    !seatMap[topSeatCode].isBooked
                ) {
                    const topRightSeatCode = topRowLabel + (col + 2);
                    if (
                        seatMap[topRightSeatCode] &&
                        !selectedSet.has(topRightSeatCode) &&
                        !seatMap[topRightSeatCode].isBooked
                    ) {
                        Swal.fire({
                            icon: 'info',
                            text: `Việc đặt ghế để lại ghế trống ở hàng trên (${topRightSeatCode}).`,
                        });
                        return false;
                    }
                }

                if (
                    col === minColInTopRow + 1 &&
                    seatMap[topSeatCode] &&
                    !selectedSet.has(topSeatCode) &&
                    !seatMap[topSeatCode].isBooked
                ) {
                    const topLeftSeatCode = topRowLabel + col;
                    if (
                        seatMap[topLeftSeatCode] &&
                        !selectedSet.has(topLeftSeatCode) &&
                        !seatMap[topLeftSeatCode].isBooked
                    ) {
                        Swal.fire({
                            icon: 'info',
                            text: `Việc đặt ghế để lại ghế trống ở hàng trên (${topLeftSeatCode}).`,
                        });
                        return false;
                    }
                }
            }

            if (row < seats.length - 1) {
                const bottomRowLabel = String.fromCharCode('A'.charCodeAt(0) + row + 1);
                const maxColInBottomRow = rowMaxCols[bottomRowLabel];
                const minColInBottomRow = rowMinCols[bottomRowLabel];
                const bottomSeatCode = bottomRowLabel + (col + 1);

                if (
                    col === maxColInBottomRow - 1 &&
                    seatMap[bottomSeatCode] &&
                    !selectedSet.has(bottomSeatCode) &&
                    !seatMap[bottomSeatCode].isBooked
                ) {
                    const bottomRightSeatCode = bottomRowLabel + (col + 2);
                    if (
                        seatMap[bottomRightSeatCode] &&
                        !selectedSet.has(bottomRightSeatCode) &&
                        !seatMap[bottomRightSeatCode].isBooked
                    ) {
                        Swal.fire({
                            icon: 'info',
                            text: `Việc đặt ghế để lại ghế trống ở hàng dưới (${bottomRightSeatCode}).`,
                        });
                        return false;
                    }
                }

                if (
                    col === minColInBottomRow + 1 &&
                    seatMap[bottomSeatCode] &&
                    !selectedSet.has(bottomSeatCode) &&
                    !seatMap[bottomSeatCode].isBooked
                ) {
                    const bottomLeftSeatCode = bottomRowLabel + col;
                    if (
                        seatMap[bottomLeftSeatCode] &&
                        !selectedSet.has(bottomLeftSeatCode) &&
                        !seatMap[bottomLeftSeatCode].isBooked
                    ) {
                        Swal.fire({
                            icon: 'info',
                            text: `Việc đặt ghế để lại ghế trống ở hàng dưới (${bottomLeftSeatCode}).`,
                        });
                        return false;
                    }
                }
            }
        }

        const isIsolatedEmptySeat = (row, col) => {
            const seatCode = String.fromCharCode('A'.charCodeAt(0) + row) + (col + 1);
            if (!seatMap[seatCode] || selectedSet.has(seatCode) || seatMap[seatCode].isBooked) {
                return false;
            }

            const neighbors = [
                { r: row - 1, c: col },
                { r: row, c: col - 1 },
                { r: row, c: col + 1 },
                { r: row + 1, c: col },
            ];

            let emptyNeighbors = 0;
            for (const { r, c } of neighbors) {
                const neighborCode = String.fromCharCode('A'.charCodeAt(0) + r) + (c + 1);
                if (seatMap[neighborCode] && !selectedSet.has(neighborCode) && !seatMap[neighborCode].isBooked) {
                    emptyNeighbors++;
                }
            }

            return emptyNeighbors === 0;
        };

        for (const { row, col } of selectedCoords) {
            const neighbors = [
                { r: row - 1, c: col },
                { r: row, c: col - 1 },
                { r: row, c: col + 1 },
                { r: row + 1, c: col },
            ];

            for (const { r, c } of neighbors) {
                if (isIsolatedEmptySeat(r, c)) {
                    Swal.fire({
                        icon: 'info',
                        text: `Việc đặt ghế để lại ghế trống đơn lẻ tại hàng ${String.fromCharCode(
                            'A'.charCodeAt(0) + r,
                        )}, cột ${c + 1}.`,
                    });
                    return false;
                }
            }
        }

        return true;
    }

    return (
        <div className="w-[100%] text-[#ffffff61] pb-10">
            <div className="bg-[#2B2D3D] w-[100%] sm:h-[120px] h-[300px] ">
                <ContainerWapper>
                    <div className="flex sm:flex-row gap-[20px] flex-col items-center justify-between">
                        <div className="">
                            <button
                                className="bg-[#747894] hover:bg-[#ff4444] hover:text-[#fff] px-[28px] py-[4px] rounded-[8px]"
                                onClick={() => navigate(routes.movie_booking.replace(':id', queryParams?.filmId))}
                            >
                                Quay lại
                            </button>
                        </div>

                        <div className="">
                            <div className="flex justify-center items-end gap-[10px]">
                                <p className="uppercase text-[20px] font-[400]">{movie?.name}</p>
                                <p className="uppercase text-[20px] font-[400]">-</p>
                                <p className="uppercase text-[20px] font-[400]">{`(${movie?.duration})`}</p>
                            </div>
                            <p className="text-center uppercase text-[#ffffff61] text-[16px]">
                                {formatDate}, {formatTime(showTimeData?.data?.start_time)}
                            </p>
                        </div>

                        <div className="">
                            <button
                                className="hidden uppercase w-[150px] h-[35px] bg-[#ff4444] border-[1px] border-solid border-[#ff4444] text-[#fff] rounded-[8px] hover:bg-[#3f414f] hover:text-[#ff4444]"
                                onClick={() => navigate(routes.bookingType)}
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </ContainerWapper>
            </div>

            <div className="pt-[40px] overflow-auto">
                <ContainerWapper>
                    <div className="lg:w-[100%] w-[1300px] flex justify-between items-start">
                        <div className="w-[45%]">
                            <p className="text-center text-[16px] uppercase mb-[40px]">Ariesplex SL Cinemas</p>
                            <div className="relative flex justify-center items-center">
                                <img src={screen} alt="screen" className="mb-[40px]" />
                                <p className="absolute uppercase text-[#000] text-[20px] font-[600]">màn hình chiếu</p>
                            </div>
                            {isLoading || isLoadingSeatBooked ? (
                                <div className="min-h-[200px] flex justify-center items-center flex-col gap-3">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                                    <p className="text-[#333]">
                                        <strong>Đang tải danh sách ghế</strong>
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-[40px] mb-[60px] sm:px-[0px] px-[10px]">
                                    {dataRenderSeat.map((item, index) => {
                                        return (
                                            <div className="w-[100%]" key={index}>
                                                <ListChair
                                                    toggleHold={toggleHold}
                                                    dataHold={dataHold}
                                                    target={item}
                                                    booked={data?.booked}
                                                    booking={booking}
                                                    setBooking={setBooking}
                                                    price={data?.price}
                                                    type={[0, 1, 2].includes(index) ? 'nomal' : 'vip'}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex justify-center items-center mb-[40px]">
                                <div className="grid grid-cols-5 gap-[24px]">
                                    {[
                                        { bg: '#babac1', label: 'Ghế đã đặt' },
                                        { bg: '#7331d6', label: 'Ghế thường' },
                                        { bg: '#f14052', label: 'Ghế VIP' },
                                        { bg: '#ffc107', label: 'Ghế Đôi' },
                                        { bg: '#1d59a2', label: 'Ghế Đang Chọn' },
                                        { bg: '#0dcaf0', label: 'Ghế Đang Giữ' },
                                    ].map((item, index) => {
                                        return (
                                            <div className="flex justify-start items-center gap-[10px]" key={index}>
                                                <div
                                                    className="w-[20px] h-[20px] flex-shrink-0 rounded-md"
                                                    style={{ background: item.bg }}
                                                ></div>
                                                <p className="text-[#000] text-[12px] font-semibold whitespace-nowrap">
                                                    {item.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-[100%] h-[6px] flex justify-center items-center mb-[60px]">
                                <div className="w-[100%] h-[100%] bg-[#ff4444]"></div>
                            </div>
                        </div>

                        {/* detail movie */}
                        <div className="w-[25%] text-[#000]">
                            <div className="flex justify-start gap-[20px] mb-[40px]">
                                <img src={movie?.thumbnail} alt="" className="w-[150px] object-cover rounded-md" />
                                <div className="">
                                    <p className="text-[#ff4444] text-[24px] font-[600]">{movie?.name}</p>
                                    <p></p>
                                </div>
                            </div>

                            <div className="">
                                {[
                                    {
                                        icon: 'bi bi-film',
                                        label: 'Thể loại',
                                        value: movie?.categories.map((item) => item.name).join(', '),
                                    },
                                    { icon: 'bi bi-stopwatch', label: 'Thời lượng', value: movie?.duration },
                                    { icon: 'bi bi-film', label: 'Rạp chiếu', value: screenData?.data?.cinema?.name },
                                    { icon: 'bi bi-film', label: 'Ngày chiếu', value: showTimeData?.data?.date },
                                    {
                                        icon: 'bi bi-clock',
                                        label: 'Giờ chiếu',
                                        value: formatTime(showTimeData?.data?.start_time),
                                    },
                                    { icon: 'bi bi-tv', label: 'Phòng chiếu', value: showTimeData?.data?.screen.name },
                                    {
                                        icon: 'bi bi-film',
                                        label: 'Ghế',
                                        value: booking.length
                                            ? booking.map((item, index) => (
                                                  <span className="mx-1" key={index}>
                                                      {item?.seat_code}
                                                  </span>
                                              ))
                                            : 'Chưa chọn',
                                    },
                                ].map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <div className="flex justify-between mb-[16px]">
                                                <div className="flex justify-start gap-[10px]">
                                                    <i className={item.icon}></i>
                                                    <p className="w-[100px]">{item.label}</p>
                                                </div>
                                                <p>{item.value}</p>
                                            </div>
                                            {index === 1 ? (
                                                <div className="w-[100%] border-t-[1px] border-dashed border-[#000] mb-[20px]"></div>
                                            ) : null}
                                        </Fragment>
                                    );
                                })}
                            </div>
                            {/* <DiscountSelector discounts={promoCode} /> */}
                            <button
                                className="rounded-[10px] mt-4 bg-[#ff4444] text-[#fff] px-[32px] py-[8px] font-[500]"
                                onClick={handleNextStep}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </ContainerWapper>
            </div>
            <ModalCheckOut
                promoCode={promoCode}
                movie={{
                    ...movie,
                    screen: screenData?.data,
                    showTime: showTimeData?.data,
                    price: booking.reduce((acc, curr) => acc + curr.price, 0),
                }}
                isModalOpen={isModalCheckOut}
                handleCancel={() => {
                    setIsModalCheckOut(false);
                }}
                handleCreateOrder={handleCreateOrder}
                bookings={booking}
            />
        </div>
    );
};

export default SeatBooking;

const ListChair = ({ target, booked, booking, setBooking, isDoubleChair, type, dataHold = [], toggleHold }) => {
    return (
        <div className="flex justify-center items-center gap-[50px]">
            <p className="uppercase font-[500] text-[20px] text-[#333]">{target.row}</p>
            <div className="flex justify-start items-center gap-[10px]">
                {target.seats.map((item) => {
                    const isHoldSeat = dataHold.find((itemChild) => itemChild.seat_id === item.id);
                    return (
                        <Chair
                            seat_code={item.seat_code}
                            toggleHold={toggleHold}
                            isHoldSeat={isHoldSeat}
                            name={`${target.row}${item.number}`}
                            key={item.id}
                            booked={booked}
                            booking={booking}
                            setBooking={setBooking}
                            price={formatVND(item.price)}
                            isDoubleChair={isDoubleChair}
                            type={item.type}
                            priceNotFormat={item.price}
                            id={item.id}
                            isBuy={item.isBooked}
                        />
                    );
                })}
            </div>
        </div>
    );
};

function ModalCheckOut({ isModalOpen, handleCancel, handleCreateOrder, bookings, movie, promoCode }) {
    const { data } = useGetAllProduct({});
    const products = useMemo(() => (data?.data ? data?.data : []), [data]);
    const [productCheckOut, setProductCheckOut] = useState([]);
    const [step, setStep] = useState(1);

    function getPriceSeatTotal() {
        let total = 0;
        bookings.forEach((item) => {
            total += parseFloat(item.price);
        });

        return total;
    }

    const handleCheckOutStep = () => {
        switch (step) {
            case 1:
                setStep(2);
                break;
            // case 2:
            //     setStep(3);
            //     break;
        }
    };

    const handleCreateOrderModal = (type) => {
        handleCreateOrder(productCheckOut);
        // if (type === 'banking') {
        //     setStep(3);
        // }
    };

    return (
        <Modal
            width={step === 1 ? '60vw' : '50vw'}
            title={
                step === 1 ? 'Chọn sản phẩm combo mua kèm' : step === 2 ? 'Hình thức thanh toán' : 'Thanh toán SEPAY'
            }
            open={isModalOpen}
            footer={
                <div className="flex items-center gap-2 justify-end">
                    {step > 1 && <Button onClick={() => setStep((prev) => prev - 1)}>Quay lại</Button>}
                    {step === 1 && (
                        <Button type="primary" onClick={handleCheckOutStep}>
                            Tiếp tục
                        </Button>
                    )}
                </div>
            }
            onCancel={handleCancel}
        >
            {step === 1 && (
                <div>
                    <Row gutter={[16, 16]}>
                        {products.map((product) => (
                            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    cover={<img alt={product.name} className="h-[200px]" src={product.image} />}
                                    actions={[
                                        <ProductItem
                                            key={product.id}
                                            product={product}
                                            productCheckOut={productCheckOut}
                                            setProductCheckOut={setProductCheckOut}
                                        />,
                                    ]}
                                >
                                    <Card.Meta
                                        title={product.name}
                                        description={
                                            <>
                                                <p>Mã sản phẩm: {product.code}</p>
                                                <p>Giá: {formatVND(product.price)}</p>
                                            </>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
            {step === 2 && (
                <MovieTicketBooking
                    promoCode={promoCode}
                    dataOrder={productCheckOut}
                    firm={movie}
                    setStep={setStep}
                    handleCreateOrder={handleCreateOrder}
                    bookings={bookings}
                    className={'fixed w-full h-full top-0 left-0 right-0 bottom-0 z-[9999]'}
                />
            )}
            {step === 3 && (
                <div className="flex gap-2">
                    <div
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: 10,
                        }}
                        className="shadow-md"
                    >
                        <img
                            className=" w-[300px] h-[300px]"
                            src={`https://qr.sepay.vn/img?acc=15999428888&bank=TPBank&amount=${Math.floor(
                                calculateTotal(productCheckOut) + parseFloat(getPriceSeatTotal()),
                            )}&des=jwjst6&template=compact`}
                            alt=""
                        />
                        <div className="flex justify-center items-center flex-col gap-1 pt-1">
                            <Spin indicator={<LoadingOutlined spin />} size="small"></Spin>
                            <p className="text-[10px] pb-1">
                                <strong>Sepay checking</strong>
                            </p>
                        </div>
                    </div>
                    <div className="shadow-md p-4 rounded flex-1">
                        <Descriptions
                            bordered
                            column={1}
                            size="middle"
                            title={
                                <div className="flex justify-center mb-4">
                                    <img
                                        src="https://my.sepay.vn/assets/images/banklogo/tpbank-icon.png"
                                        alt="logo"
                                        className="h-8"
                                    />
                                </div>
                            }
                        >
                            <Descriptions.Item label="Ngân hàng">TPBank</Descriptions.Item>
                            <Descriptions.Item label="Thụ hưởng">NGUYEN TRUONG SON</Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản">
                                <div className="flex items-center">
                                    15999428888
                                    <DownOutlined className="ml-2" />
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số tiền">
                                {formatVND(
                                    Math.floor(calculateTotal(productCheckOut) + parseFloat(getPriceSeatTotal())),
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nội dung CK">jwjst6</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            )}
        </Modal>
    );
}

const ProductItem = ({ product, productCheckOut, setProductCheckOut }) => {
    const foundItem = productCheckOut.find((item) => item.id === product.id);
    const quantity = foundItem ? foundItem.quantity : 0;

    const handleDecrease = () => {
        if (quantity > 0) {
            if (quantity === 1) {
                setProductCheckOut(productCheckOut.filter((item) => item.id !== product.id));
            } else {
                setProductCheckOut(
                    productCheckOut.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item,
                    ),
                );
            }
        }
    };

    const handleIncrease = () => {
        if (quantity === 0) {
            setProductCheckOut([...productCheckOut, { ...product, quantity: 1 }]);
        } else {
            setProductCheckOut(
                productCheckOut.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
                ),
            );
        }
    };

    return (
        <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button onClick={handleDecrease} disabled={quantity === 0}>
                -
            </Button>
            <span style={{ margin: '0 10px' }}>{quantity}</span>
            <Button onClick={handleIncrease}>+</Button>
        </div>
    );
};

function calculateTotal(products) {
    return products.reduce((total, product) => {
        const price = parseFloat(product.price);
        return total + price * product.quantity;
    }, 0);
}

const Chair = ({
    name,
    booked,
    booking,
    setBooking,
    price,
    isDoubleChair,
    type,
    priceNotFormat,
    id,
    isBuy,
    isHoldSeat,
    toggleHold,
    seat_code,
}) => {
    const isBooked = useMemo(() => booked?.find((item) => item.name === name), [name, booked]);
    const isBooking = useMemo(() => booking?.find((item) => item.name === name), [name, booking]);

    const color = useMemo(() => {
        if (isBuy) {
            return 'rgb(186, 186, 193)';
        }

        if (isHoldSeat) {
            if (booking.find((itemChild) => itemChild?.id === isHoldSeat?.seat_id)) {
                if (booked?.some((item) => item.name === name)) {
                    return '#babac1';
                }
                if (booking?.some((item) => item.name === name)) {
                    return '#1d59a2';
                }

                if (type === 'Ghế thường') {
                    return '#7331d6';
                }
                if (type === 'Ghế VIP' || type === 'Ghế V.I.P' || type === 'Ghế vip') {
                    return '#f14052';
                }

                if (type === 'Ghế đôi') {
                    return '#ffc107';
                }
            }
            return '#0dcaf0';
        }

        if (booked?.some((item) => item.name === name)) {
            return '#babac1';
        }
        if (booking?.some((item) => item.name === name)) {
            return '#1d59a2';
        }

        if (type === 'Ghế thường') {
            return '#7331d6';
        }
        if (type === 'Ghế VIP' || type === 'Ghế V.I.P' || type === 'Ghế vip') {
            return '#f14052';
        }

        if (type === 'Ghế đôi') {
            return '#ffc107';
        }

        if (isDoubleChair) {
            return '#ffc107';
        }
        return '';
    }, [isBuy, booked, booking, type, isHoldSeat, isDoubleChair, name]);

    const handleChoose = () => {
        if (isBooking) {
            setBooking([...booking].filter((item) => item.name !== name));
            toggleHold(id, 'remove');
        } else {
            setBooking((prev) => [
                ...prev,
                {
                    name: name,
                    seat_code: seat_code,
                    price: priceNotFormat,
                    id,
                },
            ]);
            toggleHold(id, 'add');
        }
    };

    return (
        <Popover content={`Giá ${price}`}>
            <div
                className="flex flex-col items-center gap-[2px]"
                style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
            >
                <div
                    className="w-[40px] h-[40px] rounded-[5px] border-[1px] border-solid border-[#4d4f5c] flex justify-center items-center uppercase text-[#fff]"
                    style={{
                        background: color,
                        borderColor: color,
                        width: type === 'Ghế đôi' ? '80px' : '40px',
                    }}
                    onClick={
                        isBuy
                            ? () => {
                                  Swal.fire({
                                      icon: 'info',
                                      text: 'Ghế đã được đặt',
                                  });
                              }
                            : isHoldSeat
                            ? () => {
                                  console.log(
                                      booking.find((itemChild) => {
                                          console.log(itemChild, isHoldSeat, itemChild?.id, isHoldSeat?.seat_id);
                                          return itemChild?.id === isHoldSeat?.seat_id;
                                      }),
                                      booking,
                                      isHoldSeat,
                                  );
                                  if (!booking.find((itemChild) => itemChild?.id === isHoldSeat?.seat_id)) {
                                      Swal.fire({
                                          icon: 'info',
                                          text: 'Ghế đang được người khác giữ',
                                      });
                                  } else {
                                      isBooked ? null : handleChoose();
                                  }
                              }
                            : isBooked
                            ? null
                            : handleChoose
                    }
                >
                    {seat_code}
                </div>
            </div>
        </Popover>
    );
};

const DiscountSelector = ({ discounts }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const [selectedCode, setSelectedCode] = useState(null);

    const handleCopy = (e, code) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        message.success('Đã copy mã giảm giá!');
    };

    const handleSelect = (item) => {
        const disabled = item.status !== 'active' || item.end_date < currentDate;
        if (!disabled) {
            setSelectedCode(item.code);
        }
    };

    return (
        <List
            itemLayout="horizontal"
            dataSource={discounts}
            renderItem={(item) => {
                const disabled = item.status !== 'active' || item.end_date < currentDate;
                const isSelected = selectedCode === item.code;
                return (
                    <List.Item
                        onClick={() => handleSelect(item)}
                        className={`cursor-pointer p-4 border rounded mb-2  ${
                            disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : isSelected
                                ? 'border-blue-500'
                                : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-center w-full px-2 py-1">
                            <div className="flex flex-col">
                                <span className="font-semibold">{item.code}</span>
                                <span className="text-sm text-gray-500">{item.description}</span>
                            </div>
                            <div className="flex items-center">
                                {disabled && (
                                    <Badge count="Hết hạn" style={{ backgroundColor: '#f5222d' }} className="mr-2" />
                                )}
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={(e) => handleCopy(e, item.code)}
                                />
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
};
