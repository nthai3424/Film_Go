/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import ContainerWapper from '../../templates/ContainerWapper';
import p1 from '../../../../public/images/content/p1.jpg';
import p2 from '../../../../public/images/content/p2.jpg';
import p3 from '../../../../public/images/content/p3.jpg';
import p4 from '../../../../public/images/content/p4.jpg';
import p5 from '../../../../public/images/content/p5.jpg';
import p6 from '../../../../public/images/content/p6.jpg';
import { FacebookOutlined, LinkedinOutlined, TwitterSquareFilled, YoutubeOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import Slider from 'react-slick';
import Indicator from '../../atoms/Indicator';
import './styles.css';

const cates = [
    {
        label: '',
        logo: '/images/logo-removebg.png',
        description: 'Website đặt vé xem phim trực tuyến chất lượng cao.',
    },
    {
        label: 'QUY ĐỊNH & ĐIỀU KHOẢN',
        values: ['Chính sách bảo mật', 'Tin tức', 'Liên hệ'],
    },
    {
        label: 'CHI NHÁNH',
        values: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Hải Phòng', 'Cần Thơ'],
    },
    {
        label: 'THÔNG TIN WEBSITE',
        values: [
            'Địa chỉ: Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội',
            'Điện thoại: 0988 886 666',
            'Email: filmgo1102@gmail.com',
            'Giờ làm việc: 8:00 - 22:00 (T2 - CN)',
        ],
    },
];

const Footer = () => {
    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="w-full">
            {/* Slider Partner */}
            

            {/* Footer Content */}
            <div className="bg-[#1a1a1a] py-[60px]">
                <ContainerWapper>
                    <div className="w-full text-[#ccc] grid lg:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-[30px] px-[20px] lg:px-0">
                        {cates.map((item, index) => (
                            <ItemCommon key={index} data={item} />
                        ))}
                    </div>
                </ContainerWapper>
            </div>
        </div>
    );
};

export default Footer;

const ItemCommon = ({ data }) => {
    if (data.logo) {
        return (
            <div className="flex flex-col items-start">
                <div className="bg-white p-2 rounded-full w-[160px] flex items-center justify-center mb-[16px]">
                    <img
                        src={data.logo}
                        alt="Logo"
                        className="w-full h-auto object-contain"
                    />
                </div>
                <p className="text-[#bbbbbb] text-[14px] max-w-[220px] leading-[1.6]">{data.description}</p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-white text-[16px] font-[500] uppercase mb-[15px]">{data.label}</p>
            <Indicator />
            <ul className="mt-[20px]">
                {data.values.map((val, idx) => (
                    <li
                        key={idx}
                        className="mb-[10px] text-[#ccc] hover:text-white transition-all flex gap-[8px]"
                    >
                        <i className="bi bi-circle-fill text-[8px] text-[#ff4d4d] mt-[5px]" />
                        {val}
                    </li>
                ))}
            </ul>
        </div>
    );
};

