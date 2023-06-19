import { Box, Text, Flex, Heading, Button, Image } from 'theme-ui'

const Card = ({orderId,amount}) => {
    return (
        <Box sx={styles.box}>
            <Text as={'p'} sx={{
                fontSize: '12px'
            }}>TXID: {orderId}</Text>
            <hr />
            <Flex className='flex'>
                <Text as={'p'}>commission </Text>
                <Text variant='ACCEPTED'>+{amount} NGN</Text>
            </Flex>
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