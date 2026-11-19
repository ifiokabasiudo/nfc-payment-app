import { Box, Image, Button, Flex, Text, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";

const Login = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const { changePassword } = useAuth();
    const router = useRouter()
    const resetToken =  router?.query?.token 
    const type =  router?.query?.type 
    //{ token, type, p1, p2 }
    async function onSubmit(formData) {
        changePassword({
            token: resetToken,
            type,
            p1:formData.p1,
            p2:formData.p2,
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
            <Text as={'p'}>{type == 'P' ? 'Change Password':'Change TX Passcode'} </Text>
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
                    <Label htmlFor="password">New Password</Label>
                    <Input name="password" id="password" type="password" {...register("p1", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Enter Password" />
                    <Text variant='danger'>{errors.p1 && errors.p1.message}</Text>
                </Box>
                <Box>
                    <Label htmlFor="password">Confirm Password</Label>
                    <Input name="password" id="p2" type="password" {...register("p2", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Enter Password" />
                    <Text variant='danger'>{errors.p2 && errors.p2.message}</Text>
                </Box>
                <br />
                <Button type="submit">Submit</Button>
            </Box>

        </Box>


    )
}

export default Login