import { Box, Heading, Text, Flex } from "theme-ui"
import { useAuth } from "@/contexts/auth"
import { Copy } from "react-feather";
import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from "react";
import { Records } from '@/assets/icons'
import Link from 'next/link'
import PullToRefresh from "react-simple-pull-to-refresh";
import { copy } from "@/functions";
import { handleSuccess, handleFailure } from "@/components/SweetAlert";
import api from "@/services/api";
const Wallet = () => {
  const { user } = useAuth()
  const [rate, setRate] = useState(290)
  const { Canvas } = useQRCode();
  async function getRate() {
    try {
      const res = await api.get('api/account/wa')
      console.log(res.data)
      setRate(res?.data?.body?.rate ? res?.data?.body?.rate : 290);
    } catch (error) {

    }
  }
  useEffect(() => {
    getRate()
  }, [])

  const handleCopy = async () => {
    try {
      await copy(user?.address)
      handleSuccess('Copied')
    } catch (error) {
      handleFailure('Unsupported')
    }
  }
  return (
    <PullToRefresh onRefresh={async () => {
      await getRate()
      return true
    }}>
      <Box sx={{
        background: 'primaryGrad',
        width: '100vw',
        height: '100vh',
        overflowY: 'scroll',
        color: 'white',
        textAlign: 'center',
        canvas: {
          borderRadius: '10px'
        },
        p: '35px 15px'
      }}>
        <Flex sx={{
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
        }}>
          <Text as={'p'}>Wallet</Text>
          <Box sx={{
            a: {
              textDecoration: 'none',
              color: 'white'
            }

          }}>
            <Link href='/deposits'>
              <Text as={'p'}>Deposit Records&nbsp;<Records /></Text>
            </Link>
          </Box>
        </Flex>
        <br />
        <Heading as='h2'>Deposit USDT</Heading>
        <Text as={'p'}><Text variant="danger">*Note: Minimum Deposit is 50 Tron USDT</Text></Text>

        <br />
        <Text sx={{ wordBreak: 'break-all' }} id="address" onClick={handleCopy}>{user?.address} &nbsp;&nbsp;<Copy size={20} /></Text>
        <br />
        <br />
        <br />
        <Canvas
          text={user?.address}
          options={{
            level: 'M',
            margin: 3,
            scale: 4,
            width: 220,
            color: {
              dark: '#000',
              light: '#fff',
            },
          }}
        />
        <br />
        <br />
        <Text as={'p'}> <strong>Note:</strong> Tron USDT Deposits would take 5 - 30mins under normal conditions to reflect in your USDT balance </Text>
        <br />
        <br />
        {/* <Text as={'p'}><strong>1 USDT = {rate} NGN</strong> <br /> <Text variant="danger"> Conversion Rate</Text></Text> */}
        <br />
      </Box>
    </PullToRefresh>

  )
}

export default Wallet