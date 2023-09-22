import React from "react";
import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Style, Stroke, Icon } from "ol/style";
import { XYZ } from "ol/source";

import GeoJSON from "ol/format/GeoJSON.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { Modify } from "ol/interaction.js";
import { OGCMapTile, Vector as VectorSource } from "ol/source.js";

const ModifyIcon = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const iconFeature = new Feature({
      geometry: new Point([0, 0]),
      name: "Null Island",
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "data/icon.png",
      }),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    //https://openlayers.org/en/latest/examples/modify-icon.html

    const mapSource = new TileLayer({
      source: new XYZ({
        url: "http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [mapSource],
      view: new View({
        center: [0, 0],
        zoom: 3,
        projection: "EPSG:3857",
      }),
    });

    console.log("map render");
    return () => map.setTarget(undefined);
  }, []);
  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ModifyIcon;
