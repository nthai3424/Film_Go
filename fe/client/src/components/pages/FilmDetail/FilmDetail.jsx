import { Breadcrumb, Spin } from 'antd';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { hanldeGetIdViewYoutobe } from '../../../helpers/handleGetIdVideoProview';
import { useGetDetailMovie } from '../../../services/movie/getMovieDetail';
import BasicTemplate from '../../templates/BasicTemplate';
import ContainerWapper from '../../templates/ContainerWapper';

const Home = () => {
    const { id } = useParams();
    const { data: dataCall, isLoading } = useGetDetailMovie({
        payload: { id: id },
        enabled: true,
    });

    const dataDetail = useMemo(() => dataCall?.data || null, [dataCall]);

    return (
        <BasicTemplate>
            {isLoading ? (
                <div className="h-[70vh] w-full flex justify-center items-center">
                    <div className="flex justify-center flex-col gap-4 items-center">
                        <Spin size="large" />
                        <p>Đang tải phim</p>
                    </div>
                </div>
            ) : (
                dataDetail && (
                    <ContainerWapper>
                        <div className="pt-10">
                            <Breadcrumb className="font-semibold text-[18px]">
                                <Breadcrumb.Item>
                                    <a href="/">Trang chủ</a>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{dataDetail?.title}</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="flex gap-6 mt-6">
                                <div>
                                    <img
                                        src={dataDetail?.poster}
                                        alt={dataDetail?.title}
                                        className="rounded-md aspect-[9/16] max-h-[400px] object-cover border-gray-400 border"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="font-bold text-[#333333] text-[32px]">{dataDetail?.title}</h1>
                                    <p className="font-semibold text-[#333333] text-[14px] mt-4 whitespace-pre-wrap">
                                        {dataDetail?.description}
                                    </p>

                                    <div className="relative overflow-x-auto mt-4">
                                        <table className="rounded-md overflow-hidden w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Thể loại
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Diễn viên
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Thời lượng
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Đánh giá
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Ngày chiếu
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                    <td className="px-6 py-4">
                                                        <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                                            {dataDetail?.genres?.map((item, index) => (
                                                                <li key={index}>{item.name}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                                            {dataDetail?.actors?.map((item, index) => (
                                                                <li key={index}>{item.name}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td className="px-6 py-4">{dataDetail?.duration} Phút</td>
                                                    <td className="px-6 py-4">{dataDetail?.rating}</td>
                                                    <td className="px-6 py-4">{dataDetail?.release_date}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button
                                            onClick={() => (window.location.href = `/movie_booking/${dataDetail.id}`)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                        >
                                            Đặt vé ngay
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[400px] mt-10">
                                <h2 className="pb-2 font-semibold text-[#333]">Trailler phim {dataDetail.title}</h2>
                                <iframe
                                    className="rounded-md"
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${hanldeGetIdViewYoutobe(dataDetail?.trailer)}`}
                                    title="Quỷ Nhập Tràng Official Trailer | Beta Cinemas | Khởi chiếu /07/032025"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                    </ContainerWapper>
                )
            )}
        </BasicTemplate>
    );
};

export default Home;
