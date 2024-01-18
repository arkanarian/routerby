import { Button, Center, Container, Flex, FormControl, FormErrorMessage, FormHelperText, Heading, Icon, Image, Input, Select, Spacer, Text, Textarea, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import { placeStore } from "../store/placeStore";

const CreatePlacePage = observer(() => {
	const [createErr, setCreateErr] = useState('');
	const [isCreateLoading, setIsCreateLoading] = useState(false);
	const [name, setName] = useState('');
	const [images, setImages] = useState({});

  // useEffect(() => {
  //   const fetchPlaces = async () => authStore.isLogged && await placeStore.getPlaces()
  //   fetchPlaces()
  // }, [])

  useEffect(() => {
    const fetchInitialTypes = async () => authStore.isLogged && await placeStore.getInitialCitiesDistrictsPlaceTypes()
    fetchInitialTypes()
  }, [authStore.isLogged])

	// free memory when ever this component is unmounted
	useEffect(() => {
		console.log(images)
		return () => {
			for (let objectUrl of Object.keys(images)) {
				URL.revokeObjectURL(objectUrl)
			}
		}
		// TODO: проверить revoke
	}, [])

  const formRef = useRef();
	
  const toast = useToast();
  const navigate = useNavigate();

  const getFormData = () => {
    const form = new FormData(formRef.current);
		// TODO: upload image
		// по сути просто передавать FormData в body
		const imgs_names = Object.keys(images).map(function(key){
				return images[key].name;
		})
		// console.log(imgs_names)
		// console.log(images)
    const data = {
			name: form.get('name'),
			description: form.get('description'),
			city: form.get('city'),
			district: form.get('district'),
			place_type: form.get('place_type'),
			address: form.get('address'),
			longitude: form.get('longitude'),
			latitude: form.get('latitude'),
			// images: ["default1.png", "default2.png", "default3.png"]
			images: imgs_names,
    }
    return data;
  }

	const updateName = () => {
		const data = getFormData();
		setName(data.name);
	}

	const onCreate = async (e) => {
		e.preventDefault();
		const data = getFormData();
		console.log(data)
		// setIsCreateLoading(true) // TODO: раскомментить потом
		const imgs = Object.keys(images).map(function(key){
				return images[key];
		})
		
		console.log(imgs)

		const res = await placeStore.createPlace(data, imgs);
		if (res.err) {
			setCreateErr(res.err)
			setIsCreateLoading(false)
			return
		}

		setCreateErr('')
		setIsCreateLoading(false)
    toast({ title: `Place ${data.name} created!`, status: 'success' });
    // navigate('/');
	}

	const onUploadImages = (e) => {
		console.log(images)
		const fileList = e.target.files;
		for (let i = 0; i < fileList.length; i++) {
			images[URL.createObjectURL(e.target.files[i])] = fileList[i];
			// images.push(URL.createObjectURL(e.target.files[i]));
		}
		setImages(images)
	}

	return (
		<div>
			<Container maxW='2xl'>
				<Center>
				<Flex w={'100%'} direction='column'>
					<Text size={'sm'} mb={3}>Создание места</Text>
					<Heading size={'md'}>{name}</Heading>
					<form onSubmit={onCreate} ref={formRef} onChange={updateName}>
					<FormControl isInvalid={createErr}>
						<FormHelperText align={'left'}>Название:</FormHelperText>
						<Input type='text' name='name' placeholder="Название" />
						<FormHelperText align={'left'}>Описание:</FormHelperText>
						<Textarea height={'150'} name='description' placeholder="Описание" defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat lectus ut magna posuere, ac scelerisque urna accumsan. Suspendisse potenti. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus luctus accumsan porta. Proin fermentum libero in augue dapibus commodo. Nam posuere libero nec felis volutpat, ut mollis velit ullamcorper. Morbi a cursus velit. In scelerisque purus a lorem molestie, sed congue sapien sagittis. Phasellus ut massa sodales, pretium sapien in, luctus quam. Duis blandit neque eu risus rhoncus tincidunt. Maecenas quis eros in enim semper tempus sed at lectus. Vivamus ante tortor, pulvinar non lacus non, tincidunt consequat ligula.' />
						<FormHelperText align={'left'}>Город:</FormHelperText>
						<Select placeholder='' name='city'>
							{placeStore.cities.map((city) => (
								<option value={city.alias}>{city.name}</option>
							))}
						</Select>
						<FormHelperText align={'left'}>Область:</FormHelperText>
						<Select placeholder='' name='district'>
							{placeStore.districts.map((district) => (
								<option value={district.alias}>{district.name}</option>
							))}
						</Select>
						<FormHelperText align={'left'}>Тип:</FormHelperText>
						<Select placeholder='' name='place_type'>
							{placeStore.place_types.map((place_type) => (
								<option value={place_type.alias}>{place_type.name}</option>
							))}
						</Select>
						<FormHelperText align={'left'}>Адрес:</FormHelperText>
						<Input type='text' name='address' placeholder="Адрес" defaultValue='ул. Главная 23' />
						<FormHelperText align={'left'}>Координаты:</FormHelperText>
						<Flex gap='2'>
							<Input type='number' step="0.000001" name='latitude' placeholder="Долгота" defaultValue={12} />
							<Spacer />
							<Input type='number' step="0.000001" name='longitude' placeholder="Широта" defaultValue={13} />
						</Flex>
						<FormHelperText align={'left'}>Изображения:</FormHelperText>
						<Input type='file' name='images' multiple onChange={onUploadImages}></Input>
						<Flex gap={3} wrap={'wrap'}>
							{Object.keys(images).forEach((image_src) => (
								<div position='relative'>
									<Icon as={MdDelete} w={6} h={6} color='red.500' cursor='pointer'/>
									{/* <Icon as={MdDelete} w={6} h={6} pos='absolute' top='0' left='0' /> */}
									<Image src={image_src} height='150' width='150' rounded={5} />
								</div>
							))}
						</Flex>
						<FormErrorMessage>{createErr}</FormErrorMessage>
					</FormControl>
					<Button colorScheme="purple" type='submit' my={5} isLoading={isCreateLoading}>Create</Button>
					</form>
				</Flex>
				</Center>
			</Container>
		</div>
	)
})

export default CreatePlacePage;