import { Box, Text, Flex, Heading, Button, Image } from 'theme-ui'
import { useAuth } from '@/contexts/auth'
import { handleFailure } from '../SweetAlert'
import { useRouter } from 'next/router'
import { numberWithCommas } from '@/functions'
const Card = ({ setBottomSheet, amount, orderId, collectionChannel }) => {
    const { user } = useAuth()
    const router = useRouter()
    return (
        <Box sx={styles.box}>
            <Text as={'p'} sx={{
                fontSize: '12px'
            }}>Order Number: {orderId}</Text>
            <hr />
            <Flex className='flex'>
                <Heading>{numberWithCommas(amount)} NGN</Heading>
                <Image src={collectionChannel?.bankLogoUrl} alt='bank' width={30} height={30} />
            </Flex>
            <Text as={'p'}>{numberWithCommas(2 / 100 * Number(amount))} NGN ~ {numberWithCommas(2.5 / 100 * Number(amount))} NGN</Text>
            <Button onClick={() => {
                if (user?.kycStatus != 'ACCEPTED') {
                    handleFailure('Not KYC-ed!', 'Kindly Complete your KYC')
                    if (user?.kycStatus == 'PENDING') {
                        handleFailure('KYC Details Sent!', 'Kindly Await Approval, it takes 24 - 72 hours for our team to review your application')
                    } else {
                        router.push('/kyc')
                    }
                    return
                }
                setBottomSheet({
                    open: true,
                    amount,
                    orderId,
                    ccImg: collectionChannel?.bankLogoUrl
                })
            }}>Buy</Button>
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