import { Box,Spinner, Heading, Button, Flex, Text, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { handleFailure, handleSuccess } from "@/components/SweetAlert";
import { Edit } from 'react-feather'
import { useEffect, useState } from 'react'
import api from "@/services/api";
import ChannelsSheet from '@/components/SelectChannel'
import Link from "next/link";
import { numberWithCommas } from "@/functions";
const Login = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const { user, setReload, reload, } = useAuth();
    const [bottomSheet, setBottomSheet] = useState(false)
    const [channel, setChannel] = useState()
    const [load, setLoad] = useState()
    const router = useRouter()
    useEffect(() => {
        user?.channels.forEach((channel) => {
            if (user?.selectedChannel == channel._id) {
                setChannel(channel);
                return
            }
        })
    }, [])
    async function onSubmit(formData) {
        if(!channel){
            handleFailure('Failed', 'Select an account')
            return
        }
        if (formData.amount < 100) {
            handleFailure('Failed', 'Min amount is 100 NGN')
            return
        }
        if (user?.kycStatus != 'ACCEPTED') {
            handleFailure('Not KYC-ed!', 'Kindly Complete your KYC')
            router.push('/kyc')
            return
        }
        formData.status = 'OPEN'
        setLoad(true)
        api.post('api/account/recharge?type=WITHDRAW', formData).then((res) => {
            setReload(!reload)
            handleSuccess('Success', 'Order Found')
            setLoad(false)
            //router.push(`/orders/${res.data.body}`)
        }).catch((error) => {
            setLoad(false)
            if (error.response?.data) {
                handleFailure('Failed', error.response.data.message);
            } else {
                if (error.reason) {
                    handleFailure(error.reason);
                } else {
                    handleFailure(error.message);
                }
            }
        })
    }
    return (
        <>
            {bottomSheet && <ChannelsSheet setBottomSheet={setBottomSheet} user={user} channel={channel} setChannel={setChannel} />}
            <Box sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                p: '20px 15px',
                m: 'auto',
                background: '#56144110',
                textAlign: 'center',
                borderRadius: '15px'
            }}>
                <br />
                <br />
                <Text as={'p'}>Withdraw</Text>
                <br />
                <Flex sx={{
                    background: 'primaryGrad',
                    color:'white',
                    textAlign: 'center',
                    mx: '15px',
                    my: '2px',
                    borderRadius: '15px',
                    py: '15px',
                    p: {
                        fontSize: '13px',
                    },
                    justifyContent: 'space-evenly'
                }}>
                    <Box>
                        <Heading>{numberWithCommas(user?.balance)}</Heading>
                        <Text as='p'>Your Balance(NGN)</Text>
                    </Box>
                    <Box>
                        <Heading>{numberWithCommas(user?.balInWithdrawal)}</Heading>
                        <Text as='p'>In transaction(NGN)</Text>
                    </Box>
                </Flex> <br />
                <br />
                <Box sx={{
                    p: '5px 0px',
                }} >
                    <Text as={'p'} sx={{
                        mb: '5px',
                        fontSize: '14px'
                    }}>Current Receiving Account</Text>
                    <Box sx={{
                        borderRadius: '15px',
                        border: '1px solid black',
                        background: 'white',
                        p: '5px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }} onClick={() => {
                        setBottomSheet(true)
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
                            <Text sx={{ my: 'auto' }}>{channel ? channel.accountName : 'Select from List'}</Text>
                            &nbsp;
                        </Flex>

                        <Flex>
                            <hr />
                            &nbsp; &nbsp;
                            <Edit />
                            &nbsp;
                        </Flex>


                    </Box>
                </Box>
                <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                    textAlign: 'left',
                    label: {
                        mt: '10px'
                    }
                }}>
                    <Box>
                        <Label htmlFor="amount">Withdraw Amount (NGN)</Label>
                        <Input name="amount" id="amount" type="amount" {...register("amount", {
                            required: "Required",
                        })} my={2} onChange={(e) => {
                        }} placeholder="Enter amount" />
                        <Text variant='danger'>{errors.amount && errors.amount.message}</Text>
                    </Box>
                    <br />
                    <Button type="submit" sx={{
                        width: '100%'
                    }}>Withdraw</Button>
                    {load && <Spinner/>}
                    <br />
                    <br />
                    <br />
                    <br />
                    <Link href='/withdrawals'>View Withdrawal Orders</Link>
                </Box>
                <br />

            </Box>
        </>



    )
}

export default Login