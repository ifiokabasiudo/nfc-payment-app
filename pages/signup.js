import { Box, Image, Button, Flex, Text,Spinner, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import api from '@/services/api'
import { handleSuccess, handleFailure } from '@/components/SweetAlert'
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
const SignUp = () => {
    const router = useRouter()
    const verifyEmail =  router?.query?.verify 
    const verificationCode =  router?.query?.verificationCode 
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(verifyEmail ? true: false)
    const {verify} = useAuth()
    const [email,setEmail] = useState(verifyEmail)
    
    async function onVerify(formData) {
        verify(formData)
    }
    async function onSubmit(formData) {
        console.log(formData)
        setIsSubmitting(true)
        setEmail(formData.email)
        try {
            const res = await api.post('api/auth/register',formData)
            if (res.data.statuscode == 200) {
                handleSuccess('Registration Successful')
                setIsSubmitting(false)
                setIsSubmitted(true)
                router.replace({
                    query: { ...router.query, verify: formData.email },
                })
            }

        } catch (error) {
            console.log(error)
            setIsSubmitting(false)
            if (error.response?.data) {
                handleFailure('Failed',error.response.data.message);
            } else {
                if (error.reason) {
                    handleFailure(error.reason);
                } else {
                    handleFailure(error.message);
                }
            }
        }
        setIsSubmitting(false)
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
            <Text as={'p'}>Welcome to CU Payment </Text>
            <br />
            <Image src="/logo.png" width={120} height={50} alt='logo' />
            <br />
            <Text>Already Have an account? <Link href={'/login'}>Login</Link></Text>
            <br />
            <br />
            {!isSubmitted && <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                textAlign: 'left',
                label: {
                    mt: '10px'
                }
            }}>
                <Box>
                    <Label htmlFor="email">Email Address</Label>
                    <Input name="email" id="email" type="email" {...register("email", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="john@gmail.com" />
                    <Text variant='danger'>{errors.email && errors.email.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="username">Username</Label>
                    <Input name="username" id="username" type="text" {...register("username", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Input Username" />
                    <Text variant='danger'>{errors.username && errors.username.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="password">Login Password</Label>
                    <Input name="password" id="password" type="password" {...register("password", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Enter Login Password" />
                    <Text variant='danger'>{errors.password && errors.password.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="securityPassword">Transaction Pin</Label>
                    <Input name="securityPassword" id="securityPassword" type="password" pattern="[0-9]*" {...register("securityPassword", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Enter Transaction Pin" />
                    <Text variant='danger'>{errors.securityPassword && errors.securityPassword.message}</Text>
                </Box>
                <br />
                <Flex sx={{
                    flexDirection: ['column', null, null, 'row'],
                    justifyContent: 'space-between',
                }}>
                    {!isSubmitting && !isSubmitted ? <Button type="submit">Sign Up</Button>
                        : null}
                    {isSubmitting ? <Box>
                        <Spinner />
                    </Box> : null}
                </Flex>
            </Box>}

            {isSubmitted && <Box as="form" onSubmit={handleSubmit(onVerify)} noValidate sx={{
                textAlign: 'left',
                label: {
                    mt: '10px'
                }
            }}>
                <Box>
                    <Label htmlFor="email">Email Address</Label>
                    <Input name="email" id="email" type="email" value={email} {...register("email", {
                        required: "Required",
                        value: email 
                    })} my={2} onChange={(e) => {
                    }} placeholder="john@gmail.com"/>
                    <Text variant='danger'>{errors.email && errors.email.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="verificationCode">Input Verification Code</Label>
                    <Input name="verificationCode" id="verificationCode" type="number" {...register("verificationCode", {
                        required: "Required",
                        value: verificationCode 
                    })} my={2} onChange={(e) => {
                    }} placeholder="e.g 000000" value={verificationCode} />
                    <Text variant='danger'>{errors.verificationCode && errors.verificationCode.message}</Text>
                </Box>
                <br />
                <Text as='p' variant="danger">*Note: Make sure to check your spam if mail does not appear in your inbox</Text>
                <br />
                <Flex sx={{
                    flexDirection: ['column', null, null, 'row'],
                    justifyContent: 'space-between',
                }}>
                 <Button type="submit">Verify</Button>
                </Flex>
            </Box>}

        </Box>


    )
}

export default SignUp
