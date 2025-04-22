/* eslint-disable react/prop-types */
import { InfoCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Tabs, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { handleDataVideoPreview } from '../../../app/slices/appSlice';
import { handleReBuildGenres } from '../../../helpers/handleReBuildGenres';
import { handleBuilderMovies } from '../../../helpers/handleReBuildMovies';
import { useGetAllGenres } from '../../../services/genres/getAllGenres';
import { useGetListMovieShowing } from '../../../services/movie/getListMovieShowing';
import { useGetListMovieUpShowing } from '../../../services/movie/getListMovieUpShowing';
import { useGetAllMovies } from '../../../services/movie/useGetOneMovie';
import ContainerWapper from '../../templates/ContainerWapper';
import MainTemplate from '../../templates/MainTemplate';
import './styles.css';

const movies = [
    {
        id: 1,
        genres: [
            { genre_id: 1, name: 'Hành động' },
            { genre_id: 8, name: 'Lịch sử' },
        ],
        title: 'Địa đạo: Mặt trời trong bóng tối',
        description:
            'Phim điện ảnh đề tài kháng chiến “Địa Đạo: Mặt Trời Trong Bóng Tối” của đạo diễn Bùi Thạc Chuyên dự kiến ra rạp sớm từ 04/04/2025...',
        poster: 'http://filmgo.io.vn/images/movies/8pRYh8fEz3G0.jpg',
        duration: 128,
        release_date: '2025-04-12',
    },
    {
        id: 2,
        genres: [{ genre_id: 7, name: 'Hài hước' }],
        title: 'Cưới Ma Giải Hạn',
        description: 'Menn, một tên trộm cắp đang làm tay trong cho cảnh sát... bắt anh phải kết hôn với một hồn ma.',
        poster: 'http://filmgo.io.vn/images/movies/jT2Nwr7NYbzq.jpg',
        duration: 128,
        release_date: '2025-04-12',
    },
];

const { Title } = Typography;
const MovieCate = () => {
    const { data } = useGetAllGenres({});
    const genres = useMemo(
        () =>
            data?.data?.map((item) => {
                return handleReBuildGenres(item);
            }) || [],
        [data],
    );

    const { data: dataMovies } = useGetAllMovies({});

    const targetGenres = useMemo(() => {
        if (!data?.data || !dataMovies?.data) return [];
        return data.data.slice(0, 3).map((item) => ({
            cate: item.name,
            data: dataMovies.data
                .filter((movie) => movie.genres?.some((genre) => genre.genre_id === item.id))
                .map(handleBuilderMovies),
        }));
    }, [data?.data, dataMovies?.data]);

    const listMovies = useMemo(
        () =>
            dataMovies?.data
                ?.map((item) => {
                    return handleBuilderMovies(item);
                })
                .slice(0, 10) || [],
        [dataMovies],
    );

    const listMoviesArr = useMemo(() => (dataMovies?.data ? dataMovies.data : []), [dataMovies]);
    const { data: firmShowing } = useGetListMovieShowing({
        enabled: true,
    });

    const firmShowingRender = useMemo(() => (firmShowing?.data ? firmShowing.data : []), [firmShowing]);

    const { data: firmUpShowing } = useGetListMovieUpShowing({
        enabled: true,
    });

    const firmUpShowingRender = useMemo(() => (firmUpShowing?.data ? firmUpShowing.data : []), [firmUpShowing]);

    const items = [
        {
            key: '1',
            label: (
                <Title level={4} className="uppercase font-bold">
                    Phim Sắp Chiếu
                </Title>
            ),
            children: <MovieList movies={firmUpShowingRender} />,
        },
        // {
        //     key: '2',
        //     label: (
        //         <Title level={4} className="uppercase font-bold">
        //             Tất Cả Phim
        //         </Title>
        //     ),
        //     children: (
        //         <div>
        //             {' '}
        //             <div className="lg:w-[100%] w-[1--%] rounded-[10px] overflow-hidden flex-1">
        //                 <div className="w-[40%] py-4"></div>
        //                 <div className="flex lg:flex-row flex-col justify-between lg:items-start items-center">
        //                     <div className="w-full">
        //                         {targetGenres.map((item, index) => {
        //                             return (
        //                                 <div className="mb-[40px]" key={index}>
        //                                     <h2 className="font-bold text-2xl"> {item.cate}</h2>
        //                                     <MovieList className="p-0" movies={item.data} />
        //                                 </div>
        //                             );
        //                         })}
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     ),
        // },
        {
            key: '3',
            label: (
                <Title level={4} className="uppercase font-bold">
                    Phim Đang Chiếu
                </Title>
            ),
            children: <MovieList movies={firmShowingRender} />,
        },
    ];

    return (
        <MainTemplate isShowBanner={false}>
            <ContainerWapper>
                <div className="pt-[20px] h-[400px]">
                    <Carousel autoplay arrows className="arrow_show">
                        <div className="h-full">
                            <img src="/images/banner2.jpg" alt="On set filming" className="w-full h-[400px]" />
                        </div>
                        <div className="h-full">
                            <img src="/images/banner.jpg" alt="On set filming" className="w-full h-[400px]" />
                        </div>
                        <div className="h-full">
                            <img src="/images/banner3.jpg" alt="On set filming" className="w-full h-[400px]" />
                        </div>
                    </Carousel>
                </div>
            </ContainerWapper>
            <ContainerWapper>
                <div className="mt-[40px] gap-[20px] w-[100%]">
                    <Tabs defaultActiveKey="1" centered items={items} onChange={() => {}} />
                </div>
            </ContainerWapper>
        </MainTemplate>
    );
};

export default MovieCate;

const MovieCard = ({ movie }) => {
    const dispatch = useDispatch();

    const handlePreviewTrailler = (url) => {
        dispatch(
            handleDataVideoPreview({
                isOpenModalPriviewVideo: true,
                url,
            }),
        );
    };

    return (
        <Card
            className="rounded-2xl shadow-lg overflow-hidden"
            styles={{ body: { padding: '1rem' } }}
            cover={<img alt={movie.title} src={movie.poster} className="h-[400px] object-cover w-full" />}
        >
            <button>
                <h2
                    className="text-lg font-semibold text-blue-900 mb-1 line-clamp-1"
                    onClick={() => (window.location.href = `/film_detail/${movie.id}`)}
                >
                    {movie.title}
                </h2>
            </button>

            <div className="text-sm mb-2">
                <span className="font-semibold text-gray-700">Thể loại: </span>
                {movie.genres.map((genre, index) => (
                    <Tag color="blue" key={index}>
                        {genre.name}
                    </Tag>
                ))}
            </div>

            <p className="text-sm">
                <span className="font-semibold text-gray-700">Thời lượng:</span> {movie.duration} phút
            </p>

            <p className="text-sm mb-3">
                <span className="font-semibold text-gray-700">Ngày khởi chiếu:</span>{' '}
                {new Date(movie.release_date).toLocaleDateString('vi-VN')}
            </p>

            <div className="flex justify-between gap-2">
                <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    className="w-full flex-1"
                    onClick={() => handlePreviewTrailler(movie?.trailer)}
                >
                    Xem Trailer
                </Button>

                <Button
                    type="default"
                    // icon={<InfoCircleOutlined />}
                    onClick={() => (window.location.href = `/movie_booking/${movie.id}`)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                >
                    Đặt vé ngay
                </Button>
            </div>
        </Card>
    );
};

const MovieList = ({ movies, className }) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className ? className : 'p-6'}`}>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};
