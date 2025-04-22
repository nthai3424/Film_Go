import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import MainTemplate from '../../templates/MainTemplate';

const { Title } = Typography;
const { TextArea } = Input;

const { Text } = Typography;

const ContactUs = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            const fullName = values.name;
            const email = values.email;
            const message = values.comment;

            const html = `
              # Có thông báo mới từ form CONTACT
                * Có người dùng đăng ký nhận thông tin:
                  - Họ Và Tên: ${fullName}
                  - Email: ${email}
                  - Thời gian: ${new Date().toLocaleDateString()}
                  - Nội dung cần hỗ trợ: ${message}
            `;
            setIsLoading(true);
            await axios.post('https://api.telegram.org/bot7924001166:AAF5VWDWMtomEGpwZx3jdZZ_11cySu3N7es/sendMessage', {
                chat_id: -4766236053,
                text: html,
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <MainTemplate>
            <div style={{ background: '#f6f6f6' }}>
                <Row justify="center" className="p-[50px]">
                    <Col xs={24} md={16} style={{ padding: '30px', borderRadius: '8px' }}>
                        <Title level={2} style={{ marginBottom: '30px' }}>
                            Liên hệ
                        </Title>
                        <Row gutter={[32, 32]}>
                            <Col xs={24} md={24}>
                                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                                    <div className="flex gap-6 w-full">
                                        <Form.Item
                                            label="Tên"
                                            className="w-[50%]"
                                            name="name"
                                            rules={[{ required: true, message: 'Please enter your name!' }]}
                                        >
                                            <Input
                                                width={'100%'}
                                                className="block"
                                                style={{
                                                    height: 50,
                                                }}
                                                placeholder="Your Name"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            className="w-[50%]"
                                            label="Email"
                                            name="email"
                                            rules={[
                                                { required: true, message: 'Please enter your email!' },
                                                { type: 'email', message: 'Invalid email format!' },
                                            ]}
                                        >
                                            <Input
                                                width={'100%'}
                                                style={{
                                                    height: 50,
                                                }}
                                                className="block"
                                                placeholder="Your Email"
                                            />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        label="Nội dung"
                                        name="comment"
                                        rules={[{ required: true, message: 'Please enter your comment!' }]}
                                    >
                                        <TextArea rows={4} placeholder="Your Comment" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            loading={isLoading}
                                            className="bg-[#ee4d2d] text-[#fff] w-[170px] h-[50px]"
                                            htmlType="submit"
                                        >
                                            Gửi
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="h-[560px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.867963234415!2d105.74435187587261!3d21.03796848746112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455305afd834b%3A0x17268e09af37081e!2sT%C3%B2a%20nh%C3%A0%20FPT%20Polytechnic.!5e0!3m2!1sen!2s!4v1745061033376!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                    ></iframe>
                </div>
                <div>
                    <ContactInfoCard />
                </div>
                <div>
                    <PartnersCarousel />
                </div>
            </div>
        </MainTemplate>
    );
};

export default ContactUs;

export const ContactInfoCard = () => {
    const contactDetails = [
        {
            icon: <PhoneOutlined className="text-2xl text-red-500" />,
            title: 'contact',
            info: ['+91-12345789', '+91-4444-5555'],
        },
        {
            icon: <EnvironmentOutlined className="text-2xl text-red-500" />,
            title: 'Location',
            info: ['601 - Ram Nagar, India', 'Omex City 245, America'],
        },
        {
            icon: <MailOutlined className="text-2xl text-red-500" />,
            title: 'Email',
            info: ['presenter@example.com', 'movie@example.com'],
        },
    ];

    return (
        <Card
            className="w-full mx-auto"
            style={{
                body: { padding: '40px' },
            }}
        >
            <div className="grid grid-cols-3 gap-4">
                {contactDetails.map((detail, index) => (
                    <div key={index} className="flex flex-col items-center text-center space-y-2">
                        <div className="bg-red-500/20 p-3 rounded-full mb-2">{detail.icon}</div>
                        <Text strong className="text-gray-700 capitalize">
                            {detail.title}
                        </Text>
                        {detail.info.map((info, infoIndex) => (
                            <Text key={infoIndex} type="secondary" className="text-xs font-semibold">
                                {info}
                            </Text>
                        ))}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const PartnersCarousel = () => {
    const partners = [
        { name: 'Henderson', logo: '/images/content/p1.jpg' },
        { name: 'Miller', logo: '/images/content/p2.jpg' },
        { name: 'Hipster', logo: '/images/content/p3.jpg' },
        { name: 'Smokeville', logo: '/images/content/p4.jpg' },
        { name: 'Balaxa', logo: '/images/content/p5.jpg' },
        { name: 'Miller', logo: '/images/content/p6.jpg' },
        { name: 'Henderson', logo: '/images/content/p1.jpg' },
        { name: 'Miller', logo: '/images/content/p2.jpg' },
        { name: 'Hipster', logo: '/images/content/p3.jpg' },
        { name: 'Smokeville', logo: '/images/content/p4.jpg' },
        { name: 'Balaxa', logo: '/images/content/p5.jpg' },
        { name: 'Miller', logo: '/images/content/p6.jpg' },
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="w-full py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 relative inline-block mb-8">
                        OUR PATNER&apos;S
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 transform -translate-y-1/2"></span>
                    </h2>
                </div>

                <Slider {...settings}>
                    {partners.map((partner, index) => (
                        <div key={index} className="px-4 flex justify-center items-center">
                            <div className="grayscale hover:grayscale-0 transition-all duration-300 ease-in-out">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-h-16 mx-auto opacity-50 hover:opacity-100"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};
