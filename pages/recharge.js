import { Box, Image, Button, Flex, Text, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { handleFailure, handleSuccess } from "@/components/SweetAlert";
import api from "@/services/api";
import Link from "next/link";

const Login = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const { user, setReload, reload, } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()
    async function onSubmit(formData) {
        if (formData.amount < 100) {
            handleFailure('Failed', 'Min amount is 100 NGN')
            return
        }
        if (user?.kycStatus != 'ACCEPTED') {
            handleFailure('Not KYC-ed!', 'Kindly Complete your KYC')
            router.push('/kyc')
            return
        }
        setIsSubmitting(true)

        api.post('api/account/recharge', formData).then((res) => {
            setReload(!reload)
            handleSuccess('Success', 'Order Found')
            setIsSubmitting(false)
            setIsSubmitted(true)
            router.push(`/orders/${res.data.body}`)
        }).catch((error) => {
            if (error.response?.data) {
                handleFailure('Failed', error.response.data.message);
            } else {
                if (error.reason) {
                    handleFailure(error.reason);
                } else {
                    handleFailure(error.message);
                }
            }
            setIsSubmitting(false)
            setIsSubmitted(true)
        })
    }
    return (
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
            <Text as={'p'}>Recharge</Text>
            <br />
            <Image src="/logo.png" width={50} height={50} alt='logo' />
            <br />
            <br />
            <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                textAlign: 'left',
                label: {
                    mt: '10px'
                }
            }}>
                <Box>
                    <Label htmlFor="amount">Recharge Amount (NGN)</Label>
                    <Input name="amount" id="amount" type="amount" {...register("amount", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Enter amount" />
                    <Text variant='danger'>{errors.amount && errors.amount.message}</Text>
                </Box>
                <br />
                <Button type="submit" sx={{
                    width: '100%'
                }}>Recharge</Button>
                <br />
                <br />
                <br />
                <br />
                <Link href='/recharges'>View Recharge Orders</Link>
            </Box>
            <br />

        </Box>


    )
}

export default Login