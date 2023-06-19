import { Box, Text, Flex, Heading, Button, Image } from 'theme-ui'

const Card = () => {
    return (
        <Box sx={styles.box}>
            <Text as={'p'} sx={{
                fontSize: '12px'
            }}>TXID: B2231232879283749879</Text>
            <hr />
            <Flex className='flex'>
                <Heading>611.79NGN</Heading>
                <Text variant='ACCEPTED'>Buy</Text>
            </Flex>
            <Text as={'p'}>commission 534.32 NGN</Text>
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