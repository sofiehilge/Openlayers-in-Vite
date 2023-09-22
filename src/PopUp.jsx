import React, { useRef, useEffect } from "react";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { toLonLat } from "ol/proj.js";
import { toStringHDMS } from "ol/coordinate.js";

const PopUp = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    /**
     * Elements that make up the popup.
     */
    const container = document.getElementById("popup");
    const content = document.getElementById("popup-content");
    const closer = document.getElementById("popup-closer");

    /**
     * Create an overlay to anchor the popup to the map.
     */
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    const key = "arbWFpzMUfWfbX78oSoD";
    const attributions = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' + '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    /**
     * Create the map.
     */
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" + key,
            tileSize: 512,
          }),
        }),
      ],
      overlays: [overlay],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    /**
     * Add a click handler to the map to render the popup.
     */
    map.on("singleclick", function (evt) {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));

      content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
      overlay.setPosition(coordinate);
    });

    console.log("map render");
    return () => map.setTarget(undefined);
  }, []);
  return (
    <>
      <div id="map" ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <div id="popup" className="ol-popup">
        <a href="#" className="ol-popup-closer" id="popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </>
  );
};

export default PopUp;
