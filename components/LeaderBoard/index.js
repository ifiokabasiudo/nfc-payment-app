import { Box, Flex, Heading, Text } from "theme-ui"
import { numberWithCommas } from "@/functions"
const LeaderBoard = ({commission,firstName,username,lastName,i}) => {
  return (
    <Box sx={{
      boxShadow: '1px 2px 3px 2px #03333020',
      padding: '12px 10px',
      borderRadius:'10px',
      m: '8px 3px',
      p:{
        fontWeight:'bold',
      }
    }}>
      <Flex sx={{
        justifyContent: 'space-between'
      }}>
        <Flex>
          <Text as={'p'}>{i+1}. </Text>
          &nbsp;
          <Box>
            <Text as={'p'}>{'@'+username}</Text>
            <Text as={'p'} sx={{
              fontStyle:'italic'
            }}>V1</Text>
          </Box>
        </Flex>
        <Box>
          <Heading as={'h4'} sx={{
            color:'green'
          }}>{commission ? numberWithCommas(commission):0}</Heading>
          <Text as={'p'} sx={{
            textAlign:'right'
          }}>NGN</Text>
        </Box>
      </Flex>

    </Box>
  )
}

export default LeaderBoard