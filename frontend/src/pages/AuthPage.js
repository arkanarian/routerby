import { Button, Center, Container, Flex, FormControl, FormErrorMessage, FormHelperText, Input, InputGroup, InputRightElement, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";


const AuthPage = observer(() => {

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [regErr, setRegErr] = useState('');
  const [show, setShow] = useState(false)
  const [show_confirm, setShowConfirm] = useState(false)

  const handleClickShowPassConfirm = () => setShowConfirm(!show_confirm)

  const handleClickShowPass = () => setShow(!show)

  const toast = useToast();
  const navigate = useNavigate();

  const onLoginResponse = (result) => {
    setIsLoginLoading(false);
    if (result.err) {
      setLoginErr(result.err);
      return;
    }

    setLoginErr('');
    toast({ title: 'Login succeeded!', status: 'success' });
    navigate('/places');
  }

  const onRegisterResponse = async (result) => {
    setIsRegisterLoading(false);
    if (result.err) {
      setRegErr(result.err);
      return;
    }
    setRegErr('');
    toast({ title: 'You registered!', status: 'success' });
    navigate("/auth")
  }

  const onLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target)
    const data = {
      username: form.get('email'),
      password: form.get('password'),
      scope: '',
      grant_type: '',
      client_id: '',
      client_secret: ''
    }

    setLoginEmail(data.username);
    setLoginPassword(data.password);
    setIsLoginLoading(true);
    await authStore.login(data, onLoginResponse);
  }

  const onRegister = async (e) => {
    e.preventDefault();
    console.log("hello")
    const form = new FormData(e.target)
    const data = {
      email: form.get('email'),
      username: form.get('username'),
      password: form.get('password')
    }

    if (form.get('password') !== form.get('confirm_password')) {
      setRegErr('Passwords are not equal')
      return;
    }

    setRegisterEmail(data.email);
    setRegisterPassword(data.password);
    setIsRegisterLoading(true);
    await authStore.register(data, onRegisterResponse);
  }


  return (
    <Container maxW={'4xl'}>
      <Tabs variant='soft-rounded' colorScheme='orange'>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Register</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Center>
              <Flex w={'100%'}>
                <form onSubmit={onLogin}>
                  <FormControl isInvalid={loginErr}>
                    <FormHelperText>Email:</FormHelperText>
                    <Input colorScheme="purple" type='email' name='email' placeholder="Email" />
                    <FormHelperText>Password:</FormHelperText>

                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        name='password'
                        type={show ? 'text' : 'password'}
                        min={8}
                        placeholder='Enter password'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClickShowPass}>
                        {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{loginErr}</FormErrorMessage>
                  </FormControl>
                  <Button colorScheme="purple" type='submit' my={5} isLoading={isLoginLoading}>Login</Button>
                </form>
              </Flex>
            </Center>
          </TabPanel>
          <TabPanel>
            <Center>
              <Flex w={'100%'}>
                <form onSubmit={onRegister}>
                  <FormControl isInvalid={regErr}>
                    <FormHelperText>Email:</FormHelperText>
                    <Input type='email' name='email' placeholder="Email" borderColor={'gray.200'} />
                    <FormHelperText>Username:</FormHelperText>
                    <Input type='username' name='username' placeholder="Username" borderColor={'gray.200'} />
                    <FormHelperText>Password:</FormHelperText>
                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        name='password'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClickShowPass}>
                        {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {/* <Input type='password' name='password' placeholder="Password" borderColor={'gray.200'} /> */}
                    <FormHelperText>Repeat password:</FormHelperText>
                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        name='confirm_password'
                        type={show_confirm ? 'text' : 'password'}
                        placeholder='Repeat password'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClickShowPassConfirm}>
                        {show_confirm ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {/* <Input type='password' name='confirm_password' placeholder="Repeat password" borderColor={'gray.200'} /> */}
                    <FormErrorMessage>{regErr}</FormErrorMessage>
                  </FormControl>
                  <Button type='submit' my={5} isLoading={isRegisterLoading}>Register</Button>
                </form>
              </Flex>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
});

export default AuthPage;