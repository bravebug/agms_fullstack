import "./style.css";
import {Map, View} from "ol";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {fromLonLat} from "ol/proj";

const defaultLineStringStyle = new Style({
    fill: new Fill({
            color: "rgba(25, 109, 255, 1)",
        }),
    stroke: new Stroke({
        color: "rgba(25, 109, 255, 1)",
        width: 9,
    }),
});

const highlightLineStringStyle = new Style({
    stroke: new Stroke({
        color: "rgba(255, 204, 0, 1)",
        width: 15,
    }),
});

const defaultPointStyle = new Style({
    image: new CircleStyle({
        radius: 9,
        fill: new Fill({
            color: "rgba(255, 204, 0, 1)",
        }),
        stroke: new Stroke({
            color: "rgba(255, 255, 255, 1)",
            width: 2,
        }),
    }),
});

const roadLayer = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: roadsUrl,
    }),
    style: defaultLineStringStyle,
    zIndex: 1,
});

const azsLayer = new VectorLayer({
    style: defaultPointStyle,
    zIndex: 2,
});

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        roadLayer,
        azsLayer,
    ],
    target: "map",
    view: new View({
        center: fromLonLat([43.89073, 43.60654]),
        zoom: 12
    })
});



const info = document.getElementById("info");
info.style.pointerEvents = "none";
const tooltip = new bootstrap.Tooltip(info, {
    animation: false,
    customClass: "pe-none",
    offset: [0, 5],
    title: "-",
    trigger: "manual",
});

const featureOverlay = new VectorLayer({
    map: map,
    source: new VectorSource(),
    style: highlightLineStringStyle,
    zIndex: 0,
});

let currentFeature;
const displayFeatureInfo = function(pixel, target) {
    const feature = target.closest(".ol-control") ?
        undefined :
        map.forEachFeatureAtPixel(pixel, function(feature) {
            return feature;
        });
    if (feature) {
        info.style.left = pixel[0] + "px";
        info.style.top = pixel[1] + "px";
        if (feature !== currentFeature) {
            let output = feature.get("name");
            let km = feature.get("length_km");
            if (km) {
                output = output + " (" + feature.get("length_km") + " км)";
            }
            tooltip.setContent({
                ".tooltip-inner": output
            });
        }
        if (currentFeature) {
            tooltip.update();
            featureOverlay.getSource().removeFeature(currentFeature);
            featureOverlay.getSource().addFeature(feature);
        } else {
            tooltip.show();
        featureOverlay.getSource().addFeature(feature);
        }
    } else {
        tooltip.hide();
        featureOverlay.getSource().removeFeature(currentFeature);
    }
    currentFeature = feature;
};

map.on("pointermove", function(evt) {
    if (evt.dragging) {
        tooltip.hide();
        currentFeature = undefined;
        return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel, evt.originalEvent.target);
});

map.on("click", function(evt) {
    displayFeatureInfo(evt.pixel, evt.originalEvent.target);
});

map.getTargetElement().addEventListener("pointerleave", function() {
    tooltip.hide();
    currentFeature = undefined;
});

let currentAzsSource;
const displayAzsInfo = function(pixel, target) {
    const feature = target.closest(".ol-control") ?
        undefined :
        map.forEachFeatureAtPixel(pixel, function(feature) {
            return feature;
        });
    if (feature) {
        if (feature !== currentAzsSource) {
            let roadCode = feature.get("road_code");
            featureOverlay.getSource().removeFeature(currentFeature);
            if (roadCode) {
                currentAzsSource = new VectorSource({
                    format: new GeoJSON(),
                    url: stationUrlStart + roadCode + stationUrlEnd,
                });
                azsLayer.setSource(currentAzsSource);
            }
        }
    } else {
        azsLayer.setSource(null);
    }
    currentAzsSource = feature;
};

map.on("singleclick", function(evt) {
    const pixel = map.getEventPixel(evt.originalEvent);
    displayAzsInfo(pixel, evt.originalEvent.target);
});
