import React, { useState } from 'react';
import MainTemplate from './../../templates/MainTemplate';

export default function TicketPricing() {
    const [activeTab, setActiveTab] = useState('standard');

    const seatTypes = [
        {
            id: 'standard',
            name: 'Ghế Thường',
            price: 65000,
            features: ['Ghế đơn tiêu chuẩn', 'Chất liệu nỉ cao cấp', 'Tầm nhìn tốt', 'Có giá để đồ uống'],
            image: 'https://png.pngtree.com/png-vector/20230227/ourmid/pngtree-golden-ticket-png-image_6621563.png',
            color: 'blue',
        },
        {
            id: 'vip',
            name: 'Ghế VIP',
            price: 85000,
            features: [
                'Vị trí trung tâm tốt nhất',
                'Ghế rộng hơn ghế thường',
                'Đệm êm cao cấp',
                'Tựa tay rộng rãi',
                'Có giá để đồ uống cao cấp',
            ],
            image: 'https://i0.wp.com/therockandblues.com/wp-content/uploads/2018/05/vip.png?fit=1000%2C1000&ssl=1',
            color: 'blue',
        },
        {
            id: 'couple',
            name: 'Ghế Đôi',
            price: 120000,
            features: [
                'Sofa đôi cho hai người',
                'Không gian riêng tư',
                'Thiết kế không có tựa tay ở giữa',
                'Chất liệu da cao cấp',
                'Có thể điều chỉnh góc nghiêng',
                'Bàn đồ ăn riêng',
            ],
            image: 'https://png.pngtree.com/png-vector/20230107/ourmid/pngtree-golden-ticket-coupon-vip-pass-template-vector-illustration-can-be-used-png-image_6553062.png',
            color: 'blue',
        },
    ];

    // Calculate price based on time period

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <MainTemplate>
            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-800 to-red-600 text-white">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-2">Bảng Giá Vé</h1>
                        <p className="text-red-100">
                            Thông tin chi tiết về giá vé và các loại ghế tại hệ thống rạp của chúng tôi
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="border-b border-gray-200">
                                <div className="flex overflow-x-auto">
                                    {seatTypes.map((seatType) => (
                                        <button
                                            key={seatType.id}
                                            className={`py-4 px-6 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                                                activeTab === seatType.id
                                                    ? `text-${seatType.color}-600 border-b-2 border-${seatType.color}-600`
                                                    : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                            onClick={() => setActiveTab(seatType.id)}
                                        >
                                            {seatType.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content for active tab */}
                            <div className="p-6">
                                {seatTypes.map(
                                    (seatType) =>
                                        activeTab === seatType.id && (
                                            <div key={seatType.id} className="seat-details">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Seat image */}
                                                    <div className="md:w-1/3">
                                                        <div className={`bg-${seatType.color}-50 p-2 rounded-lg mb-4`}>
                                                            <img
                                                                src={seatType.image}
                                                                alt={`Ghế ${seatType.name}`}
                                                                className="w-full rounded-lg"
                                                            />
                                                        </div>
                                                        <div
                                                            className={`bg-${seatType.color}-600 text-white rounded-lg p-4 text-center`}
                                                        >
                                                            <h3 className="text-xl font-bold">
                                                                {formatPrice(seatType.price)}
                                                            </h3>
                                                            <p className="text-sm text-white opacity-80">
                                                                Đồng giá tất cả các ngày
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Seat info */}
                                                    <div className="md:w-2/3">
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                                            {seatType.name}
                                                        </h2>

                                                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                                            <h3 className="font-semibold text-gray-700 mb-2">
                                                                Tính năng ghế:
                                                            </h3>
                                                            <ul className="space-y-2">
                                                                {seatType.features.map((feature, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <div
                                                                            className={`mr-2 text-${seatType.color}-500 mt-1`}
                                                                        >
                                                                            <svg
                                                                                className="w-4 h-4"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                    clipRule="evenodd"
                                                                                ></path>
                                                                            </svg>
                                                                        </div>
                                                                        <span className="text-gray-600">{feature}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {seatType.id === 'couple' && (
                                                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                                                <div className="flex">
                                                                    <div className="flex-shrink-0">
                                                                        <svg
                                                                            className="h-5 w-5 text-red-400"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <p className="text-sm text-red-700">
                                                                            Ghế đôi được thiết kế cho 2 người. Giá vé
                                                                            hiển thị là tổng giá cho cả 2 người.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Câu hỏi thường gặp</h2>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Trẻ em dưới 3 tuổi có phải mua vé không?
                                </h3>
                                <p className="text-gray-600">
                                    Trẻ em dưới 3 tuổi được miễn phí vé vào cửa nếu ngồi cùng ghế với phụ huynh. Mỗi
                                    người lớn chỉ được đi kèm một trẻ em miễn phí.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Làm thế nào để đặt ghế VIP hoặc ghế đôi?
                                </h3>
                                <p className="text-gray-600">
                                    Bạn có thể chọn loại ghế khi tiến hành đặt vé trực tuyến hoặc tại quầy vé. Số lượng
                                    ghế VIP và ghế đôi có hạn nên chúng tôi khuyến khích đặt trước để đảm bảo có chỗ.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-medium text-gray-800 mb-2">Có thể đặt trước vé theo nhóm không?</h3>
                                <p className="text-gray-600">
                                    Có, chúng tôi có dịch vụ đặt vé theo nhóm cho từ 10 người trở lên với mức giá ưu
                                    đãi. Vui lòng liên hệ bộ phận bán vé theo số hotline 1900 1234 để được hỗ trợ.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Tôi có thể sử dụng nhiều khuyến mãi cùng lúc không?
                                </h3>
                                <p className="text-gray-600">
                                    Không, mỗi giao dịch chỉ được áp dụng một loại khuyến mãi. Hệ thống sẽ tự động áp
                                    dụng khuyến mãi có lợi nhất cho khách hàng.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-md p-8 text-center ">
                        <h2 className="text-2xl font-bold mb-4">Đặt vé ngay hôm nay!</h2>
                        <p className="mb-6 text-white opacity-90">
                            Trải nghiệm những bộ phim bom tấn mới nhất với hệ thống âm thanh và hình ảnh đỉnh cao
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => {
                                    window.location.href = '/';
                                }}
                                className="bg-white text-red-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            >
                                Đặt vé ngay
                            </button>
                            <button
                                onClick={() => {
                                    window.location.href = '/';
                                }}
                                className="bg-transparent border-2 border-white text-white font-bold py-2 px-6 rounded-full hover:bg-white hover:text-red-500 transition-colors duration-200"
                            >
                                Xem lịch chiếu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 text-gray-300 mt-12">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center">
                            <p className="mb-2">© 2025 FirmPoly GO. Tất cả các quyền được bảo lưu.</p>
                            <p className="text-sm">
                                Giá vé có thể thay đổi mà không báo trước. Vui lòng kiểm tra thông tin tại rạp hoặc
                                website chính thức.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainTemplate>
    );
}
