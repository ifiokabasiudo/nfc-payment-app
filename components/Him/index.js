import { Box, Text, Flex, Heading, Button } from 'theme-ui'
import { useRouter } from 'next/router'
const Card = ({ txId, status,ss, amount,createdAt, recharge }) => {
    const router = useRouter()
const cat = new Date(createdAt)
    return (
        <Box sx={styles.box} onClick={() => {
            //router.push(`/with/${orderId}`)
        }}>
            <Flex
                sx={{ justifyContent: 'space-between' }}><Text as={'p'} sx={{
                    fontSize: '12px'
                }}>TX: {txId}</Text>

                <Text as={'p'} sx={{
                    fontSize: '12px',
                    fontWeight:'bold',
                    color:'primary'
                }}>Status: {status}</Text></Flex>
            <hr />
            <Flex className='flex'>
                <Box >
                    <Heading variant={ss}>{ss == 'DEBIT' ? '-₦' + amount : '+₦' + amount}</Heading>
                </Box>
                {!recharge && <Button>{status == 'ACTIVE'? 'View TX':'View TX'}</Button>}
            </Flex>
            <br />
            <hr />
            <Flex sx={{
                justifyContent: 'space-between',
                p: {
                    fontSize: '11px',
                }
            }}>
                <Text as={'p'}>{cat.toUTCString()}</Text>
                <Text as={'p'}>Amount: {amount}</Text>
            </Flex>
        </Box>
    )
}

export default Card

const styles = {
    box: {
        padding: '10px 10px',
        borderRadius: '10px',
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