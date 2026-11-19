import { Box, Spinner, Flex, Label, Heading, Text, Image, Input, Button } from "theme-ui"
import { useForm } from "react-hook-form";
import { handleFailure, handleSuccess } from "../SweetAlert";
import { useState } from "react";
import { numberWithCommas } from "@/functions";
import api from "@/services/api";

const Sheet = ({ setBottomSheet, bottomSheet, user, reset }) => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { orderId, amount, ccImg } = bottomSheet

    async function onSubmit(formData) {
        if (formData.securityPassword != user?.securityPassword) {
            handleFailure('Failed', 'Incorrect Transaction Pin')
            return
        }

        console.log(formData)
        setIsSubmitting(true)
        try {
            const res = await api.put('api/account/recharge', {
                orderId,
                status: 'ACTIVE'
            })
            if (res.data.statuscode == 200) {
                setBottomSheet(false)
                handleSuccess('Added Successfully')
                setIsSubmitting(false)
                setIsSubmitted(true)
                //router.back()
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
        //setIsSubmitting(false)
    }

    const buyData = [
        {
            title: 'Order Id',
            value: orderId,
        },
        {
            title: 'Amount',
            value: numberWithCommas(amount) + ' NGN',
        },
        {
            title: 'Commission',
            value: numberWithCommas(2 / 100 * Number(amount)) + 'NGN ~' + numberWithCommas(2.5 / 100 * Number(amount)) + ' NGN',
        },
        {
            title: 'Collection Channel',
            value: ccImg,
        },
    ]
    return (
        <>
            <Box sx={styles.box}>
                <Text sx={{
                    position: 'absolute',
                    right: 0,
                    fontWeight: 'bold',
                    fontSize: '20px',
                    mr: '15px'
                }} onClick={() => {
                    setBottomSheet(false)
                }}>X</Text>
                <Heading>Confirm Buy</Heading>
                <br />
                {buyData.map(({ title, value }, i) => {
                    return title == 'Collection Channel' ? (
                        <>
                            <Flex key={i} sx={styles.flex}>
                                <Text as={'p'}>{title + ': '}</Text>
                                <Image src={value} alt="CC" width={30} height={30} />
                            </Flex>
                            <hr />
                        </>
                    ) : (
                        <>
                            <Flex key={i} sx={styles.flex}>
                                <Text as={'p'}>{title + ': '}</Text>
                                <Text as={'p'}>{value}</Text>
                            </Flex>
                            <hr />
                        </>
                    )
                })}
                <Box as='form' onSubmit={handleSubmit(onSubmit)} >
                    <Box>
                        <Flex sx={{
                            justifyContent: 'space-between',
                            mb: '5px'
                        }}>
                            <Text as={'p'}>Security Passcode</Text>
                            <Text as={'p'} variant="danger" onClick={() => {
                                reset({ email: user?.email, type: 'S' })
                            }}>Forgot Password</Text>
                        </Flex>
                        <Input name="securityPassword" id="securityPassword" type="password" pattern="[0-9]*" {...register("securityPassword", {
                            required: "Required",
                        })} my={2} onChange={(e) => {
                        }} placeholder="Enter Security Pass Code" />
                        <Text variant='danger' as={'p'} sx={{
                            textAlign: 'left',
                            mb: '10px'
                        }}>{errors.securityPassword && errors.securityPassword.message}</Text>
                    </Box>
                    {!isSubmitting && !isSubmitted ? <Button type="submit">Confirm Buy</Button>
                        : null}
                    {isSubmitting ? <Box>
                        <Spinner />
                    </Box> : null}
                </Box>

            </Box>
            <Box sx={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                zIndex: '999',
                background: '#000',
                opacity: '0.4'
            }} onClick={() => {
                setBottomSheet(false)
            }} />
        </>

    )
}

export default Sheet

const styles = {
    flex: {
        justifyContent: 'space-between',
        p: {
            fontWeight: 'bold'
        }
    },
    box: {
        textAlign: 'center',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        zIndex: '1000',
        overflowX: 'hidden',
        boxShadow: '5px 2px 5px 5px #33333330',
        background: 'white',
        p: '15px 10px',
        hr: {
            my: '10px'
        },
        borderRadius: '15px 15px 0 0',
        button: {
            width: '100%'
        }
    }
}