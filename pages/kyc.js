import { Box, Heading, Button, Flex, Text, Spinner, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import api from '@/services/api'
import { handleSuccess, handleFailure } from '@/components/SweetAlert'
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import PullToRefresh from "react-simple-pull-to-refresh";
const KYC = ({ bank, name, num }) => {
    const router = useRouter()
    const { user, setReload, reload } = useAuth()
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)


    async function onSubmit(formData) {
        console.log(formData)
        if (formData.securityPassword != user?.securityPassword) {
            handleFailure('Failed', 'Incorrect Transaction Pin')
            return
        }
        if (user?.kycStatus == 'PENDING' || user?.kycStatus == 'ACCEPTED') {
            handleFailure('Details Sent Already', 'Kindly Await your approval')
            return
        }
        var kycFormData = new FormData()
        kycFormData.append('firstName', formData.firstName)
        kycFormData.append('lastName', formData.firstName)
        kycFormData.append('avatar', formData.face[0])
        kycFormData.append('coverImage', formData.id[0])
        kycFormData.append('mobileNumber', formData.mobile)
        kycFormData.append('kycStatus', 'PENDING')

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
                handleSuccess('Successful', 'KYC details sent, Note: it take 24 -72 hours for our team to review your application')
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
            {user?.kycStatus != 'ACCEPTED' && <Box sx={{
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
                <Text as={'h3'} variant={user?.kycStatus == 'REJECTED' ? 'danger':'normal'}>{user?.kycStatus == 'PENDING' ? 'Your Info has been submitted kindly await your verification' :user?.kycStatus == 'REJECTED' ?'Your Kyc was rejected, resubmit with correct detail or contact us for support': 'KYC Form'}</Text>

                <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                    textAlign: 'left',
                    label: {
                        mt: '10px'
                    }
                }}>
                    <Box>
                        <Label htmlFor="firstName">First Legal Name</Label>
                        <Input name="firstName" id="firstName" type="text" {...register("firstName", {
                            required: "Required",
                            value: user?.firstName
                        })} my={2} onChange={(e) => {
                        }} placeholder="First Name" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.firstName && errors.firstName.message}</Text>
                    </Box>
                    <Box>
                        <Label htmlFor="lastName">Last Legal Name</Label>
                        <Input name="lastName" id="lastName" type="text" {...register("lastName", {
                            required: "Required",
                            value:  user?.lastName
                        })} my={2} onChange={(e) => {
                        }} placeholder="Last Name" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.lastName && errors.lastName.message}</Text>
                    </Box>
                    <Box>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input name="mobile" id="mobile" type="tel" {...register("mobile", {
                            required: "Required",
                            value:  user?.mobileNumber
                        })} my={2} onChange={(e) => {
                        }} placeholder="+92XXXXXXXXX" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.mobile && errors.mobile.message}</Text>
                    </Box>
                    <Box>
                        <Label htmlFor="face">Upload a picture of your face</Label>
                        <Input name="face" id="face" type="file" {...register("face", {
                            required: "Required",
                        })} my={2} placeholder="Face" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.face && errors.face.message}</Text>
                    </Box>
                    <Box>
                        <Label htmlFor="id">Upload a valid picture of National ID/Drivers License or any other valid ID</Label>
                        <Input name="id" id="id" type="file" {...register("id", {
                            required: "Required",
                        })} my={2} onChange={(e) => {
                        }} placeholder="id" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.id && errors.id.message}</Text>
                    </Box>
                    <Box>
                        <Label htmlFor="securityPassword">Transaction Pin</Label>
                        <Input name="securityPassword" id="securityPassword" type="password" pattern="[0-9]*" {...register("securityPassword", {
                            required: "Required",
                        })} my={2} onChange={(e) => {
                        }} placeholder="Enter Transaction Pin" disabled={user?.kycStatus == 'PENDING'} />
                        <Text variant='danger'>{errors.securityPassword && errors.securityPassword.message}</Text>
                    </Box>
                    <br />
                    <Flex sx={{
                        flexDirection: ['column', null, null, 'row'],
                        justifyContent: 'space-between',
                    }}>
                        {user?.kycStatus != 'PENDING' && <Button type="submit">Submit</Button>}

                        {isSubmitting ? <Box>
                            <Spinner />
                        </Box> : null}
                    </Flex>
                </Box>

            </Box>}
            {user?.kycStatus == 'ACCEPTED' && <Box sx={{
                 width: '100vw',
                 height: '100vh',
                 background:'primary',
                 overflowY: 'scroll',
                 position:'relative',
                 p: '35px 15px',
                 m: 'auto',
                 color:'white',
                 textAlign: 'center',
            }}>
                <Heading sx={{
                    position:'absolute',
                    top:0,
                    bottom:0,
                    right:0,
                    left:0,
                    px:'20px',
                    height:'fit-content',
                    m:'auto'
                }}>Yay 🎉! KYC Has Been Approved Go Ahead, Recharge, Trade and Earn Passive Income</Heading>
            </Box>
            }

        </PullToRefresh>


    )
}

export default KYC