import { Box, Image, Button, Flex, Text, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";

const Login = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const { reset } = useAuth();
    const router = useRouter()
    async function onSubmit(formData) {
        reset({email:formData.email,type:'P'})
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
            <Text as={'p'}>Forgot Password? </Text>
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
                    <Label htmlFor="email">Email Address</Label>
                    <Input name="email" id="email" type="email" {...register("email", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="john@gmail.com" />
                    <Text variant='danger'>{errors.email && errors.email.message}</Text>
                </Box>
                <br />
                <Button type="submit">Submit</Button>
            </Box>
            <br />
            <Flex sx={{
                justifyContent: 'space-between',
                a: {
                    textDecoration: 'none',
                    color: 'primary',
                    fontSize: '15px'
                }
            }}>
                <Link href={'/login'}>Sign In</Link>
                <Link href={'/signup'}>Sign Up</Link>
            </Flex>

        </Box>


    )
}

export default Login