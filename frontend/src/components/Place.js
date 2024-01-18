import { Box, Button, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GiGreekTemple } from "react-icons/gi";
import { IoMdStar } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { TiLocation } from "react-icons/ti";
import { placeStore } from "../store/placeStore";

const PlaceComponent = (place, onAddToRoute, onOpenPlace) => {
  return (
						<Box h={350} w={'100%'} borderRadius={10} bgImage={place.imageURL} bgSize='cover' bgPosition={'center'}>
							<Box h={'100%'} w={'100%'} bgGradient={'linear(to-r, rgba(0,0,0,0), rgba(0,0,0,0.7))'} borderRadius={10} p={5}>
								<Flex color={'white'}>
									<Box flex={7}></Box>
									<Flex alignItems={'flex-start'} flex={4} flexDirection={'column'} gap={2}>
										<Text fontSize='lg' fontWeight='bold'>
											{place.name}
										</Text>
										<Text align={'left'} fontSize='sm' color='gray.300'>
											{place.description.substring(0, 100) + '...'}
										</Text>
										<Flex alignItems='center' gap={2}>
											<Icon as={TiLocation} w={5} h={5}/>
											<Text fontSize='sm' as='b'>г. {place.city.name}, {place.district.name} обл.</Text>
										</Flex>
										<Flex alignItems='center' gap={2}>
											<Icon as={GiGreekTemple} w={5} h={5}/>
											<Text fontSize='sm' as='b'>{place.place_type.name}</Text>
										</Flex>
										<SimpleGrid columns={3} gap={8}>
											<Flex alignItems='center' gap={2}>
												<Icon as={IoMdStar} w={5} h={5}/>
												<Text fontSize='sm' as='b'>{place.rating}</Text>
											</Flex>
											<Flex alignItems='center' gap={2}>
												{/* TODO: red color is liked */}
												{/* TODO: action for liking */}
												<Icon as={place.is_self_liked ? FaHeart : FaRegHeart} w={4} h={4}/>
												<Text fontSize='sm' as='b'>{place.liked_amount}</Text>
											</Flex>
											<Flex alignItems='center' gap={2}>
												{/* TODO: if viewd -- differenc color (blue) */}
												<Icon as={IoEye} w={4} h={4}/>
												<Text fontSize='sm' as='b'>{place.views_amount}</Text>
											</Flex>
										</SimpleGrid>
										<Button onClick={(event) => onAddToRoute(event, place.id)} colorScheme="purple" color='purple.200' variant='outline'>{placeStore.isInRouteCart(place.id) ? 'Remove from route' : 'Add to route'}</Button>
										<Button onClick={(event) => onOpenPlace(event, place.alias)} colorScheme="purple" color='purple.200' variant='outline'>Open</Button>
									</Flex>
								</Flex>
							</Box>
						</Box>
  )
}

export default PlaceComponent;