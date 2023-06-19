import { Box, Image, Button, Flex, Text, Label, Input } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";

const Login = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const { login } = useAuth();
    const router = useRouter()
    async function onSubmit(formData) {
        login(formData)
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
                <Box>
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" id="password" type="password" {...register("password", {
                        required: "Required",
                    })} my={2} onChange={(e) => {
                    }} placeholder="Enter Password" />
                    <Text variant='danger'>{errors.password && errors.password.message}</Text>
                </Box>
                <br />
                <Button type="submit">Sign In</Button>
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
                <Link href={'/recovery'}>Forgot Password</Link>
                <Link href={'/signup'}>Sign Up</Link>
            </Flex>

        </Box>


    )
}

export default Login