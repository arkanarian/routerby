import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Badge, Button, Center, Container, Divider, FormControl, FormErrorMessage, HStack, Heading, Icon, Input, List, ListItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Progress, Select, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { CiCreditCard1 } from 'react-icons/ci';
import { useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import { transactionStore } from "../store/transactionStore";



const getCurrencyAmount = (amount) => {
  return authStore.currency_coef == 0 ? '' : (amount*authStore.currency_coef).toFixed(2)
}

const TransactionSection = observer(() => {

    const [createErr, setCreateErr] = useState('');

    useEffect(() => {
      const fetchTransactions = async () => authStore.isLogged && await transactionStore.getTransactions(authStore.isAdmin)
      fetchTransactions()
    }, [])

    const onSubmitCreate = async (e) => {
      e.preventDefault();

      const form = new FormData(e.target)
      const data = {
        card_to_number: form.get('card_number'),
        amount: form.get('amount')
      }

      const res = await transactionStore.createTransaction(data);
      if (res.err) {
        setCreateErr(res.err);
        return;
      }
      setCreateErr('')
    }

    const onApproveTransaction = async (trId) => {
      await transactionStore.approveTransaction(trId);
    }

    const getStatus = (tr) => {
      const success = tr.status === 'SUCCESS';
      const confirmed = tr.status === 'CONFIRMED';
      const closed = tr.status === 'CLOSED'
      const declined = tr.status === 'DECLINED'
      const failed = tr.status === 'FAILED'
      if (success) {
        return <Badge width={'80px'} py={'2px'} colorScheme="green">Success</Badge>
      }
      else if (confirmed) {
        return <Badge width={'80px'} py={'2px'} colorScheme="green">Confirmed</Badge>
      }
      else if (closed) {
        return <Badge width={'80px'} py={'2px'} colorScheme="gray">Closed</Badge>
      }
      else if (declined) {
        return <Badge width={'80px'} py={'2px'} colorScheme="red">Declined</Badge>
      }
      else if (failed) {
        return <Badge width={'80px'} py={'2px'} colorScheme="red">Failed</Badge>
      }

      if (!authStore.isAdmin) {
        // return <RepeatClockIcon color='yellow.400' />;
        return <Badge width={'80px'} py={'2px'} colorScheme="yellow">Pending</Badge>
      }

      return <AddIcon cursor='pointer' onClick={() => onApproveTransaction(tr.id)} />
    }

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()} at ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }

    return (
      <>
        <List>
          {transactionStore.transactions.map(tr => (
            <ListItem borderWidth={1} borderColor={tr.status === 'SUCCESS' ? 'green.400' : 'yellow.400'} p={4} my={5} borderRadius={5}>
              <VStack align='left' px={5} borderRadius={5}>
                <HStack justifyContent={'space-between'}>
                  <Text align='left' fontSize='sm' color='gray.500'>Transaction ID: {tr.id}</Text>
                  {getStatus(tr)}
                </HStack>
                <HStack>
                  <Text as='b'>{tr.card_from.card_number}</Text>
                  <Spacer />
                  <ArrowForwardIcon  />
                  <Spacer />
                  <Text as='b'>{tr.card_to.card_number}</Text>
                </HStack>
                <Spacer />
                {!authStore.isAdmin ? (
                  <Text align={'left'} color={tr.is_outcoming == true ? 'red.400' : 'green.300'}>{tr.is_outcoming == true ? "-" : "+"} {getCurrencyAmount(tr.amount)} {authStore.currency_symbol}</Text>
                ) : (
                  <Text align={'left'}>{getCurrencyAmount(tr.amount)} {authStore.currency_symbol}</Text>
                )}
                <Spacer />
                <Text align={'left'}>{formatDate(tr.date_opened)}</Text>
              </VStack>
            </ListItem>
          ))}
        </List>
        {!authStore.isAdmin && (
          <form onSubmit={onSubmitCreate}>
            <FormControl mt={2} isInvalid={createErr} p={3} borderRadius={10}>
              <HStack>
                <Input name="card_number" placeholder="Card number" />
                <Spacer />
                <Input type="number" min="5.0" max="30000" name="amount" placeholder="Amount" />
              </HStack>
              <FormErrorMessage>{createErr}</FormErrorMessage>
              <Button colorScheme="purple" mt={5} type="submit">Transfer</Button>
            </FormControl>
          </form>
        )}
      </>
    );

})

