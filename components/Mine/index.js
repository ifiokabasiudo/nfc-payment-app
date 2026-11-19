import SellCard from '@/components/Him'
import { Box, Heading, Button, Text, Flex } from 'theme-ui'
import { useEffect, useState } from 'react'
import ChannelsSheet from '@/components/ConfirmWithdrawal'
import ConvertSheet from '@/components/Convert'
import { useAuth } from "@/contexts/auth"
import PullToRefresh from 'react-simple-pull-to-refresh'
import Link from 'next/link'
import api from '@/services/api'
import { useRouter } from 'next/router'
import { numberWithCommas } from '@/functions'
import { handleFailure } from '../SweetAlert'

const Fragment = () => {
    const { user, setReload, reset, setLoading, reload } = useAuth()
    const [bottomSheet, setBottomSheet] = useState(false)
    const [bottomSheet1, setBottomSheet1] = useState(false)
    const [timer, setTimer] = useState()
    const [orderz, setOrderz] = useState()
    const router = useRouter()

    const getOrder = async () => {
        try {
            const account = await api.get('api/account/on', {
                params: {
                    W: '1',
                    reqUid: user?.uid,
                    //page: 1,
                    //limit: 15,
                }
            })
            if (account?.data?.body) {
                if (account.data?.body?.data) {
                    setReload(!reload)
                    console.log(account.data?.body?.data)
                    setOrderz(account.data?.body?.data)
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

    const handleConfirm = (formData) => {
        formData.status = 'ACTIVE'
        console.log(formData)
        setLoading(true)
        api.post('api/account/withdraw', formData).then(() => {
            setReload(!reload)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }

    useEffect(() => {
        getOrder()

        // Run myfunc every second
        if (user?.mining && user?.mining == '1') {

            var countDownDate = new Date(user?.mStartTime).getTime();
            var myfunc = setInterval(function () {

                var now = new Date().getTime();
                var timeleft = now - countDownDate;

                // Calculating the days, hours, minutes and seconds left
                var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
                var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
                if(hours == '24' && seconds == '30'){
                    setReload(!reload)
                }
                // Result is output to the specific element
                setTimer(
                    days + "d " +
                    hours + "h " +
                    minutes + "m " +
                    seconds + "s "
                )

                if (user?.mining && user?.mining == '0') {
                    clearInterval(myfunc)
                }

            }, 1000);
        }
    }, [user])

    return (
        <Box sx={styles.buyLayout}>
            {bottomSheet && <ChannelsSheet setBottomSheet={setBottomSheet} reset={reset} handleConfirm={handleConfirm} user={user} />}
            {bottomSheet1 && <ConvertSheet setBottomSheet={setBottomSheet1} reset={reset} user={user} />}
            <Flex sx={styles.flex}>
                <Link href={'/wallet'}>
                    <Text as={'p'}>Deposit USDT</Text>
                </Link>
                <Box onClick={() => {
                    setBottomSheet1(true)
                }}>
                    <Text>
                        <Text as={'p'}>Convert</Text>
                    </Text>
                </Box>
            </Flex>
            <Flex sx={{
                background: 'white',
                textAlign: 'center',
                mx: '15px',
                my: '6px',
                borderRadius: '15px',
                py: '5px',
                p: {
                    fontSize: '13px'
                },
                justifyContent: 'space-evenly'
            }}>
                <Box>
                    <Heading>{numberWithCommas(user?.balanceUSDT)}</Heading>
                    <Text as='p'>Balance (USDT) <br /> <strong>+ Reward / hr</strong> </Text>
                </Box>
                <Box>
                    <Heading>{numberWithCommas(user?.balInWithdrawUSDT)}</Heading>
                    <Text as='p'>Balance In Withdrawal <br />(USDT)</Text>
                </Box>
            </Flex>

            {user?.mining == '1' && <>
                <Text as='p' sx={{
                    textAlign: 'center',
                    color: 'white',
                    my: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>Mining Start Time: <br />  {new Date(user?.mStartTime).toUTCString()}</Text>

                <Text as={'p'} sx={{
                    color: 'white',
                    textAlign: 'center',
                    mb: '5px',
                    fontSize: '14px'
                }}>Mining Timer: {timer}</Text>
                <Text as={'p'} sx={{
                    color: 'white',
                    textAlign: 'center',
                    mb: '5px',
                    fontSize: '14px'
                }}>Mining Reward: <strong>{user?.rewardUSDT} USDT</strong> </Text>
            </>}
            <Box sx={{
                p: '5px 15px',
            }}>
                <Box sx={{
                    borderRadius: '15px',
                    border: '1px solid black',
                    background: 'white',
                    p: '5px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    if (user?.withdrawable == '0') {
                        handleFailure('Cant Withdraw', 'Withdrawal Only available after 24hrs')
                    } else {
                        setBottomSheet(true)
                    }
                }}>
                    <Flex>
                        <Box sx={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            background: 'primaryGrad'
                        }}>
                        </Box>
                        &nbsp;
                        &nbsp;
                        <Text sx={{ my: 'auto' }}>{'Withdrawal Funds'}</Text>
                        &nbsp;
                    </Flex>

                </Box>
            </Box>

            <Flex sx={{
                padding: '7px 7px',
                justifyContent: 'space-between',
                color: 'white',
                p: {
                    fontSize: '14px'
                }
            }}>
                <Text as={'p'}>Withdrawal Orders</Text>
                <Text as={'p'}>Quantity: {orderz?.length ? orderz?.length : 0}</Text>
            </Flex>
            <Button sx={{
                position: 'absolute',
                bottom: '0',
                zIndex: '3999',
                left: '0',
                zIndex: 100,
                right: '0',
                background: user?.mining && user?.mining == '1' ? 'red' : 'white',
                color: user?.mining && user?.mining == '1' ? 'white' : 'primary',
                mx: '20px',
                mb: '20px',
                boxShadow: '1px 1px 6px 3px #56144160',
                width: 'auto',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                p: {
                    my: 'auto'
                }
            }} onClick={() => {
                if (Number(user?.balanceUSDT) < 50 && user?.mining == '0'){
                    handleFailure('Failed', 'Balance Must be more than 50$ to mine')
                    return
                } else if (user?.kycStatus != 'ACCEPTED') {
                    handleFailure('Not KYC-ed!', 'Kindly Complete your KYC')
                    if (user?.kycStatus == 'PENDING') {
                        handleFailure('KYC Details Sent!', 'Kindly Await Approval, it takes 24 - 72 hours for our team to review your application')
                    } else {
                        router.push('/kyc')
                    }
                    return
                }
                setLoading(true)
                api.put('api/account/myprofile', {
                    mining: user?.mining && user?.mining == '1' ? '0' : '1'
                }).then(() => {
                    setReload(!reload)
                    setLoading(false)
                }).catch((error) => {
                    console.log(error)
                    setLoading(false)
                })
            }}><Text as={'p'}>{user?.mining && user?.mining == '1' ? 'Stop Mining' : 'Start Mining'}</Text></Button>
            <PullToRefresh onRefresh={async () => {
                getOrder()
                return true
            }}>
                <Box sx={styles.buyContainer}>
                    {orderz?.map((data, i) => {
                        return (
                            <SellCard key={i} {...data} handleConfirm={handleConfirm} />
                        )
                    })}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />  <br />
                    <br />
                    <br />
                    <br />
                    <br />  <br />
                    <br />
                    <br />
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
        px: '15px',
        pt: '25px',
        mb: '15px',
        color: 'white',
        p: {
            fontSize: '14px'
        },
        svg: {
            fill: 'white'
        },
        a: {
            textDecoration: 'none',
            color: 'white',
            display: 'flex'
        }
    },
    buyLayout: {
        height: 'inherit',
        width: '100%',
        position: 'absolute',
        overflowY: 'hidden',
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