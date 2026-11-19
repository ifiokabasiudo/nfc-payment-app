import { Box, Select, Button, Flex, Text, Spinner, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import api from '@/services/api'
import { handleSuccess, handleFailure } from '@/components/SweetAlert'
import { useState } from "react";
import { useRouter } from "next/router";
import { banks } from "@/data/banks";
import { useAuth } from "@/contexts/auth";
const SignUp = ({ bank, name,num }) => {
    const router = useRouter()
    const {user,reload,setReload} = useAuth()
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    async function onSubmit(formData) {
        if (user?.kycStatus != 'ACCEPTED') {
            handleFailure('Not KYC-ed!', 'Kindly Complete your KYC')
            if (user?.kycStatus == 'PENDING') {
                handleFailure('KYC Details Sent!', 'Kindly Await Approval, it takes 24 - 72 hours for our team to review your application')
            } else {
                router.push('/kyc')
            }
            return
        }
        if(formData.securityPassword != user?.securityPassword){
            handleFailure('Failed','Incorrect Transaction Pin')
            return
        }
        formData.uid = user?.uid
        for(let i = 0; i<  banks.length;i++){
            if(formData.bankName == banks[i].name){
                formData.bankLogoUrl = banks[i].logo
                break
            }
        }
        formData.uid = user?.uid
        console.log(formData)
        setIsSubmitting(true)
        try {
            const res = await api.post('api/cc', formData)
            if (res.data.statuscode == 200) {
                setReload(!reload)
                handleSuccess('Added Successfully')
                setIsSubmitting(false)
                setIsSubmitted(true)
                router.back()
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
        <Box sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            p: '35px 15px',
            m: 'auto',
            textAlign: 'center',
            borderRadius: '15px'
        }}>
            <br />
            <br />
            <Text as={'h3'}>Add Collection Channel</Text>

          <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                textAlign: 'left',
                label: {
                    mt: '10px'
                }
            }}>
                <Box>
                    <Label htmlFor="bank">Select Banks</Label>
                    <Select name="bank" id="bank" type="select"
                        {...register("bankName", {
                            required: "Required",
                            value: bank
                        })} my={2}>
                        {banks.map((data, i) => {
                            return (
                                <option value={data.name} key={i}>{data.name}</option>
                            )
                        })}
                    </Select>

                    <Text variant='danger'>{errors.bankName && errors.bankName.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="name">Bank Account Name</Label>
                    <Input name="name" id="name" type="text" {...register("accountName", {
                        required: "Required",
                        value: name
                    })} my={2} onChange={(e) => {
                    }} placeholder="Account Name" />
                    <Text variant='danger'>{errors.accountName && errors.accountName.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="num">Account Number</Label>
                    <Input name="num" id="num" type="number" {...register("accountNumber", {
                        required: "Required",
                        value: num
                    })} my={2} onChange={(e) => {
                    }} placeholder="Your Account Number" />
                    <Text variant='danger'>{errors.accountNumber && errors.accountNumber.message}</Text>
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
                    {!isSubmitting && !isSubmitted ? <Button type="submit">Submit</Button>
                        : null}
                    {isSubmitting ? <Box>
                        <Spinner />
                    </Box> : null}
                </Flex>
            </Box>

        </Box>


    )
}

export default SignUp