import api from "./index"

const getProvinces = async () => {
    const res = await api.get('/provinces');
    return res.data;
}

export { getProvinces }