import { Box, Text, Flex, Heading, Button } from 'theme-ui'
import { useRouter } from 'next/router'
const Card = ({ orderId, status, amount, reqUsername, recharge }) => {
    const router = useRouter()

    return (
        <Box sx={styles.box} onClick={() => {
            router.push(`/orders/${orderId}`)
        }}>
            <Flex
                sx={{ justifyContent: 'space-between' }}><Text as={'p'} sx={{
                    fontSize: '12px'
                }}>Order Number: {orderId}</Text>

                <Text as={'p'} sx={{
                    fontSize: '12px',
                    fontWeight:'bold',
                    color:'primary'
                }}>Status: {status}</Text></Flex>
            <hr />
            <Flex className='flex'>
                <Box >
                    <Heading>{amount} NGN</Heading>
                    {!recharge && <Text as={'p'}>commission {amount * 2 / 100} NGN</Text>}
                </Box>
                {!recharge && <Button>{status == 'ACTIVE'? 'Confirm Payment':'View Order'}</Button>}
            </Flex>
            <hr />
            <Flex sx={{
                justifyContent: 'space-between',
                p: {
                    fontSize: '12px',
                }
            }}>
                <Text as={'p'}>Payer: @{recharge ? 'me':reqUsername}</Text>
                <Text as={'p'}>Order Amount: {amount}</Text>
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
            p: '0 10px',
            height: '40px',
            background: '#56144130',
            color: 'primary'
        },
        boxShadow: '1px 2px 5px 2px #33333330',
        '.flex': {
            justifyContent: 'space-between',
            h2:{
                my:'5px',
                color:'primary'
            }
        },
        p: {
            my: '10px'
        },
        hr: {
            borderTop: 'dotted 1px',
            opacity:'0.6',
            mb: '5px'
        }
    }
}