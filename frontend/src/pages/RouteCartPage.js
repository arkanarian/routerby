import { Button, Center, Container, Flex, ListItem, OrderedList, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
// import Routing from "../helpers/RoutingMachine";
// import L from "leaflet";

import "leaflet-routing-machine";
import { toJS } from "mobx";
import { useEffect, useRef, useState } from "react";
import PlaceComponent from "../components/Place";
import RoutingMachine from "../helpers/RoutingMachine";
import { authStore } from "../store/authStore";
import { placeStore } from "../store/placeStore";
import { profileStore } from "../store/profileStore";

const RouteCartPage = observer(() => {
  const toast = useToast();
  const navigate = useNavigate();
  const rMachine = useRef()

	const [rerender, setRerender] = useState(false) // TODO: bad, чтобы обновлялось при добавлении в корзину, вынести список в profileStore и на него useEffect

  useEffect(() => {
    const fetchPlaces = async () => authStore.isLogged && await profileStore.getPlaces()
    fetchPlaces()
    console.log('Hello')
  }, [authStore.isLogged, rerender])

  useEffect(() => {
    onOptimizeRoute()
  }, [authStore.isLogged, profileStore.unoptimizedRoute])

  const mapStyle = {
    height: '75vh',
  };

  const [waypoints, setWaypoints] = useState(toJS(profileStore.unoptimizedRoute))

  const onOptimizeRoute = async () => {
    if (rMachine.current && profileStore.unoptimizedRoute.length > 0) {
      await profileStore.doOptimizeRoute()
      console.log(waypoints)
      // setWaypoints([
      //   L.latLng(53.905040, 27.510769),
      //   L.latLng(54.134021, 27.281788),
      //   L.latLng(53.957131, 27.428629),
      //   L.latLng(53.996872, 27.275554),
      // ])
      // for (const location of toJS(profileStore.optimizedRoute)) {
      //   console.log(location)
      // }
      const optimizedRoute = toJS(profileStore.optimizedRoute)
      rMachine.current.setWaypoints(optimizedRoute)
      setWaypoints(optimizedRoute)
    }
  }

	const onOpenPlace = (e, alias) => {
		e.preventDefault()
		navigate(`/places/${alias}`)
	}
	
	const onAddToRoute = (e, id) => {
		e.preventDefault()
		placeStore.addOrRemoveFromRoute(id)
		setRerender(!rerender)
	}


	return (
		<>
			<Container maxW={'8xl'}>
				<Center>
				<Flex w={'100%'} direction='column' gap={4}>
          <MapContainer center={[53.875115, 27.564911]} zoom={7} scrollWheelZoom={false} style={mapStyle}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Marker position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker> */}
            <RoutingMachine ref={rMachine} waypoints={waypoints} />
          </MapContainer>
          <Button colorScheme="purple" onClick={onOptimizeRoute}>Optimize</Button>
          <OrderedList>
            {profileStore.places.map(place => (
                <ListItem mb={3}>
                  {PlaceComponent(place, onAddToRoute, onOpenPlace)}
                </ListItem>
              ))}
          </OrderedList>
				</Flex>
				</Center>
			</Container>

    </>
  )
})

export default RouteCartPage;