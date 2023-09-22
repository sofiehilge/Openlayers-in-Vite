import React from "react";
import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { Style, Stroke } from "ol/style";
import { XYZ } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON.js";
import "./index.css";
import OSM from "ol/source/OSM.js";
import { DragRotateAndZoom, defaults as defaultInteractions } from "ol/interaction.js";
import { OverviewMap, defaults as defaultControls } from "ol/control.js";

const Openlayers = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const rotateWithWiew = document.getElementById("rotateWithWiew");

    const overviewMapControl = new OverviewMap({
      className: "ol-overviewmap ol-custom-overviewmap",
      layers: [
        new TileLayer({
          source: new OSM({
            url: "https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png" + "?apikey=5d3778725d4b4deab8a44734d1b3aadb",
          }),
        }),
      ],
      collapseLabel: "\u00BB",
      label: "\u00AB",
      collapsed: false,
    });

    rotateWithWiew.addEventListener("change", function () {
      overviewMapControl.setRotateWithView(this.checked);
    });

    const vectorSource = new VectorLayer({
      source: new VectorSource({}),
      /* style: [
        new Style({
          stroke: new Stroke({
            color: "#f21602",
            width: 2,
          }),
        }),
      ], */
    });
    const mapSource = new TileLayer({
      source: new XYZ({
        url: "http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      }),
    });

    const map = new Map({
      controls: defaultControls().extend([overviewMapControl]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      target: mapRef.current,
      layers: [mapSource, vectorSource],
      view: new View({
        center: [500000, 6000000],
        zoom: 7,
        projection: "EPSG:3857",
      }),
    });

    //fetch vectorlayers for countries

    fetch("https://carn.dk/sites/openlayers/api/?k=countries.geojson")
      .then((response) => response.json())
      .then((response) => {
        console.log("countries", response);

        const featureCollection = new GeoJSON().readFeatures(response, {
          dataProjection: "EPSG:4326",
          featureProjection: map.getView().getProjection(),
        });

        vectorSource.getSource().addFeatures(featureCollection);
      })
      .catch((err) => console.error(err));

    console.log("map render");
    return () => map.setTarget(undefined);
  }, []);
  return (
    <>
      <div id="map" className="map" ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <div>
        <label>
          <input type="checkbox" id="rotateWithWiew" />
          Rotate with view
        </label>
      </div>
    </>
  );
};

export default Openlayers;
