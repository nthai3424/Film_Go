import { Empty, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { handleBuildShowTimes } from '../../../helpers/handleFilterShowtimes';
import { useGetDetailMovie } from '../../../services/movie/getMovieDetail';
import { useGetShowtimes } from '../../../services/showtime/getShowTimes';
import Cinemas from '../../organisms/Cinemas';
import ListCalendar from '../../organisms/ListCalendar/ListCalendar';
import Preview from '../../organisms/Preview';
import ContainerWapper from '../../templates/ContainerWapper';
import MainTemplate from '../../templates/MainTemplate';

const MovieBooking = () => {
    const [currentDate, setCurrentDate] = useState('');

    const { id } = useParams();
    const { data: dataCall, isLoading } = useGetDetailMovie({
        payload: { id: id },
        enabled: true,
    });
    const { data: dataShowTimesQuery, isLoading: isLoadingShowTimes } = useGetShowtimes({
        queryConfig: { enabled: true },
    });

    const dataDetail = useMemo(() => dataCall?.data || null, [dataCall]);
    const dataShowTime = useMemo(
        () => (dataShowTimesQuery?.data && handleBuildShowTimes(dataShowTimesQuery?.data, id)) || null,
        [dataShowTimesQuery, id],
    );

    const handleBuilderShowtimesForDate = (dataBuider) => {
        let dataBuild = [];
        dataBuider.forEach((item) => {
            const date = item.date;
            const inputDateTime = new Date(`${date}T${item.start_time}:00`).getTime();
            const dt = new Date();
            const isExp = inputDateTime + 30 * 60 * 1000 < Date.now();
            const isExpDate =
                new Date(date).getTime() <=
                new Date(dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()).getTime();
            if (!isExpDate) {
                item.isExp = isExp;
                const dataItem = {
                    id: item.id,
                    date: item.date,
                    data: [
                        {
                            ...item,
                        },
                    ],
                };
                const index = dataBuild.findIndex((dataBuildItem) => dataBuildItem.date === date);
                if (index === -1) {
                    dataBuild.push(dataItem);
                } else {
                    dataBuild[index].data.push(item);
                }
            }
        });

        dataBuild = dataBuild.map((dataBuildItem) => {
            const dataNews = [];
            dataBuildItem.data.forEach((dataNewsItem) => {
                const value = dataNewsItem.screen.cinema.id;
                const index = dataNews.findIndex((dataNewsItem) => dataNewsItem?.cinema_id === value);
                if (index === -1) {
                    dataNews.push({
                        cinema_id: value,
                        label: dataNewsItem.screen.cinema.name,
                        province_id: dataNewsItem.screen.cinema.province_id,
                        screen_id: dataNewsItem.screen.id,
                        item: [dataNewsItem],
                    });
                } else {
                    dataNews[index].item.push(dataNewsItem);
                }
            });
            dataBuildItem.data = dataNews;
            return dataBuildItem;
        });
        dataBuild.sort((a, b) => new Date(a.date) - new Date(b.date));
        return dataBuild;
    };

    const [dataShowTimeRender, setDataShowTimeRender] = useState([]);

    useEffect(() => {
        if (dataShowTime && dataShowTime.length > 0) {
            const data = handleBuilderShowtimesForDate(dataShowTime);
            if (data.length > 0) {
                setCurrentDate(data[0].date);
                setDataShowTimeRender(data);
            }
        }
    }, [dataShowTime]);

    return (
        <MainTemplate>
            <ContainerWapper>
                <div className="pt-[20px]">
                    {isLoading ? (
                        <>
                            <div className="flex justify-center flex-col gap-4 items-center">
                                <Spin size="large" />
                                <p>Đang tải danh sách phòng vé</p>
                            </div>
                        </>
                    ) : (
                        dataDetail && <Preview data={dataDetail} />
                    )}
                </div>
            </ContainerWapper>

            <div className="mt-[40px]">
                {isLoadingShowTimes ? (
                    <>
                        <div className="flex justify-center flex-col gap-4 items-center">
                            <Spin size="large" />
                            <p>Đang tải danh sách phòng vé</p>
                        </div>
                    </>
                ) : dataShowTime?.length > 0 ? (
                    <>
                        <ListCalendar
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            list={dataShowTimeRender}
                        />
                    </>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>

            <ContainerWapper>
                <div className="flex lg:flex-row flex-col justify-between lg:items-start items-center mt-[40px] lg:gap-0 gap-[20px]">
                    <div
                        className="lg:w-[100%] w-[95%] rounded-[10px] overflow-hidden bg-white"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
                    >
                        {isLoadingShowTimes ? (
                            <>
                                <div className="flex justify-center flex-col gap-4 items-center">
                                    <Spin size="large" />
                                    <p>Đang tải danh sách phòng vé</p>
                                </div>
                            </>
                        ) : dataShowTimeRender.length > 0 ? (
                            currentDate &&
                            dataShowTimeRender
                                .find((itemFind) => itemFind.date === currentDate)
                                .data.map((item, index) => (
                                    <Cinemas key={index} data={item} filmId={id} currentDate={currentDate} />
                                ))
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                </div>
            </ContainerWapper>
        </MainTemplate>
    );
};

export default MovieBooking;
