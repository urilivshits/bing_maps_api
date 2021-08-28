import React, {useEffect, useState} from "react";
import {myApi} from "./myApi";

const Map = ({defaultCoords}) => {
    
    const [mapSaved, setMapSaved] = useState([]);

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${myApi.key}`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        
        let pinsCounter = 0;
        let coords = [];

        const loadMapScenario = () => {
           //launching basic functionality centered at ISP location - may be off depending on your ISP
            var map = new window.Microsoft.Maps.Map(document.getElementById('myMap'), {
                center: new window.Microsoft.Maps.Location(defaultCoords.latitude, defaultCoords.longitude),
                zoom: 9
           });

           //adding autosuggest - suggestion pins also include the polygon functionality
           window.Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
            var options = {
                maxResults: 4,
                map: map
            };
            var manager = new window.Microsoft.Maps.AutosuggestManager(options);
            manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
            });

            function selectedSuggestion(suggestionResult) {
                //check to update the pins and polygons array
                if (pinsCounter >= 3) {
                    map.entities.clear(); //would've added instead .shift() functionality to remove only the oldest marker from the map but need more time to figure out how to manipulate map.entities
                    coords = [];
                    pinsCounter = 0;
                };

                //adding new pins
                map.setView({ center: new window.Microsoft.Maps.Location(suggestionResult.location.latitude, suggestionResult.location.longitude), zoom: 10 });
                var pushpin = new window.Microsoft.Maps.Pushpin(suggestionResult.location);
                map.entities.push(pushpin);
                document.getElementById('printoutPanel').innerHTML =
                '<br> ' + suggestionResult.formattedSuggestion +
                '<br> Lat: ' + suggestionResult.location.latitude +
                '<br> Lon: ' + suggestionResult.location.longitude;
                pinsCounter++;

                //saving results for triangulation
                suggestionResult.timeStamp = Date.now();
                setMapSaved(oldArray => [...oldArray, suggestionResult] );
                
                //adding polygon functionality
                coords.push(new window.Microsoft.Maps.Location(suggestionResult.location.latitude, suggestionResult.location.longitude));
                
                var polygon = new window.Microsoft.Maps.Polygon(coords, {
                    fillColor: 'rgba(0, 255, 0, 0.5)',
                    strokeColor: 'red',
                    strokeThickness: 2
                });
                map.entities.push(polygon);
            };

        };

        //couldn't work out a better way to launch the native maps so far in the given timeframe; existing npm packages lack the required functionality though
        setTimeout(() => {
            loadMapScenario();
        }, 500);

        return () => {
            document.body.removeChild(script);
        };
    }, [defaultCoords.latitude, defaultCoords.longitude]);
    
    //this is not used since managed to manipulate it all inside the native component
    if (mapSaved.length > 3) {
        let fullArray = mapSaved;
        // fullArray.shift();
        setMapSaved([fullArray[fullArray.length - 1]]);
    };

    // console.log("mapSaved", mapSaved);
    
    return (
        <div>
            <div style={{zIndex: "2", position: "absolute"}} id='searchBoxContainer'><input type= 'text' id= 'searchBox'/></div>
            <div style={{zIndex: "1", position: "absolute", top: "1.5rem"}} id='printoutPanel'></div>
            <div  style={{zIndex: "-1", position: "absolute"}} id="myMap"></div>
        </div>
    )
};

export default Map;

