import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLoginUserSuccess, handleLogoutUser } from '../../app/slices/appSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {

        fetch(`http://filmgo.io.vn/api/auth/google/callback${location.search}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data.status);
                if (data.status === false) {
                    dispatch(handleLogoutUser());
                    navigate('/');
                    Swal.fire({
                        icon: 'info',
                        text: 'Tài khoản của bạn đã bị khóa',
                        showConfirmButton: true,
                    })
                } else {
                    dispatch(
                        handleLoginUserSuccess({
                            user: [data.data.user],
                            tokens: {
                                accessToken: data.data.access_token,
                                refreshToken: data.data.refresh_token,
                            },
                        }),
                    );
                    navigate('/');
                }
            });
    }, [location.search, navigate]);
}
export default GoogleCallback;