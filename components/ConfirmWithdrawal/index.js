import { Box, Flex, Heading, Text, Image, Input, Button } from "theme-ui"
import { useForm } from "react-hook-form";
import { handleFailure } from "../SweetAlert";
import { useState } from "react";

const ConfirmPayment = ({ setBottomSheet, user,reset, handleConfirm }) => {
    const { handleSubmit, register, formState: { errors }, setError,setValue } = useForm();
    async function onSubmit(formData) {
        if (formData.password != user?.securityPassword) {
            handleFailure('Failed', 'Incorrect Transaction Pin')
            return
        }
        if (Number(user?.balanceUSDT) < formData.amount) {
            handleFailure('Failed', 'Invalid amount')
            return
        }
        handleConfirm(formData)
        setBottomSheet(false)
        //login(formData)
    }

    //
    return (
        <>
            <Box sx={styles.box} as='form' onSubmit={handleSubmit(onSubmit)} noValidate>
                <Text sx={{
                    position: 'absolute',
                    right: 0,
                    fontWeight: 'bold',
                    fontSize: '20px',
                    mr: '15px'
                }} onClick={() => {
                    setBottomSheet(false)
                }}>X</Text>
                <Heading>Confirm Withdrawal</Heading>
                <br />
                <Flex sx={styles.flex}>
                    <Text as={'p'}>USDT Balance:</Text>
                    <Text as={'p'} variant="ACCEPTED">{user?.balanceUSDT}</Text>
                </Flex>
                <br />
                <Flex sx={styles.flex}>
                    <Text as={'p'}>Amount</Text>
                    <Text as={'p'} variant="danger" onClick={()=>{
                        setValue('amount',user?.balanceUSDT)
                    }}>Max</Text>
                </Flex>
                <Input name="amount" id="amount" type="number" {...register("amount", {
                    required: "Required",
                })} my={2} onChange={(e) => {
                }} placeholder="Amount (USDT)" />
                <Text variant='danger'>{errors.amount && errors.amount.message}</Text>
                <br />
                <Flex sx={styles.flex}>
                    <Text as={'p'}>TRC20 Withdrawal Address</Text>
                    <Text as={'p'} variant="danger"></Text>
                </Flex>
                <Input name="address" id="address" type="text" {...register("address", {
                    required: "Required",
                })} my={2} onChange={(e) => {
                }} placeholder="Address" />
                <Text variant='danger'>{errors.address && errors.address.message}</Text>
                <br />

                <Flex sx={styles.flex}>
                    <Text as={'p'}>Security Passcode</Text>
                    <Text as={'p'} variant="danger" onClick={()=>{
                        reset({email:user?.email,type:'S'})
                    }}>Forgot Password</Text>
                </Flex>
                <Input name="password" id="password" type="password" {...register("password", {
                    required: "Required",
                })} my={2} onChange={(e) => {
                }} placeholder="Passcode" />
                <Text variant='danger'>{errors.password && errors.password.message}</Text>
                <br />
                <br />

                <Button type="submit">Place Withdrawal</Button>
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

export default ConfirmPayment

const styles = {
    flex: {
        justifyContent: 'space-between',
        p: {
            fontWeight: 'bold'
        }
    },
    box: {
        textAlign: 'left',
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