import SellCard from '@/components/SellCard'
import { Box, Heading, Button, Text, Flex } from 'theme-ui'
import { Records } from '@/assets/icons'
import { Edit } from 'react-feather'
import { useEffect, useState } from 'react'
import ChannelsSheet from '@/components/SelectChannel'
import { useAuth } from "@/contexts/auth"
import PullToRefresh from 'react-simple-pull-to-refresh'
import Link from 'next/link'
import api from '@/services/api'
import { useRouter } from 'next/router'
import { numberWithCommas } from '@/functions'
import { handleFailure } from '../SweetAlert'
import { syncWait } from '@/functions'
const Fragment = () => {
  const { user, setReload, setLoading, reload } = useAuth()
  const [bottomSheet, setBottomSheet] = useState(false)
  const [channel, setChannel] = useState()
  const [orderz, setOrderz] = useState()
  const router = useRouter()

  const getOrder = async () => {
    try {
      const account = await api.get('api/account/on', {
        params: {
          type: 'RECHARGE',
          status: 'ACTIVE',
          creatorUid: user?.uid,
          page: 1,
          limit: 15,
        }
      })
      if (account?.data?.body) {
        if (account.data?.body?.data) {
          setOrderz(account.data?.body?.data)
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

  const handleConfirm = (orderId, status) => {
    setLoading(true)
    api.put('api/account/recharge', {
      orderId,
      status
    }).then(() => {
      setReload(!reload)
      setLoading(false)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }

  useEffect(() => {
    user?.channels.forEach((channel) => {
      if (user?.selectedChannel == channel._id) {
        setChannel(channel);
        return
      }
    })
    if (user?.selling && user?.selling == '1') {
      getOrder()
      syncWait(2500);
    }
  })
  return (
    <Box sx={styles.buyLayout}>
      {bottomSheet && <ChannelsSheet setBottomSheet={setBottomSheet} user={user} channel={channel} setChannel={setChannel} />}
      <Flex sx={styles.flex}>
        <Text as={'p'}>Bulk Order</Text>
        <Box sx={{
          a: {
            textDecoration: 'none',
            color: 'white'
          }

        }}>
          <Link href='/tx?type=RECHARGE'>
            <Text as={'p'}>Orders Record&nbsp;<Records /></Text>
          </Link>
        </Box>
      </Flex>
      <Flex sx={{
        background: 'white',
        textAlign: 'center',
        mx: '15px',
        my: '6px',
        borderRadius: '15px',
        py: '5px',
        p: {
          fontSize: '13px'
        },
        justifyContent: 'space-evenly'
      }}>
        <Box>
          <Heading>{numberWithCommas(user?.balance)}</Heading>
          <Text as='p'>Order Available(NGN)</Text>
        </Box>
        <Box>
          <Heading>{numberWithCommas(user?.balInSale)}</Heading>
          <Text as='p'>In transaction(NGN)</Text>
        </Box>
      </Flex>
      <Text as='p' sx={{
        textAlign:'center',
        color:'white',
        fontWeight:'bold'
      }} onClick={() => {
        setReload(!reload)
      }}>Refresh Balance</Text>
      <Box sx={{
        p: '5px 15px',
      }} >
        <Text as={'p'} sx={{
          color: 'white',
          mb: '5px',
          fontSize: '14px'
        }}>Current Receiving Account</Text>
        <Box sx={{
          borderRadius: '15px',
          border: '1px solid black',
          background: 'white',
          p: '5px',
          display: 'flex',
          justifyContent: 'space-between'
        }} onClick={() => {
          if (user?.selling == '1') {
            handleFailure('Can Change', 'Stop Taking Orders to reselect channel')
          } else {
            setBottomSheet(true)
          }
        }}>
          <Flex>
            <Box sx={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              background: 'primaryGrad'
            }}>
            </Box>
            &nbsp;
            &nbsp;
            <Text sx={{ my: 'auto' }}>{channel ? channel.accountName : 'Select from List'}</Text>
            &nbsp;
          </Flex>

          <Flex>
            <hr />
            &nbsp; &nbsp;
            <Edit />
            &nbsp;
          </Flex>


        </Box>
      </Box>

      <Flex sx={{
        padding: '7px 7px',
        justifyContent: 'space-between',
        color: 'white',
        p: {
          fontSize: '14px'
        }
      }}>
        <Text as={'p'}>Order In Progress</Text>
        <Text as={'p'}>Quantity: {orderz?.length ? orderz?.length : 0}</Text>
      </Flex>
      <Button sx={{
        position: 'absolute',
        bottom: '0',
        zIndex: '3999',
        left: '0',
        zIndex: 100,
        right: '0',
        background: user?.selling && user?.selling == '1' ? 'red' : 'white',
        color: user?.selling && user?.selling == '1' ? 'white' : 'primary',
        mx: '20px',
        mb: '20px',
        boxShadow: '1px 1px 6px 3px #56144160',
        width: 'auto',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        p: {
          my: 'auto'
        }
      }} onClick={() => {
        if (user?.balance <= 0) {
          handleFailure('Failed', 'No available balance for Sale, Deposit Tron USDT to credit your NGN balance')
          return
        } else if (!channel) {
          handleFailure('Failed', 'Kindly Select a collection channel above')
          return
        } else if (user?.kycStatus != 'ACCEPTED') {
          handleFailure('Not KYC-ed!', 'Kindly Complete your KYC')
          if (user?.kycStatus == 'PENDING') {
            handleFailure('KYC Details Sent!', 'Kindly Await Approval, it takes 24 - 72 hours for our team to review your application')
          } else {
            router.push('/kyc')
          }
          return
        }
        setLoading(true)
        api.put('api/account/myprofile', {
          selling: user?.selling && user?.selling == '1' ? '0' : '1'
        }).then(() => {
          setReload(!reload)
          setLoading(false)
        }).catch((error) => {
          console.log(error)
          setLoading(false)
        })
      }}><Text as={'p'}>{user?.selling && user?.selling == '1' ? 'Stop Taking Orders' : 'Start Taking Orders'}</Text></Button>
      <PullToRefresh onRefresh={async () => {
        getOrder()
        return true
      }}>
        <Box sx={styles.buyContainer}>
          {orderz?.map((data, i) => {
            return (
              <SellCard key={i} {...data} handleConfirm={handleConfirm} />
            )
          })}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </Box>
      </PullToRefresh>
    </Box>
  )
}

export default Fragment

const styles = {
  flex: {
    justifyContent: 'space-between',
    px: '15px',
    pt: '25px',
    color: 'white',
    p: {
      fontSize: '14px'
    },
    svg: {
      fill: 'white'
    }
  },
  buyLayout: {
    height: 'inherit',
    width: '100%',
    position: 'absolute',
    overflowY: 'hidden',
    background: 'primaryGrad'
  },
  buyContainer: {
    overflowY: 'scroll',
    height: '100%',
    pt: '20px',
    background: 'white',
    borderRadius: '15px 15px 0 0'
  },
}