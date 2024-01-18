import { Button, Container, Flex, HStack, Heading, Icon, Link, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Portal, Spacer, Stack, VStack, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { TiLocation } from "react-icons/ti";
import { Link as RLink, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/AuthPage';
import CreatePlacePage from './pages/CreatePlacePage';
import HomePage2 from './pages/HomePage2';
import PlacePage from './pages/PlacePage';
import PlacesPage from './pages/PlacesPage';
import RouteCartPage from './pages/RouteCartPage';
import { authStore } from './store/authStore';
import { transactionStore } from "./store/transactionStore";


const App = observer(() => {

  const store = transactionStore;
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => await authStore.initAuth();
    initAuth();
  }, [])

  const onLogout = async () => {
    const success = await authStore.logout();
    if (success) {
      toast({ title: 'Logged out', status: 'success' });
    }
  }

  return (
    <div className="App">
      {/* <Router> */}
        <Container maxW='8xl' minH='100vh'>
          <VStack>
            <Flex as={'nav'} w={'100%'} py={'3'} alignItems={'center'}>
              <Flex justify={'baseline'}>
                <Icon color='purple' as={TiLocation} w={6} h={6} />
                <Heading size={'md'} color="purple">RouterBy</Heading>
              </Flex>
              <Spacer/>
              {authStore.isLogged && (
              <Stack direction='row' spacing={4} align='center'>
                <Button colorScheme='purple' variant='ghost' onClick={() => navigate('/places')}>
                  All places
                </Button>
                <Button colorScheme='purple' variant='ghost' onClick={() => navigate('/profile/my_route')}>
                  My route
                </Button>
              </Stack>
              )}
              <Spacer/>
              <HStack>
                {authStore.isLogged ? (
                  <>
                    <Popover placement='bottom-start'>
                      {!authStore.isAdmin ? (
                        <PopoverTrigger>
                          <Link>
                            {authStore.user?.username}
                          </Link>
                        </PopoverTrigger>
                      ) : (
                        <Link>
                          {authStore.user?.username}
                        </Link>
                      )}
                      <Portal>
                        <PopoverContent borderRadius={15}>
                          <PopoverHeader fontWeight={'bold'}>{authStore.user?.username}</PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            <VStack alignItems='left'>
                              {!authStore.isAdmin && (
                                <>
                                  <Button h='30px' colorScheme='orange'>
                                    <Flex>
                                      Hello
                                    </Flex>
                                  </Button>
                                </>
                              )}
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                    <Link onClick={onLogout}>
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link>
                    <RLink to={'/auth'}>Authenticate</RLink>
                  </Link>
                )}
              </HStack>
            </Flex>
          </VStack>
            <Routes>
              <Route
                exact
                path='/auth'
                Component={AuthPage}
              />
              <Route
                path='/places/create'
                Component={CreatePlacePage}
              />
              <Route
                path='/places'
                Component={PlacesPage}
              />
              <Route
                path='/places/:alias'
                Component={PlacePage}
              />
              <Route
                path='/profile/my_route'
                Component={RouteCartPage}
              />
              <Route
                path='/moneyhoney'
                Component={HomePage2}
              />
            </Routes>
        </Container>
      {/* </Router> */}
    </div>
  );
})

export default App;
