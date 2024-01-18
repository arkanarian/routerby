// import L from "leaflet";

import { createControlComponent } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
  const instance = L.Routing.control({
    waypoints: props.waypoints,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    // router: L.Routing.mapbox('pk.eyJ1IjoibGRqa2ZzbGRmaiIsImEiOiJjbHIyNDEwNzMwcWQzMmtteXZidHJmYzJ2In0.qZhUrBdlDTghmDUutzJjQQ'), // TODO: вынести в .env
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    autoRoute: true, // If true, route will automatically be calculated every time waypoints change, otherwise route() has to be called by the app
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
