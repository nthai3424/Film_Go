/* eslint-disable react/prop-types */

import { HeartOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bill from '../../../../public/images/content/bill.png';
import fastFood from '../../../../public/images/content/fast-food.png';
import ticket from '../../../../public/images/content/ticket.png';
import { handleToggleModalAuth } from '../../../app/slices/appSlice';
import { routes } from '../../../routes';
const icons = ['fast-food', 'ticket'];

const Cinemas = ({ filmId, currentDate, data }) => {
    return (
        <div className="w-[100%] px-[20px] pt-[20px]">
            <CinemaItem cinema={data} filmId={filmId} currentDate={currentDate} />
        </div>
    );
};

export default Cinemas;

const CinemaItem = ({ cinema, filmId, currentDate }) => {
    const navigate = useNavigate();
    const handleNavigate = useCallback(
        (start_time, end_time, showtime, screen_id) => {
            navigate(
                routes.seat_booking.replace(
                    ':id',
                    `${screen_id}?filmId=${filmId}&date=${currentDate}&start_time=${start_time}&end_time=${end_time}&showtime=${showtime}`,
                ),
            );
        },
        [currentDate, filmId, navigate],
    );

    const handleGetIcon = (type) => {
        if (type === 'bill') bill;
        if (type === 'ticket') return ticket;
        if (type === 'fast-food') return fastFood;
        return '';
    };

    const dispatch = useDispatch();
    const { isLoginIn } = useSelector((state) => state.app.auth);
    const handleToggle = () => {
        dispatch(handleToggleModalAuth());
    };

    return (
        <div className="flex justify-start items-start">
            <HeartOutlined className="mt-[40px] text-[20px] mr-[20px]" />
            <div className="w-[100%] flex sm:flex-row flex-col justify-start items-start sm:gap-0 gap-[10px] mb-[20px] border-b-[0.1px] border-solid border-[#ccc] py-[20px]">
                <div className="mr-[32px]">
                    <p className="text-[16px] font-[600]">{cinema?.label}</p>
                    <div className="flex justify-start items-center gap-[10px]">
                        {icons?.length
                            ? icons?.map((item, index) => {
                                  return (
                                      <img
                                          alt="icons"
                                          src={handleGetIcon(item)}
                                          key={index}
                                          className="w-[32px] h-[32px]"
                                      />
                                  );
                              })
                            : null}
                    </div>
                </div>
                <div className="flex justify-start items-center gap-[8px]">
                    {cinema?.item?.length
                        ? cinema?.item?.map((item, index) => {
                              return (
                                  <Tooltip title={item.isExp ? 'Đã qua giờ chiếu' : ''} key={index}>
                                      <div
                                          className={`${
                                              item.isExp
                                                  ? 'bg-[#ddd] text-white px-4 py-2 rounded cursor-not-allowed'
                                                  : 'px-[8px] py-[4px] text-[14px] border-solid border-[1px] border-[#ccc] rounded-[4px] cursor-pointer hover:bg-[#ff4444] hover:text-white'
                                          }`}
                                          onClick={() => {
                                              if (item.isExp) return;
                                              if (isLoginIn) {
                                                  handleNavigate(
                                                      item?.start_time,
                                                      item?.end_time,
                                                      item.id,
                                                      item.screen_id,
                                                  );
                                              } else {
                                                  handleToggle();
                                              }
                                          }}
                                      >
                                          {item?.start_time} - {item?.end_time}
                                      </div>
                                  </Tooltip>
                              );
                          })
                        : null}
                </div>
            </div>
        </div>
    );
};