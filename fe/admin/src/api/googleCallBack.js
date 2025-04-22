import {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {

        fetch(`http://filmgo.io.vn/api/auth/google/callback${location.search}`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('user', JSON.stringify({ ...data.data.user }));
                localStorage.setItem('access_token', data.data.access_token);
                navigate('/');
            });
    }, [location.search, navigate]);
}
export default GoogleCallback;