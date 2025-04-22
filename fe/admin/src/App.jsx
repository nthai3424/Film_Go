import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./layouts/LayoutAdmin";

import AddMovies from "./pages/Movies/AddMovies";
import ListActor from "./pages/Actors/ListActors";
import AddActor from "./pages/Actors/AddActors";
import EditActor from "./pages/Actors/EditActors";
import ListGenres from "./pages/Genres/ListGenres";
import AddGenres from "./pages/Genres/AddGenres";
import EditGenres from "./pages/Genres/EditGenres";
import ListMovies from "./pages/Movies/ListMovies";
import EditMovies from "./pages/Movies/EditMovies";
import ListBanners from "./pages/Bannners/ListBanners";
import AddBanners from "./pages/Bannners/AddBanners";
import UserList from "./pages/user/UserList";
import UpdateCinema from "./pages/cinema/UpdateCinema";
import ListCinema from "./pages/cinema/ListCinema";

import Signup from "./SignUp";
import Signin from "./SignIn";

import ListProvince from "./pages/province/ListProvince";
import UpProvince from "./pages/province/UpProvince";

import ListRoom from "./pages/room/ListRoom";
import UpdateRoom from "./pages/room/UpdateRoom";
import ListShow from "./pages/showtimes/ListShow";
import CreateShow from "./pages/showtimes/CreateShow";
import UpdateShow from "./pages/showtimes/UpdateShow";
import ListProduct from "./pages/Products/ListProduct";
import CreateProduct from "./pages/Products/CreateProduct";
import UpdateProduct from "./pages/Products/UpdateProduct";
import "./App.css";
import ListPromo from "./pages/PromoCodes/ListPromo";
import CreatePromo from "./pages/PromoCodes/CreatePromo";
import UpdatePromo from "./pages/PromoCodes/UpdatePromo";
import Seat from "./pages/Seat";
import GoogleCallback from "@/api/googleCallBack";
import PageNotFound from "./PageNotFound";
import ListTiket from "./pages/ticket/ListTiket";
import CheckTicket from "./pages/ticket/CheckTiket";
import DetailTiket from "./pages/ticket/DetailTiket";
import FogotPass from "./FogotPass";
import Changepass from "./Changepass";
import Dashboard from "./Dashbroad";
import CreatCinema from "./pages/cinema/CreatCinema";
import CreatProvince from "./pages/province/CreatProvince";
import CreatRoom from "./pages/room/CreatRoom";
import LayoutStaff from "./layouts/LayoutStaff";
import UpdateUser from "./pages/user/UpdateUser";
import StaffTiket from "./pages/ticket/StaffTicket";

function App() {
  return (
    <>
      {/* router admin */}
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="list-movies" element={<ListMovies />} />
          <Route path="create-movies" element={<AddMovies />} />
          <Route path="update-movies/:id" element={<EditMovies />} />
          <Route path="list-actors" element={<ListActor />} />
          <Route path="create-actors" element={<AddActor />} />
          <Route path="update-actors/:id" element={<EditActor />} />
          <Route path="list-genres" element={<ListGenres />} />
          <Route path="create-genres" element={<AddGenres />} />
          <Route path="update-genres/:id" element={<EditGenres />} />
          <Route path="list-banners" element={<ListBanners />} />
          <Route path="create-banners" element={<AddBanners />} />
          <Route path="list-user" element={<UserList />} />
          <Route path="update-user/:id" element={<UpdateUser />} />
          <Route path="list-cinema" element={<ListCinema />} />
          <Route path="creat-cinema" element={<CreatCinema />} />
          <Route path="update-cinema/:id" element={<UpdateCinema />} />
          <Route
            path="/admin/creat-province"
            element={<CreatProvince />}
          ></Route>
          <Route path="/admin/list-province" element={<ListProvince />}></Route>
          <Route
            path="/admin/update-province/:id"
            element={<UpProvince />}
          ></Route>
          <Route path="/admin/creat-screen" element={<CreatRoom />}></Route>
          <Route path="/admin/list-screen" element={<ListRoom />}></Route>
          <Route
            path="/admin/update-screen/:id"
            element={<UpdateRoom />}
          ></Route>
          <Route path="/admin/creat-showtime" element={<CreateShow />}></Route>
          <Route path="/admin/list-showtime" element={<ListShow />}></Route>
          <Route
            path="/admin/update-showtime/:id"
            element={<UpdateShow />}
          ></Route>
          <Route path="list-product" element={<ListProduct />} />
          <Route path="creat-product" element={<CreateProduct />} />
          <Route path="update-product/:id" element={<UpdateProduct />} />
          <Route path="list-promo" element={<ListPromo />} />
          <Route path="create-promo" element={<CreatePromo />} />
          <Route path="update-promo/:id" element={<UpdatePromo />} />
          <Route path="seats" element={<Seat />} />
          <Route path="list-ticket" element={<ListTiket />} />
          <Route path="check-ticket" element={<CheckTicket />} />
          <Route path="detail-ticket/:id" element={<DetailTiket />} />
        </Route>
        <Route path="/staff" element={<LayoutStaff />}>
          <Route path="list-ticket" element={<StaffTiket />} />
          <Route path="check-ticket" element={<CheckTicket />} />
          <Route path="detail-ticket/:id" element={<DetailTiket />} />
        </Route>

        <Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/auth/google" element={<GoogleCallback />}></Route>
          <Route path="/pagenot" element={<PageNotFound />}></Route>
          <Route path="/fogotpass" element={<FogotPass />}></Route>
          <Route path="/changepass" element={<Changepass />}></Route>
        </Route>
      </Routes>

      {/* router user */}
      <Routes>
        <Route></Route>
      </Routes>
    </>
  );
}

export default App;
