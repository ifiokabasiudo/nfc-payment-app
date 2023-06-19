import { Box, Grid, Text, Flex, Heading, Container, Button } from "theme-ui"
import Avatar from "../Avatar"
import { Profile } from "@/assets/bg"
import Card from "../Him"
import PullToRefresh from "react-simple-pull-to-refresh"
import { numberWithCommas } from "@/functions"
import { NGNFlag } from "@/assets/flag"
import { usePaystackPayment } from 'react-paystack';
import api from "@/services/api"
import { Eye } from "@/assets/icons"
import { handleFailure, handleSuccess } from "../SweetAlert"
import { Notification } from "@/assets/icons"
import { useAuth } from "@/contexts/auth"
import { useState, useEffect } from "react"
const values = [
  {
    icon: <Box sx={{
      width: '40px',
      height: '40px',
      background: 'grey',
      mb: '5px',
      borderRadius: '100px'
    }} />,
    title: 'Pay Bills',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Data',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Airtime',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Electricity',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Betting',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Utilities',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Schools',
  },
  {
    icon: <Box sx={{
      width: '40px',
      mb: '5px',
      height: '40px',
      background: 'grey',
      borderRadius: '100px'
    }} />,
    title: 'Savings',
  },
]
const HomeFragment = () => {
  const [status, setStatus] = useState('CREDIT')
  const { user,reload,setReload } = useAuth()
  const [orderz, setOrderz] = useState()

  const config = {
    reference: (new Date()).getTime(),
    email: user?.email,
    amount: 100,
    publicKey: process.env.PAYSTACK,
};
const initializePayment = usePaystackPayment(config);

// you can call this function anything
const onSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
};

// you can call this function anything
const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
}

  const getOrder = async () => {
    try {

      console.log(user?.uid)
      const params = status == 'CREDIT' ? {
        receiverUid: user?.uid,
      } : {
        senderUid: user?.uid,
      }

      const account = await api.get('api/account/on', {
        params
      })
      if (account?.data?.body) {
        if (account.data?.body?.data) {
          setOrderz(account.data?.body?.data)
          console.log(account.data?.body?.data)
        }

      }
    } catch (error) {
      if (error.response?.data) {
        handleFailure('Failed', error.response.data.message);
      } else {
        if (error.reason) {
          handleFailure(error.reason);
        } else {
          handleFailure(error.message);
        }
      }
      //router.back()
    }
  }
  useEffect(() => {
    getOrder()
  }, [status])
  return (
    <PullToRefresh onRefresh={async () => {
      setReload(!reload)
      await getOrder()
      return true
  }}>
    <Box sx={{
      '.bg': {
        //height:'40em',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
      }
    }}>
      <Box sx={{
        background: user?.role == 'MERCHANT' ? '#02A75A' :'primaryGrad',
        pt: '40px',
        width: '100%',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        color: 'white'
      }}>
        <Container>
          <Flex sx={{
            position: 'relative',
            zIndex: '2',
            pt: '20px',
            justifyContent: 'space-between'
          }}>
            <Flex sx={{
              p: {
                fontWeight: '450',
                my: 'auto',
                ml: '10px'
              }
            }}>
              <Avatar size={['40px', null, null, '48px']} font={['13px', null, null, '17px']} text={user?.username} />
              <Text as='p'>Hi, {user?.firstName ? user?.firstName : '@' + user?.username}</Text>
            </Flex>
            <Box sx={{
              background: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 9px 50px rgba(0,0, 0, 0.6)',
              borderRadius: '50%',
              height: '40px',
              width: '40px',
              color: 'primary',
              textAlign: 'center',
              svg: {
                m: 'auto',
                //fill:'primary',
                path: {
                  stroke: 'primary',
                  strokeWidth: '1.2px'
                },
              },
            }}>
              <Notification />
              <Text as={'p'} sx={{
                position: 'absolute',
                right: '11px',
                fontWeight: '900',
                transform: 'scale(2)'
              }}>&middot;</Text>
            </Box>
          </Flex>
          <br />
          <Box sx={{
            background: 'white',
            boxShadow: '0px 9px 50px rgba(255,255, 255, 0.1)',
            borderRadius: '30px',
            p: '30px',
            mb: '10px',
            color: 'text',
            h2: {
              my: '8px'
            }
          }}>
            <Flex sx={{
              justifyContent: 'space-between'
            }}>
              <Flex>
                <NGNFlag />
                &nbsp;
                <Text as='p' sx={{
                  fontSize: '12px',
                  fontWeight: '450'
                }}>NFC Wallet</Text>
              </Flex>
              <Eye />
            </Flex>
            <Heading> ₦{user?.balance ? numberWithCommas(user?.balance) : '0.000'}</Heading>
            <Text as='p' sx={{
              fontSize: '11px',
              opacity: '0.7'
            }}>Last Updated 1 mins 30 sec ago</Text>
          </Box>
          <Flex sx={{
            button: {
              width: '100%',
              borderRadius: '5px',
              py: '12px',
              fontSize: '14px',
              fontWeight: '500'
            }
          }}>
            <Button>Transfer</Button>
            <Button onClick={()=>{
                initializePayment(onSuccess, onClose)
            }}>{user?.role == 'MERCHANT'?'Withdraw':'Top Up'}</Button>
          </Flex>
          <br />
        </Container>

      </Box>

      <Container>
        <Flex sx={{
          textAlign: 'center',
          py: '10px',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          '.selected': {
            background: '#02A75A20',
            borderColor: '#02A75A',
            color: 'text',
          },
          '.red': {
            background: 'rgba(225,0,0,0.1)',
            borderColor: 'rgba(225,0,0,1)',
            color: 'text'
          },

          p: {
            border: '1px solid #00000050',
            borderRadius: '5px',
            color: 'text',
            fontSize: '13px',
            mx: '5px',
            mt: '10px',
            p: '3px 10px',
            fontWeight: '500',
            width: 'fit-content',
            textAlign: 'center',
          }
        }}>
          <Text as='p' className={status == 'CREDIT' ? 'selected' : ''} onClick={async (e) => {
            setStatus('CREDIT')
          }}>Credit</Text>
          <Text as='p' className={status == 'DEBIT' ? 'selected red' : ''} onClick={async (e) => {
            setStatus('DEBIT')
          }}>Debit</Text>
        </Flex>
        <Box sx={{
          background: 'white',
          boxShadow: '0px 9px 50px rgba(0,0, 0, 0.1)',
          borderRadius: '30px',
          mt: '20px'
        }}>
          <Flex sx={{
            justifyContent: 'space-between',
            padding: '20px 20px',
            pb: '5px'
          }}>
            <Text as='h4'>Transactions</Text>
            <Text as='p' sx={{
              fontSize: '13px'
            }}>View All</Text>
          </Flex>
          <Grid gap={2} columns={[1]} sx={{
            p: '15px',
            textAlign: 'center'
          }}>
            {orderz?.map((data, i) => {
              const { txId, amount, createdAt } = data
              data.ss = status
              return amount ? (
                <>
                  <Card {...data}/>
                  {/* <Box key={i} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    {txId}
                    <Text as={'p'} variant={status} sx={{
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>{status == 'DEBIT' ? '-' + amount : '+' + amount}</Text>
                  </Box> */}
                </>

              ) : null
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
    </PullToRefresh>

  )
}

export default HomeFragment