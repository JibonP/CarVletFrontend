import { useGetUserInfoQuery } from "../../redux/userActions/userApiSlice";
import { useSelector } from "react-redux";
import Loading from "../../assets/Spinners/Loading";
import { Link } from "react-router-dom";
import ClientBookings from "./ClientBookings";
import { FaChevronCircleLeft } from "react-icons/fa";
import "./Styles/Client&ClientSearch.css";
const Client = () => {
  const { data: userData, isLoading } = useGetUserInfoQuery();
  const roles = useSelector((state) => state.roles);
  return (
    <div className="cl-views-container">
      <header className="cl-views-header">
        <div className="cl-h-svgleft">
          <Link to="/admin">
            <FaChevronCircleLeft />
          </Link>
        </div>
        <h1>Client Page</h1>
      </header>
      <nav className="clview-navbar">
        {isLoading ? (
          <Loading />
        ) : userData?.all_is_auth || (roles?.Renter && roles.Client.bckgr) ? (
          <>
            <div className="clview-nav-item">
              <Link to="/client/search">Search and Make a new booking. <br/>Search Page</Link>
            </div>
            <div className="clview-nav-item">
              <Link to="/client/transactions">My Activity</Link>
            </div>
          </>
        ) : (
          <div className="clview-nav-item">
            Bookings made easy after you confirm your details.
          </div>
        )}
      </nav>
        <ClientBookings />
    </div>
  );
};

export default Client;
