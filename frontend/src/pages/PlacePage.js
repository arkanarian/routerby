import { Box, Button, Container, Flex, HStack, Heading, Icon, Image, SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GiGreekTemple } from "react-icons/gi";
import { IoMdStar } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { TiLocation } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";
import { authStore } from "../store/authStore";
import { placeStore } from "../store/placeStore";

const PlacePage = observer(() => {
	const [rerender, setRerender] = useState(false) // TODO: bad, чтобы обновлялось при добавлении в корзину, вынести список в profileStore и на него useEffect
  const { alias } = useParams()

  useEffect(() => {
    const fetchPlace = async () => authStore.isLogged && await placeStore.getPlaceByAlias(alias)
    fetchPlace()
  }, [authStore.isLogged, rerender])

  const toast = useToast();
  const navigate = useNavigate();
	
	const onAddToRoute = (e, id) => {
		e.preventDefault()
		placeStore.addOrRemoveFromRoute(id)
		setRerender(!rerender)
	}

	return (
		<>
      {Object.keys(placeStore.onePlace).length !== 0 && (
        <>
          <Container maxW={'100%'}>
            <Box h={430} w={'100%'} bgImage={placeStore.onePlace.imageURLs[0]} bgSize='cover' bgPosition={'center'}>
              <Flex alignItems={'center'} justifyContent={'center'} h={'100%'} w={'100%'} bgGradient={'linear(to-r, rgba(0,0,0,0.4), rgba(0,0,0,0.4))'} borderRadius={10} p={5}>
                <Heading size={'xl'} color={'white'} as={'b'} textAlign={'center'}>
                  {placeStore.onePlace.name}
                </Heading>
              </Flex>
            </Box>
          </Container>

          <Container maxW={'3xl'} mt={5}>
            <Flex w={'100%'} direction='column' gap={3} alignItems={'center'}>
              <Button onClick={(event) => onAddToRoute(event, placeStore.onePlace.id)} colorScheme="purple">{placeStore.isInRouteCart(placeStore.onePlace.id) ? 'Remove from route' : 'Add to route'}</Button>
              <HStack>
                <Flex alignItems='center' gap={2}>
                  <Icon color={'purple.600'} as={TiLocation} w={5} h={5}/>
                  <Text fontSize='sm' as='b'>г. {placeStore.onePlace.city.name}, {placeStore.onePlace.district.name} обл.</Text>
                </Flex>
                <Flex alignItems='center' gap={2}>
                  <Icon color={'purple.600'} as={GiGreekTemple} w={5} h={5}/>
                  <Text fontSize='sm' as='b'>{placeStore.onePlace.place_type.name}</Text>
                </Flex>
              </HStack>

              <SimpleGrid columns={3} gap={8}>
                <Flex alignItems='center' gap={2}>
                  <Icon as={IoMdStar} w={5} h={5}/>
                  <Text fontSize='sm' as='b'>{placeStore.onePlace.rating}</Text>
                </Flex>
                <Flex alignItems='center' gap={2}>
                  <Icon as={placeStore.onePlace.is_self_liked ? FaHeart : FaRegHeart} w={4} h={4}/>
                  <Text fontSize='sm' as='b'>{placeStore.onePlace.liked_amount}</Text>
                </Flex>
                <Flex alignItems='center' gap={2}>
                  <Icon as={IoEye} w={4} h={4}/>
                  <Text fontSize='sm' as='b'>{placeStore.onePlace.views_amount}</Text>
                </Flex>
              </SimpleGrid>

              <Text fontSize='lg' textAlign={'justify'} color={'gray.800'}>
                {placeStore.onePlace.description}
              </Text>
              <Image borderRadius={7} src={placeStore.onePlace.imageURLs[1]} alt={placeStore.onePlace.name} />
              <Image borderRadius={7} src={placeStore.onePlace.imageURLs[2]} alt={placeStore.onePlace.name} />
            </Flex>
          </Container>
        </>
      )}
		</>
  )
})

export default PlacePage;