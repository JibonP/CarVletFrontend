import React from "react";
import { smilingadult } from "../../assets";
import SearchForm from "../Forms/SearchForm";
import { useSelector } from "react-redux";
import "./Styles/MainImage.css";
import Loading from "../../assets/Spinners/Loading";

const MainImage = () => {
  const isLoading = useSelector((state) => state.searchResults.loading);
  const isError = useSelector((state) => state.searchResults.error);
  return (
    <div className="main-image-container">
      <img
        className="main-image img-fluid"
        src={smilingadult}
        alt="smilingadult"
      />
      <div className="overlay">
        <div className="fw-bold">Your Space. Their convenience.</div>
        <div className="search-bar">
          <SearchForm />
          <div className="date-picker">
            <button>Check-in Date</button>
            <button>Check-out Date</button>
          </div>
          <div>
            {isLoading && (
              <div>
                <Loading />
              </div>
            )}
            {isError && <div className="capsule fail">{isError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainImage;
