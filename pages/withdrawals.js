import SellCard from '@/components/SellCard'
import { Box, Text, Flex } from 'theme-ui'
import { useEffect,useState } from 'react'
import { useAuth } from "@/contexts/auth"
import PullToRefresh from 'react-simple-pull-to-refresh'
import api from '@/services/api'
import { useRouter } from 'next/router'

const Fragment = () => {
  const { user, setReload, setLoading, reload } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState()


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

  const getOrder = async () => {
    try {
      const account = await api.get('api/account/on', {
        params: {
          type: "WITHDRAW",
          creatorUid: user?.uid,
        }
      })
      if (account?.data?.body) {
        if (account.data?.body?.data) {
          setOrder(account.data?.body?.data)
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
  }, [])
  return (
    <Box sx={styles.buyLayout}>
      <Flex sx={styles.flex}>
        <Text as={'p'}>Withdrawal Records</Text>
        <Box sx={{
          a: {
            textDecoration: 'none',
            color: 'white'
          }
        }}>
        </Box>
      </Flex>

      <Flex sx={{
        padding: '17px 17px',
        justifyContent: 'space-between',
        color: 'white',
        p: {
          fontSize: '14px'
        }
      }}>

        <Text as={'p'}>Quantity: {order?.length ? order?.length : 0}</Text>
      </Flex>
      <PullToRefresh onRefresh={async () => {
        getOrder()
        return true
      }}>
        <Box sx={styles.buyContainer}>
          {order?.map((data, i) => {
            return (
              <SellCard key={i} {...data} handleConfirm={handleConfirm} recharge={true} />
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
    height: '100vh',
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