/* eslint-disable react-hooks/exhaustive-deps */
import BuyCard from '@/components/BuyCard'
import { Box, Text, Flex } from 'theme-ui'
import { Records } from '@/assets/icons'
import BottomSheet from '@/components/BottomSheet'
import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/auth"
import PullToRefresh from 'react-simple-pull-to-refresh'
import Link from 'next/link'
import api from '@/services/api'
import { useRouter } from 'next/router'
import { numberWithCommas } from '@/functions'
import { handleFailure } from '../SweetAlert'
import { syncWait } from '@/functions'
const Fragment = () => {
  const [bottomSheet, setBottomSheet] = useState()
  const { user, setReload,reset, setLoading, reload } = useAuth()
  const [orderz, setOrderz] = useState()
  const router = useRouter()
  const getOrder = async () => {
    try {
      const account = await api.get('api/account/on', {
        params: {
          type: 'WITHDRAW',
          status: 'OPEN',
          page: 1,
          limit: 15,
        }
      })
      if (account?.data?.body) {
        if (account.data?.body?.data) {
          console.log(account.data?.body?.data)
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

  useEffect(() => {
    getOrder()
    syncWait(2500);
  })
  return (
    <Box sx={styles.buyLayout}>
      {bottomSheet?.open && <BottomSheet bottomSheet={bottomSheet} user={user} reset={reset} setBottomSheet={setBottomSheet} />}
      <Flex sx={styles.flex}>
        <Text as={'p'}>Buy Orders</Text>
        <Box sx={{
          a: {
            textDecoration: 'none',
            color: 'white'
          }

        }}>
          <Link href='/tx?type=WITHDRAW'>
            <Text as={'p'}>Orders Record&nbsp;<Records /></Text>
          </Link>
        </Box>
      </Flex>
      <PullToRefresh onRefresh={async () => {
        await getOrder()
        return true
      }}>
        <Box sx={styles.buyContainer}>
          {orderz?.map((data, i) => {
            return (
              <BuyCard key={i} {...data} setBottomSheet={setBottomSheet} />
            )
          })}
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
    p: '25px 15px',
    color: 'white',
    svg: {
      fill: 'white'
    }
  },
  buyLayout: {
    height: 'inherit',
    width: '100%',
    overflowY: 'hidden',
    position: 'absolute',
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