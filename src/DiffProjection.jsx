import React from "react";
import { useEffect, useRef } from "react";
import { Map } from "ol";
import TileLayer from "ol/layer/WebGLTile.js";
import { XYZ } from "ol/source";

import GeoTIFF from "ol/source/GeoTIFF.js";
import proj4 from "proj4";
import { epsgLookupMapTiler, fromEPSGCode, register, setEPSGLookup } from "ol/proj/proj4.js";
import Draw from "ol/interaction/Draw.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile, Vector as VectorLayer } from "ol/layer.js";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";

const DiffProjection = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    //projection layer
    const key = "arbWFpzMUfWfbX78oSoD";

    register(proj4);
    setEPSGLookup(epsgLookupMapTiler(key));

    const cogSource = new GeoTIFF({
      sources: [
        {
          url: "https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif",
          nodata: 0,
        },
      ],
    });

    //drawing layer

    const raster = new Tile({
      source: new OSM(),
    });

    const source = new VectorSource({ wrapX: false });

    const vector = new VectorLayer({
      source: source,
    });

    const tileLayer = new TileLayer({
      source: new XYZ({
        url: "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" + key,
        maxZoom: 20,
        crossOrigin: "",
      }),
      style: { exposure: 0.2 },
    });

    const layercogSource = new TileLayer({
      source: cogSource,
      opacity: 0.7,
      style: { gamma: 0.7 },
    });
    const map = new Map({
      target: mapRef.current,
      layers: [vector, raster, tileLayer, layercogSource],
      view: cogSource.getView().then((viewConfig) => fromEPSGCode(viewConfig.projection.getCode()).then(() => viewConfig)),
    });

    const typeSelect = document.getElementById("type");

    let draw;
    function addInteraction() {
      const value = typeSelect.Value;
      if (value !== "None") {
        draw = new Draw({
          source: source,
          type: typeSelect.value,
        });
        map.addInteraction(draw);
      }
    }
    /* Handle change event */
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };

    document.getElementById("undo").addEventListener("click", function () {
      draw.removeLastPoint();
    });

    addInteraction();
    console.log("map render");
    return () => map.setTarget(undefined);
  }, []);
  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      <div className="row">
        <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" typeof="type">
              Geometry type:
            </label>
            <select className="form-select" id="type">
              <option value="Point">Point</option>
              <option value="LineString">LineString</option>
              <option value="Polygon">Polygon</option>
              <option value="Circle">Circle</option>
              <option value="None">None</option>
            </select>
            <input className="form-control" type="button" value="Undo" id="undo" />
          </span>
        </div>
      </div>
    </>
  );
};

export default DiffProjection;
