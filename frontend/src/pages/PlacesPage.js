import { Button, Center, Container, Flex, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlaceComponent from "../components/Place";
import { authStore } from "../store/authStore";
import { placeStore } from "../store/placeStore";

const PlacesPage = observer(() => {
	const [rerender, setRerender] = useState(false) // TODO: bad, чтобы обновлялось при добавлении в корзину, вынести список в profileStore и на него useEffect

  useEffect(() => {
    const fetchPlaces = async () => authStore.isLogged && await placeStore.getPlaces()
    fetchPlaces()
  }, [authStore.isLogged, rerender])

  const toast = useToast();
  const navigate = useNavigate();

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
			<Container maxW='3xl'>
				<Center>
				<Flex w={'100%'} direction='column' gap={3}>
					{authStore.isAdmin && (
						<Button onClick={() => navigate('/create')} colorScheme="purple">Create place</Button>
					)}
          {placeStore.places.map(place => (
						PlaceComponent(place, onAddToRoute, onOpenPlace)
					))}
				</Flex>
				</Center>
			</Container>
		</>
  )
})

export default PlacesPage;