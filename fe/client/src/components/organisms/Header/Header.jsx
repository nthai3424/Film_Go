import { Menu, Popover } from 'antd';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleLogoutUser, handleToggleModalAuth } from '../../../app/slices/appSlice';
import { handleBuilderMovies } from '../../../helpers/handleReBuildMovies';
import { useGetAllGenres } from '../../../services/genres/getAllGenres';
import { useGetAllMovies } from '../../../services/movie/useGetOneMovie';
import ProductSearchPopover from '../ProductSearchPopover/index';

export default function Header() {
    const [current, setCurrent] = useState('home-menu');

    const handleClickMenuHeader = (value) => {
        setCurrent(value.key);
    };

    const { data } = useGetAllGenres({});
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

    const [headerNavidata, setHeaderNavidata] = useState([]);

    useEffect(() => {
        setHeaderNavidata(() => {
            return [
                {
                    label: (
                        <span className="text-[#fff]" onClick={() => (window.location.href = '/')}>
                            Trang chủ
                        </span>
                    ),
                    key: 'home',
                },
                {
                    label: (
                        <span className="text-[#fff]">
                            <Link to="/contact?label=Contact">Liên hệ</Link>
                        </span>
                    ),
                    key: 'CONTACT',
                },
                {
                    label: (
                        <span className="text-[#fff]">
                            <Link to="/gia-ghe ">Giá vé</Link>
                        </span>
                    ),
                    key: 'SEAT',
                },
                {
                    label: (
                        <span className="text-[#fff]">
                            <Link to="/chinh-sach">Chính sách</Link>
                        </span>
                    ),
                    key: 'CHINHSACH',
                },
            ];
        });
    }, [targetGenres]);

    const dispatch = useDispatch();

    const { isLoginIn, user } = useSelector((state) => state.app.auth);
    const contentUserLogin = (
        <div>
            <ul>
                <li
                    style={{
                        listStyleType: 'none',
                        paddingInlineStart: 0,
                        fontSize: '16px',
                        padding: '6px 0',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        window.location.href = '/me';
                    }}
                >
                    Xem tài khoản
                </li>
                <li
                    style={{
                        listStyleType: 'none',
                        paddingInlineStart: 0,
                        fontSize: '16px',
                        padding: '6px 0',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        Swal.fire({
                            icon: 'info',
                            text: 'Bạn chắc chắn muốn đăng xuất?',
                            showConfirmButton: true,
                            showCancelButton: true,
                        }).then((res) => {
                            if (res.isConfirmed) {
                                dispatch(handleLogoutUser());
                            }
                        });
                    }}
                >
                    Đăng xuất
                </li>
            </ul>
        </div>
    );

    const listMoviesArr = useMemo(() => (dataMovies?.data ? dataMovies.data : []), [dataMovies]);

    return (
        <header className="bg-[#ff4444] h-[100px] flex items-center">
            <div className="px-[15px] flex justify-between items-center w-full">
                <div className="flex items-center gap-[20px] flex-1">
                    <a href="/">
                        <img className="h-[100%] max-h-[60px]" src="/images/logo-removebg.png" alt="" />
                    </a>
                    <div className="lg:block hidden flex-1">
                        <Menu
                            className="bg-transparent text-[#fff]"
                            onClick={handleClickMenuHeader}
                            selectedKeys={[current]}
                            mode="horizontal"
                            items={headerNavidata}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className=""></div>
                    <Fragment>
                        <div style={{}} className="h-[50px] rounded-[10px] overflow-hidden lg:flex hidden items-center">
                            <ProductSearchPopover products={listMoviesArr} />
                        </div>
                        {!isLoginIn && !user ? (
                            <button
                                onClick={() => dispatch(handleToggleModalAuth())}
                                className="bg-[#000] text-[#fff] h-[50px] w-[180px] rounded-[10px] lg:block hidden"
                            >
                                Đăng nhập
                            </button>
                        ) : (
                            <Popover content={contentUserLogin} title="Thông tin tài khoản">
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 10,
                                            fontWeight: 600,
                                            color: '#fff',
                                            background: 'rgba(0,0,0,0.2)',
                                            padding: '6px 20px',
                                            borderRadius: 10,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <img
                                            style={{
                                                borderRadius: '50%',
                                                width: 40,
                                                height: 40,
                                            }}
                                            src={
                                                user[0]?.avatar == 'http://filmgo.io.vn/images/avatars/default.jpg'
                                                    ? 'https://static.thenounproject.com/png/4154905-200.png'
                                                    : user[0]?.avatar
                                            }
                                            alt="hình ảnh người dùng"
                                        />
                                        <p>Welcome {user[0]?.name}</p>
                                    </div>
                                </div>
                            </Popover>
                        )}
                    </Fragment>
                </div>
            </div>
        </header>
    );
}
