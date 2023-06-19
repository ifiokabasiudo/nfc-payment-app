import { Box, Text, Flex, Heading, Button, Image } from 'theme-ui'

const Card = ({createdAt,rate,tx,amount,value}) => {
    return (
        <Box sx={styles.box}>
            <Text as={'p'} sx={{
                fontSize: '12px'
            }}>Time: {createdAt}</Text>
            <hr />
            <Flex className='flex'>
                <Heading>{amount +' USDT'}</Heading>
                <Text variant='ACCEPTED'>{'+'+value+' NGN'}</Text>
            </Flex>
            <Text as={'p'} sx={{
                fontSize: '13px',
                wordBreak:'break-all'
            }}>Conversion Rate {rate} NGN</Text>
            <hr />
            <Text as={'p'} sx={{
                fontSize: '12px',
                wordBreak:'break-all'
            }}>Blockchain TX: {tx}</Text>
        </Box>
    )
}

export default Card

const styles = {
    box: {
        padding: '10px 10px',
        borderRadius: '10px',
        mx: '8px',
        mb: '10px',
        button: {
            width: '100%'
        },
        boxShadow: '1px 2px 5px 2px #33333330',
        '.flex': {
            justifyContent: 'space-between'
        },
        p: {
            my: '10px'
        },
        hr: {
            borderTop: 'dotted 1px',
            mb: '5px'
        }
    }
}