import './App.css';
import React, {useState, useEffect} from "react";
import Map from "./Map";

function App() {
  //adding browser geolocation logic for use in maps
  const [defaultCoords, setDefaultCoords] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setDefaultCoords(position.coords);
          console.log("coords fetched");
        },
        error => {
          if (error.PERMISSION_DENIED) {
            console.log("position denied");
          }
          else if (error.POSITION_UNAVAILABLE) {
            console.log("position unavailable");
          }
          else if (error.TIMEOUT) {
            console.log("position timeout");
          }
          else if (error.UNKNOWN_ERROR) {
            console.log("unknown error");
          }
        });
    }
    else if (!navigator.geolocation) {
      console.log("coords not supported by the browser");
      return;
    }
  }, []);
  // console.log(defaultCoords);

  return (
    <div className="App">
      {
        defaultCoords.length !== 0 ? 
        <Map defaultCoords={defaultCoords}/>
        :
        <p>Please enable geolocation access in your browser and reload the page.</p>
      }
    </div>
  );
}

export default App;
