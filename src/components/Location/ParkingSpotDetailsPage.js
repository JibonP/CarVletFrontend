import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants/helper/helper";
import axios from "axios";
import "./Details.css";
import ParkingSpotDetails from "./ParkingSpotDetails";

function ParkingSpotDetailsPage() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const backendURL = BASE_URL + "/parking-spots";

    axios.get(backendURL).then((response) => {
      setParkingSpots(response.data.properties);
    });
  }, []);

  const handleSpotClick = (spot) => {
    setSelectedSpot(spot);
  };

  const showSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="parking-spot-details-page">
      {searchResults ? (
        <div>
          <h1>Search Results..</h1>
          {searchResults.map((result, index) => (
            <div
              className="search-result-card"
              key={index}
              onClick={() => handleSpotClick(result)}
            >
              <h2>Property Address: {result.prop_address}</h2>
              <p>Number of Spaces: {result.number_spaces}</p>
              <p>Billing Type: {result.billing_type}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {parkingSpots.map((spot) => {
            return (
              <div className="parking-spot-card" key={spot.property_id}>
                <ParkingSpotDetails spot={spot} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ParkingSpotDetailsPage;
