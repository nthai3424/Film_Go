import { CloseOutlined, GoogleOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Modal } from 'antd';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { handleLoginUserSuccess, handleToggleModalAuth } from '../../../app/slices/appSlice';
import firebaseConfig from '../../../helpers/firebase';
import { useLoginUser } from '../../../services/auth/login';
import { useRegisterUser } from '../../../services/auth/register';
import { getUrlLoginWithGoogle } from '../../../services/auth/authService';
import googleIcon from '../../../../public/images/Google_Icons-09-512.webp';

const LoginModal = () => {
    const isOpen = useSelector((state) => state.app.auth.isOpenModal);
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [form] = Form.useForm();
    const [userFireBase, setUserFireBase] = useState(false);

    const handleToggle = () => {
        dispatch(handleToggleModalAuth());
    };

    const loginUserMutation = useLoginUser({
        mutationConfig: {
            onSuccess(data) {
                dispatch(
                    handleLoginUserSuccess({
                        user: data.user,
                        tokens: {
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                        },
                    }),
                );
                Swal.fire({
                    icon: 'success',
                    text: 'Chúc mừng bạn đã đăng nhập thành công',
                }).then(() => {
                    // dispatch(handleToggleModalAuth());
                });
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'info',
                    text: error.response.data.message,
                });
            },
        },
    });

    const registerUserMutation = useRegisterUser({
        mutationConfig: {
            onSuccess() {
                Swal.fire({
                    icon: 'success',
                    text: 'Chúc mừng bạn đã đăng ký thành công vui lòng check email và đăng nhập lại',
                }).then(() => {
                    dispatch(handleToggleModalAuth());
                });
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'info',
                    text: error.response.data.message,
                });
            },
        },
    });

    const onFinish = (values) => {
        if (isLogin) {
            loginUserMutation.mutate(values);
        } else {
            const birthdayMoment = values.birthday;
            const birthdayString = birthdayMoment.format('YYYY-MM-DD');
            registerUserMutation.mutate({
                ...values,
                birthday: birthdayString,
            });
        }
        form.resetFields();
    };

    const provider = firebaseConfig();

    useEffect(() => {
        firebase.auth().signOut();
        if (!userFireBase) {
            firebase.auth().signOut();
            return;
        }
        const LoginFirebase = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                return;
            }
            let dataBuider = {
                name: user.displayName,
                email: user.email,
                password: 'loginGooogle',
                confirm_password: 'loginGooogle',
                phone: '0987654321',
                address: 'Đang cập nhật',
                birthday: '2025-04-03',
            };

            try {
                const res = await axios.post('http://filmgo.io.vn/api/auth/register', dataBuider);
                Swal.fire({
                    icon: 'info',
                    text: 'Email của bạn chưa được kích hoạt vui lòng kiểm tra email',
                });
            } catch (error) {
                loginUserMutation.mutate(dataBuider);
            }
        });

        return () => LoginFirebase();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userFireBase]);

    const handleLoginWithGoogle = async () => {
        try {
            const response = await getUrlLoginWithGoogle();
            dispatch(handleToggleModalAuth());
            window.location.href = response.url;
        } catch (error) {
            // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
            console.error('Lỗi đăng nhập Google:', error);
        }
    };

    return (
        <div>
            <Modal
                open={isOpen}
                onCancel={handleToggle}
                footer={null}
                closeIcon={<CloseOutlined className="text-gray-600" />}
                title={<div className="text-center font-bold text-lg">{isLogin ? 'Đăng nhập' : 'Đăng kí'}</div>}
                centered
                width={400}
            >
                {isLogin ? (
                    <Form
                        form={form}
                        name="login"
                        className="pt-4"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email or mobile number!' }]}
                        >
                            <Input placeholder="Email" className="py-2" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input.Password placeholder="Mật khẩu" className="py-2" />
                        </Form.Item>

                        <div className="text-right mb-4">
                            <a href="/forgot-password" className="text-red-400 text-sm">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Form.Item>
                            <Button
                                type="default"
                                htmlType="submit"
                                className="w-full py-5 h-auto bg-gray-200 font-medium"
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <Divider plain>
                            <div className="bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                hoặc
                            </div>
                        </Divider>

                        <Form.Item>
                            <Button
                                style={{
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    padding: '12px 0',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                }}
                                onClick={handleLoginWithGoogle}
                            >
                                Đăng nhập bằng Google
                                <img src={googleIcon} alt="Google Icon" className="w-[24px]" />
                            </Button>
                        </Form.Item>

                        <div className="text-center text-sm mt-2 mb-4">
                            Bạn chưa có tài khoản?{' '}
                            <a href="#" className="text-red-400" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? ' Đăng kí' : 'Đăng nhập'}
                            </a>
                        </div>

                        {/* <div className="text-center text-xs text-gray-500">
                            I agree to the{' '}
                            <a href="#" className="text-gray-500">
                                Terms & Conditions
                            </a>{' '}
                            &{' '}
                            <a href="#" className="text-gray-500">
                                Privacy Policy
                            </a>
                        </div> */}
                    </Form>
                ) : (
                    <Form form={form} name="register" layout="vertical" onFinish={onFinish} className="pt-4">
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input placeholder="Name" className="py-2" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email address!' },
                            ]}
                        >
                            <Input placeholder="Email" className="py-2" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Password" className="py-2" />
                        </Form.Item>

                        <Form.Item
                            label="Nhập lại mật khẩu"
                            name="confirm_password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('The two passwords that you entered do not match!'),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" className="py-2" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input placeholder="Phone Number" className="py-2" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!', min: 6 }]}
                        >
                            <Input placeholder="Address" className="py-2" />
                        </Form.Item>

                        <Form.Item
                            label="Ngày sinh"
                            name="birthday"
                            rules={[{ required: true, message: 'Please select your birthday!' }]}
                        >
                            <DatePicker format="YYYY-MM-DD" className="w-full" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                style={{
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    padding: '12px 0',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                }}
                                onClick={handleLoginWithGoogle}
                            >
                                Đăng nhập bằng Google
                                <img src={googleIcon} alt="Google Icon" className="w-[24px]" />
                            </Button>
                        </Form.Item>
                        <div className="text-center text-sm mt-2 mb-4">
                            Bạn đã có tài khoản?{' '}
                            <a href="#" className="text-red-400" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? ' Đăng kí' : 'Đăng nhập'}
                            </a>
                        </div>

                        {/* <div className="text-center text-xs text-gray-500">
                            I agree to the{' '}
                            <a href="#" className="text-gray-500">
                                Terms & Conditions
                            </a>{' '}
                            &{' '}
                            <a href="#" className="text-gray-500">
                                Privacy Policy
                            </a>
                        </div> */}
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default LoginModal;
