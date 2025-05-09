/* eslint-disable react/prop-types */
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Tabs, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { handleDataVideoPreview } from '../../../app/slices/appSlice';
import { handleBuilderMovies } from '../../../helpers/handleReBuildMovies';
import { useGetListMovieShowing } from '../../../services/movie/getListMovieShowing';
import { useGetListMovieUpShowing } from '../../../services/movie/getListMovieUpShowing';
import { useGetAllMovies } from '../../../services/movie/useGetOneMovie';
import ContainerWapper from '../../templates/ContainerWapper';
import MainTemplate from '../../templates/MainTemplate';
import './styles.css';

const { Title } = Typography;
const MovieCate = () => {
    const { data: dataMovies } = useGetAllMovies({});

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
                            <img src="/images/thamtukien.jpg" alt="On set filming" className="w-full h-[400px]" />
                        </div>
                        <div className="h-full">
                            <img src="/images/latmat.jpg" alt="On set filming" className="w-full h-[400px]" />
                        </div>
                        <div className="h-full">
                            <img src="/images/banner.jpg" alt="On set filming" className="w-full h-[400px]" />
                        </div>
                        <div className="h-full">
                            <img src="/images/banner2.jpg" alt="On set filming" className="w-full h-[400px]" />
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
