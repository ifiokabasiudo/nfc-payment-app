import SellCard from '@/components/SellCard'
import { Box, Text, Flex } from 'theme-ui'
import { Filter } from 'react-feather'
import BottomSheet from '@/components/BottomSheet'
import { useState, useEffect } from 'react'
import { handleFailure, handleSuccess } from '@/components/SweetAlert'
import { useAuth } from '@/contexts/auth'
import { useRouter } from 'next/router'
import PullToRefresh from 'react-simple-pull-to-refresh'
import api from '@/services/api'
const Fragment = () => {
    const [bottomSheet, setBottomSheet] = useState(false)
    const [orderz, setOrderz] = useState()
    const [status, setStatus] = useState('ALL')
    const { user } = useAuth()
    const { query } = useRouter()

    const getOrder = async (type) => {
        try {

            console.log(user?.uid)
            const params = query.type == 'RECHARGE' ? {
                creatorUid: user?.uid,
                type,
                status,
            } : {
                reqUid: user?.uid,
                type,
                status,
            }

            const account = await api.get('api/account/on', {
                params
            })
            if (account?.data?.body) {
                if (account.data?.body?.data) {
                    setOrderz(account.data?.body?.data)
                    console.log(account.data?.body?.data)
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
        getOrder(query.type)
    }, [status])

    return (
        <Box sx={styles.buyLayout}>
            {bottomSheet && <BottomSheet setBottomSheet={setBottomSheet} />}
            <Flex sx={styles.flex}>
                <Text as={'p'}>{query.type == 'RECHARGE' ? 'All Sell Orders' : 'All Buy Orders'}</Text>
                <Box>
                    <Text as={'p'}>&nbsp;<Filter /></Text>
                </Box>
            </Flex>
            <Flex sx={{
                background: 'white',
                textAlign: 'center',
                padding: '1px 10px',
                pb: '50px',
                mb: '-50px',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
                '.selected': {
                    background: '#56144120',
                    borderColor: '#561441',
                    color: '#9024C9'
                },
                p: {
                    border: '1px solid #00000050',
                    borderRadius: '5px',
                    color: '#00000090',
                    m: '2px',
                    mt: '10px',
                    p: '3px 0',
                    width: '100%',
                    textAlign: 'center',
                }
            }}>
                <Text as='p' className={status == 'ALL' ? 'selected' : ''} onClick={async (e) => {
                    setStatus('ALL')
                }}>All</Text>
                <Text as='p' className={status == 'ACTIVE' ? 'selected' : ''} onClick={async (e) => {
                    setStatus('ACTIVE')
                }}>Active</Text>
                <Text as='p' onClick={async (e) => {
                    setStatus('SUCCESS')
                }} className={status == 'SUCCESS' ? 'selected' : ''}>Completed</Text>
                <Text as='p' onClick={async (e) => {
                    setStatus('CANCELLED')
                }} className={status == 'CANCELLED' ? 'selected' : ''}>Cancelled</Text>
            </Flex>
            <PullToRefresh onRefresh={async () => {
                await getOrder(query.type)
                return true
            }}>
                <Box sx={styles.buyContainer}>
                    {orderz?.map((data, i) => {
                        return (
                            <SellCard key={i} {...data} />
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
        height: '100vh',
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