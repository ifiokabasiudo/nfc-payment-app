import { Box, Heading, Button, Flex, Text, Spinner, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import api from '@/services/api'
import { handleSuccess, handleFailure } from '@/components/SweetAlert'
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import PullToRefresh from "react-simple-pull-to-refresh";
const Setting = ({ bank, name, num }) => {
    const router = useRouter()
    const { user, setReload, reload } = useAuth()
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)


    async function onSubmit(formData) {
        console.log(formData)
        var kycFormData = new FormData()
        kycFormData.append('firstName', formData.firstName)
        kycFormData.append('lastName', formData.firstName)
        kycFormData.append('username', formData.username)
        kycFormData.append('mobileNumber', formData.mobile)

        setIsSubmitting(true)
        try {
            const res = await api({
                method: 'put',
                url: 'api/kyc',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: kycFormData
            })
            if (res.data.statuscode == 200) {
                setReload(!reload)
                handleSuccess('Update Successful', '')
                setIsSubmitting(false)
                setIsSubmitted(true)
            }

        } catch (error) {
            console.log(error)
            setIsSubmitting(false)
            if (error.response?.data) {
                handleFailure('Failed', error.response.data.message);
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
        <PullToRefresh onRefresh={async() => {
            setReload(!reload)
            return true
        }}>
        <Box sx={{
                width: '100vw',
                height: '100vh',
                overflowY: 'scroll',
                p: '35px 15px',
                m: 'auto',
                textAlign: 'center',
                borderRadius: '15px'
            }}>
                <br />
                <br />
                <Text as={'h3'} variant={user?.kycStatus == 'REJECTED' ? 'danger':'normal'}>{'Update Profile Info'}</Text>

                <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                    textAlign: 'left',
                    label: {
                        mt: '10px'
                    }
                }}>
                    <Box>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input name="firstName" id="firstName" type="text" {...register("firstName", {
                            required: "Required",
                            value: user?.firstName
                        })} my={2} onChange={(e) => {
                        }} placeholder="First Name" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.firstName && errors.firstName.message}</Text>
                    </Box>
                    <Box>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input name="lastName" id="lastName" type="text" {...register("lastName", {
                            required: "Required",
                            value: user?.lastName
                        })} my={2} onChange={(e) => {
                        }} placeholder="Last Name" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.lastName && errors.lastName.message}</Text>
                    </Box>
                    {user?.role == 'ADMIN' && <Box>
                        <Label htmlFor="username">Username</Label>
                        <Input name="username" id="username" type="text" {...register("username", {
                            required: "Required",
                            value: user?.username
                        })} my={2} onChange={(e) => {
                        }} placeholder="Username" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.username && errors.username.message}</Text>
                    </Box>}
                    <Box>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input name="mobile" id="mobile" type="tel" {...register("mobile", {
                            required: "Required",
                            value: user?.mobileNumber
                        })} my={2} onChange={(e) => {
                        }} placeholder="+92XXXXXXXXX" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.mobile && errors.mobile.message}</Text>
                    </Box>
                    <br />
                    <Flex sx={{
                        flexDirection: ['column', null, null, 'row'],
                        justifyContent: 'space-between',
                    }}>
                        {<Button type="submit">Update</Button>}

                        {isSubmitting ? <Box>
                            <Spinner />
                        </Box> : null}
                    </Flex>
                </Box>

            </Box>
        </PullToRefresh>


    )
}

export default Setting