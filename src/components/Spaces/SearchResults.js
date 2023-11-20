import React, { useEffect, useState } from "react";
import * as geolib from "geolib";
import { useSelector } from "react-redux";
import { useGetAvailLandingSpotsQuery } from "../../redux/client/searchApiSlice";
import { getLanSearchStatus } from "../../redux/landing/landingSearchSlice";
import { getCarTruckPrice } from "../../constants/reducers/searchform";
import SearchLoading from "../../assets/Spinners/SearchLoading";
import { Link } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const searchResults = useSelector((state) => state.searchResults.data);
  const searchLocation = useSelector((state) => state.searchResults.location);
  const searchStatus = useSelector(getLanSearchStatus);
  const searchArr = useSelector((state) => state.landing);
  const {
    data: landingSearchResults,
    isSuccess,
    isLoading,
  } = useGetAvailLandingSpotsQuery(searchArr[searchArr.length - 1], {
    skip: searchStatus,
  });
  const [useArray, setUseArray] = useState(null);
  const [selectedOption, setSelectedOption] = useState("distance");

  useEffect(() => {
    console.log("Search Arr:", searchArr);
    console.log("Last Search Arr:", searchArr[searchArr.length - 1]);
    console.log("Landing Search Results Data:", landingSearchResults);
    console.log("Search Status:", searchStatus);
    console.log("Is Success:", isSuccess);

    let results = searchResults?.results || landingSearchResults;

    if (searchStatus || isSuccess) {
      setUseArray(chooseArray({ type: selectedOption, payload: results }));
    }
  }, [landingSearchResults, searchStatus, isSuccess, searchArr]);

  const calculateDistance = (searchLocation, result) => {
    const startPoint = {
      latitude: searchLocation.lat,
      longitude: searchLocation.lng,
    };

    const endPoint = {
      latitude: result.latitude,
      longitude: result.longitude,
    };

    console.log("startPoint:", startPoint);
    console.log("endPoint:", endPoint);

    if (
      !startPoint.latitude ||
      !startPoint.longitude ||
      !endPoint.latitude ||
      !endPoint.longitude
    ) {
      console.error("Invalid coordinates:", startPoint, endPoint);
      return 0;
    }

    const distance = geolib.getDistance(startPoint, endPoint);

    return distance * 0.00062137119;
  };

  const chooseArray = (action) => {
    let filteredResults;

    switch (action.type) {
      case "distance":
        filteredResults = (action.payload || []).filter(
          (item) => +item.row_num === 1
        );
        return filteredResults.map((item) => ({
          ...item,
          distance: calculateDistance(searchLocation, item),
        }));

      case "high":
        filteredResults = [...action.payload].sort((a, b) => a.price - b.price);
        break;

      case "low":
        filteredResults = [...action.payload].sort((a, b) => b.price - a.price);
        break;

      default:
        return [];
    }

    return filteredResults.map((item) => ({
      ...item,
      distance: calculateDistance(searchLocation, item),
    }));
  };

  if (isLoading || !useArray) {
    return <SearchLoading />;
  } else if (useArray) {
    let results = searchResults?.results || landingSearchResults;

    return (
      <main className="search-main">
        <h1 className="s-res-header-text">Search Results</h1>

        <div className="sort-button-container">
          <label htmlFor="sortByPrice">Sort by Price:</label>
          <select
            id="sortByPrice"
            className="sort-dropdown"
            value={selectedOption}
            onChange={(e) => {
              setUseArray(
                chooseArray({
                  type: e.target.value,
                  payload: results.filter((item) => +item.row_num === 1),
                })
              );

              setSelectedOption(e.target.value);
            }}
          >
            <option value="high">Low to High</option>
            <option value="low">High to Low</option>
            <option value="distance">Distance</option>
          </select>
        </div>
        <div>
          {searchLocation && (
            <div className="location-info">
              <i className="fas fa-map-marker-alt"></i>
              <h3>Destination: {searchLocation.addr}</h3>
            </div>
          )}
        </div>
        <div className="search-reslist">
          {useArray?.length > 0 &&
            useArray.map((item, i) => {
              let avail = item.count_spaces !== item.occupied;
              let cartruckp = getCarTruckPrice(useArray, item.property_id);

              return (
                <div className="spot-info" key={i}>
                  <p>Address: {item.prop_address}</p>
                  <p>Zip Code: {item.zip}</p>
                  {searchStatus && (
                    <>
                      <p>Available now: {avail ? "Yes" : "No"}</p>
                      <p>Number of spaces: {item.count_spaces}</p>
                    </>
                  )}
                  <p>Billing Type: {item.billing_type}</p>
                  {!searchStatus && (
                    <Link
                      to={`/checkout/${item.property_id.substring(
                        0,
                        13
                      )}/?starts=${searchArr[searchArr.length - 1][2]}&ends=${
                        searchArr[searchArr.length - 1][3]
                      }`}
                    >
                      Checkout
                    </Link>
                  )}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Commuter price</th>
                        <th>Large vehicle price</th>
                        <th>Distance (miles)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>${cartruckp[0]}</td>
                        <td>${cartruckp[1]}</td>
                        <td>
                          {typeof item.distance === "number"
                            ? item.distance.toFixed(2)
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    {item.picture && <img alt="propimage" src={item.picture} />}
                    <Link to={`/parking-spots/${item.space_id}`}>
                      <button className="show-me-button">Show More</button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    );
  } else {
    return <div>Empty Results</div>;
  }
};

export default SearchResults;
