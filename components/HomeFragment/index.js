import { Box, Heading, Flex, Image, Grid, Text } from 'theme-ui'
import { Buy } from '@/assets/icons'
import { useState, useEffect } from 'react'
import { Filter } from 'react-feather'
import LeaderBoard from '@/components/LeaderBoard'
import { ArrowRight } from 'react-feather'
import { handleFailure } from '../SweetAlert'
import { Share } from '@capacitor/share'
import api from '@/services/api'
import PullToRefresh from 'react-simple-pull-to-refresh'
const Fragment = () => {
  const [leader, setLeader] = useState()
  const [link, setLink] = useState()
  console.log(link)
  const getOrder = async () => {
    try {
      const res = await api.get('api/account/wa')
      console.log(res.data)
      setLink(res?.data?.body?.deploymentLink ? res?.data?.body?.deploymentLink : 'CU Payment');
    } catch (error) {

    }
    try {
      const account = await api.get('api/trendingcreators', {
        params: {
          page: 1,
          limit: 15,
        }
      })
      if (account?.data?.body) {
        if (account.data?.body?.data) {
          setLeader(account.data?.body?.data)
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
  },[])
  return (
    <Box sx={{
      p: '10px 15px',
      height: 'inherit',
      position: 'fixed',
      width: '100%'
    }}>
      <br />
      <Box sx={{
        background: 'linear-gradient(123.3deg, rgba(2, 168, 154, 0.2) 0%, rgba(163, 102, 150, 0.2) 80.13%)',
        borderRadius: '10px',
        p: '10px 10px'
      }}>
        <Flex sx={{
          justifyContent: 'space-evenly'
        }}>
          <Box sx={{
            width: '50%',
            h2: {
              mb: '5px'
            }
          }}>
            <Heading>CU Payment <span>Earn</span></Heading>
            <Text as='p'> The Best place to get passive earnings</Text>
          </Box>
          <Image src={'/logo.png'} alt='Logo' width={100} height={100} />
        </Flex>
      </Box>
      <br />
      <Box onClick={async()=>{
        const s = await Share.canShare()
        console.log(s)
        await Share.share({
          title: 'See cool stuff',
          text: 'Want to earn passive income with me on CU Payment? Download the app below and start earning: '+link,
          url: {link},
          dialogTitle: 'Share with buddies',
        });
      }} sx={{
        background: 'primaryGrad',
        borderRadius: '10px',
        p: '10px 10px',
        color:'white',
        svg:{
          my:'auto'
        }
      }}>
        <Flex sx={{
          justifyContent: 'space-evenly'
        }}>
          <Box sx={{
            width: '50%',
            h2: {
              mb: '5px'
            }
          }}>
            <Heading>Invite  <span>Friends</span></Heading>
            <Text as='p'> Invite friends to earn</Text>
          </Box>
          <ArrowRight/>
        </Flex>
      </Box>
      <Grid>

      </Grid>
      <br />
      <Flex sx={{
        justifyContent: 'space-between'
      }}>
        <Text as={'p'}>Leader board</Text>
        <Filter />
      </Flex>
      <br />
      <PullToRefresh onRefresh={async () => {
        await getOrder()
        return true
      }}>
        <Box sx={{
          overflowY: 'scroll',
          height: '-webkit-fill-available',
        }}>
          {leader?.map((leader, i) => {
            return (
              <LeaderBoard key={i} i={i} {...leader} />
            )
          })}
        </Box>
      </PullToRefresh>
    </Box>
  )
}

export default Fragment