const CreditSection = observer(() => {

  const [createErr, setCreateErr] = useState('');
  const [payErr, setPayErr] = useState('');
  const [amountPerMonth, setAmountPerMonth] = useState(0);
  const formRef = useRef();

  
  useEffect(() => {
    const fetchCredits = async () => authStore.isLogged && await transactionStore.getCredits()
    fetchCredits()
  }, [])

  const getFormData = () => {
    const form = new FormData(formRef.current);
    const data = {
      total_money: form.get('amount'),
      period_months: form.get('months'),
      percent: 12.0,
      card_id: authStore.user?.card?.id,
      credit_type: form.get('credit_type'),
      money_requested: form.get('amount'),
    }
    return data;
  }

  const calculatePerMonth = (amount, months) => Number(amount * 1.12 / months).toFixed(4)

  const updateAmountPerMonth = () => {
    const data = getFormData();
    
    if (data.months) {
      setAmountPerMonth(calculatePerMonth(data.amount, data.months));
    }
  }

  const onSubmitCreate = async (e) => {
    e.preventDefault();

    const data = getFormData();

    const res = await transactionStore.createCredit(data);
    if (res.err) {
      setCreateErr(res.err);
      return;
    }
    setCreateErr('')
  }

  const onSubmitPay = async (e, cr) => {
    e.preventDefault();

    const form = new FormData(e.target)
    const data = {
      amount: form.get('amount') / authStore.currency_coef,
    }
    console.log(data.amount)

    const res = await transactionStore.payCredit(data, cr.id);
    if (res.err) {
      setPayErr(res.err);
      return;
    }
    setPayErr('')
  }

  const onApproveCredit = async (crId) => {
    await transactionStore.approveCredit(crId);
  }

  const getStatus = (cr) => {
    const executed = cr.status === 'CONFIRMED';
    const closed = cr.status === 'CLOSED'
    const declined = cr.status === 'DECLINED'
    if (executed) {
      return <Badge width={'80px'} py={'2px'} colorScheme="green">Confirmed</Badge>
    }
    else if (closed) {
      return <Badge width={'80px'} py={'2px'} colorScheme="gray">Closed</Badge>
    }
    else if (declined) {
      return <Badge width={'80px'} py={'2px'} colorScheme="red">Declined</Badge>
    }

    if (!authStore.isAdmin) {
      // return <RepeatClockIcon color='yellow.400' />;
      return <Badge width={'80px'} py={'2px'} colorScheme="yellow">Pending</Badge>
    }

    return <AddIcon cursor='pointer' onClick={() => onApproveCredit(cr.id)} />
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`
  }

  const getCreditTypeBadge = (cr) => {
    const cr_type = cr.credit_type;
    console.log(cr_type)
    if (cr_type === 'ANNUITY') {
      return <Badge width={'100px'} py={'2px'} colorScheme="gray">Annuity</Badge>
    }
    else if (cr_type === 'DIFFERENTIAL') {
      return <Badge width={'100px'} py={'2px'} colorScheme="gray">Differential</Badge>
    }
  }

  return (
    <>
      <List>
            {transactionStore.credits.map(cr => console.log(JSON.parse(JSON.stringify(cr))) || (
              <ListItem borderWidth={1} borderColor={cr.status === 'CONFIRMED' ? 'green.400' : 'yellow.400'} p={4} my={5} borderRadius={5}>
                <VStack alignItems={'left'} px={5} borderRadius={5}>
                  <HStack justifyContent={'space-between'}>
                    <Text align='left' fontSize='sm' color='gray.500'>Credit ID: {cr.id}</Text>
                    {getStatus(cr)}
                  </HStack>
                  <Spacer />
                  <Text color={'green.300'}>{getCurrencyAmount(cr.payed_money)} {authStore.currency_symbol} / {getCurrencyAmount(cr.total_money)} {authStore.currency_symbol}</Text>
                  <Spacer />
                  <Progress colorScheme='green' value={cr.payed_money/cr.total_money*100} />
                  {getCreditTypeBadge(cr)}
                  {authStore.isAdmin && (
                    <Text align={'left'} as={"b"}>{cr.card_number}</Text>
                  )}
                  <Text align={'left'}>{formatDate(cr.date_start)} started</Text>
                  <Text align={'left'}>{formatDate(cr.date_end)} ends</Text>
                  <Text align={'left'}>{cr.period_months} months</Text>

                  {cr.status === "CONFIRMED" && (
                    <>
                      <Popover>
                        <PopoverTrigger>
                          {/* <Text align={'left'} color={'blue.200'} cursor='pointer' textDecoration={'underline'}>Credit history</Text> */}
                          <Button align={'center'} width={140}>Credit history</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Credit History</PopoverHeader>
                          <PopoverBody>
                            <VStack>
                              {cr.credit_history.map(h => (
                                <>
                                  <HStack justifyContent={'space-between'}>
                                    <Text color={'green.300'}>{getCurrencyAmount(h.amount)} {authStore.currency_symbol}</Text>
                                    <Text>{formatDate(h.date_performed)}</Text>
                                  </HStack>
                                  <Divider borderColor='gray.500' orientation='horizontal' />
                                </>
                              ))}
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                      {!authStore.isAdmin && (
                        <>
                        <form onSubmit={(e) => onSubmitPay(e, cr)}>
                          <FormControl mt={2} isInvalid={payErr} p={3} borderRadius={10}>
                          <Text>Requested for current month: {getCurrencyAmount(cr.requested_money)} {authStore.currency_symbol}</Text>
                          <HStack alignItems={'baseline'}>
                            <Input type="number" min="0" max={cr.total_money - cr.payed_money} name="amount" placeholder="Amount" />
                            <Button mt={5} colorScheme="purple" type="submit">Pay</Button>
                          </HStack>
                          <FormErrorMessage>{payErr}</FormErrorMessage>
                          </FormControl>
                        </form>
                        </>
                      )}
                    </>
                  )}
                </VStack>
              </ListItem>
            ))}
      </List>
      {!authStore.isAdmin && (
        <form onSubmit={onSubmitCreate} ref={formRef} onChange={updateAmountPerMonth}>
          <FormControl mt={2} isInvalid={createErr} p={3} borderRadius={10}>
            <VStack alignItems={'left'} px={10}>
              <Text>Request a credit with sum</Text>
              <Input type="number" min="200.0" name="amount" placeholder="Amount" />
              <Text>via 12% per month for</Text>
              <Input type="number" min="1" max="36" name="months" placeholder="Months" />
              <Text>will be {amountPerMonth} {authStore.currency_symbol} per month.</Text>
              <Select name="credit_type">
                <option value='ANNUITY'>ANNUITY</option>
                <option value='DIFFERENTIAL'>DIFFERENTIAL</option>
              </Select>
              <FormErrorMessage>{createErr}</FormErrorMessage>
              <Button mt={5} colorScheme="purple" type="submit">Request a credit</Button>
            </VStack>
          </FormControl>
        </form>
      )}
    </>
  );

})


const HomePage2 = observer(() => {

  const store = transactionStore;
  const [currency, setCurrency] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authStore.isLogged) {
      setCurrency(authStore.user?.card?.currency)
    }
    // const setCurrencyFunc = async () => authStore.isLogged && setCurrency(authStore.user?.card?.currency)
    // setCurrencyFunc()
  }, [])

  if (!authStore.isLogged) {
    return (
      <Container h={'100vh'}>
        <Center h={'80%'}>
          <Heading size={'md'}>Login for using system.</Heading>
        </Center>
      </Container>
    )
  }

  const onSelectCurrency = (event) => {
    authStore.currency = event.target.value;
    console.log(authStore.currency)
    console.log(currency)
    // console.log(currency)
    // setCurrency(event.target.value);
    // console.log(event.target.value)
  }

  const updateCurrency = async () => {
    const data = {
      currency: authStore.currency
    }
    console.log(data)
    await authStore.updateCurrency(data);
    // navigate('/')
    window.location.reload();
  }

  return (
    <Container maxW='2xl'>
      <VStack alignItems={'left'} my={3}>
        {!authStore.isAdmin && (
        <>
        <VStack px={5} py={2} borderRadius={20} borderWidth={1} borderColor='gray.500' alignItems={'left'} my={3}>
          <Icon as={CiCreditCard1} w={10} h={10} />
          {/* <Heading size={'md'} fontWeight={'regular'}>Your card:</Heading> */}
          <Heading size={'md'} fontWeight={'bold'} align='left'>
            {authStore.user?.card?.card_number}
          </Heading>
          <Spacer/>
          <HStack alignItems={'baseline'} >
            <Heading size={'md'} fontWeight={'bold'} color={'green.500'} align='left'>
              {getCurrencyAmount(authStore.user?.card?.money)} {authStore.currency_symbol}
            </Heading>
            <Spacer/>
            <Select width={20} value={authStore.currency} onChange={onSelectCurrency}>
              <option value='EUR'>EUR</option>
              <option value='USD'>USD</option>
              <option value='BYN'>BYN</option>
            </Select>
            <Button colorScheme='orange' onClick={updateCurrency}>Update</Button>
          </HStack>
        </VStack>
        <Divider borderColor='gray.500' orientation='horizontal' />
        </>
        )}

        <Tabs variant='enclosed' colorScheme="purple">
          <TabList>
            <Tab>{authStore.isAdmin && 'All '}Transactions</Tab>
            <Tab>{authStore.isAdmin && 'All '}Credits</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TransactionSection />
            </TabPanel>
            <TabPanel>
              <CreditSection />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );

});


export default HomePage2;