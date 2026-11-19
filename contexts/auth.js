// contexts/auth.js

import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Spinner } from 'theme-ui';
import { fromBn } from "evm-bn";
import tronWeb from '@/services/web3/tron';
//api here is an axios instance which has the baseURL set according to the env.
import api from '@/services/api';
// import tronWeb from '@/services/web3/tron';
import { handleFailure, handleSuccess } from '@/components/SweetAlert';
import { App as CapacitorApp } from '@capacitor/app';
import axios from 'axios';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false)
    const [triggered, setTriggered] = useState(false)
    const router = useRouter()

    useEffect(() => {
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
                CapacitorApp.exitApp();
            } else {
                window?.history.back();
            }
        });
        async function loadUserFromCookies() {
            setLoading(true)

            const token = Cookies.get('token')
            if (token) {
                try {
                    console.log("Got a token in the cookies, let's see if it is valid")
                    api.defaults.headers.Authorization = `Bearer ${token}`
                    const account = await api.get('api/account/myprofile', {
                        params: {
                            contract_address: process.env.NEXT_PUBLIC_TRON_USDT
                        }
                    })
                    if (account?.data?.body) {
                        console.log(account?.data?.body)
                        setUser(account?.data?.body)
                        console.log(account?.data?.body)
                        //if (!triggered) {
                        //console.log('trigger')
                        try {
                            await tronEvent(account?.data?.body)

                        } catch (error) {
                            console.log(error)
                        }
                        //  setTriggered(true)
                        //}
                        if (router.pathname == '/login' || router.pathname == '/signup' || router.pathname == '/recovery') {
                            router.push('/', {
                                query: { ...router.query }
                            })
                        }
                    }
                } catch (error) {
                    if (error.response?.data) {
                        handleFailure('Failed', error.response.data.message);
                    } else {
                        if (error.reason) {
                            handleFailure(error.reason);
                        } else {
                            handleFailure(error.message);
                        }
                    }
                    if (router.pathname != '/login' || router.pathname != '/signup' || router.pathname != '/recovery') {
                        router.push('/login')
                    }
                }

            } else {
                if (router.pathname != '/login' || router.pathname != '/signup' || router.pathname != '/recovery') {
                    router.push('/login')
                }
            }
            setLoading(false)
        }
        async function tronEvent(user) {
            const trc20ContractAddress = process.env.NEXT_PUBLIC_TRON_USDT
            let contract = await tronWeb.contract().at(trc20ContractAddress);
            const time = new Date(user?.createdAt)

            console.log(time.getTime())

            await contract && contract.Transfer().watch({ filters: { "_address": tronWeb.address.toHex(user?.address) } }, async (err, event) => {
                if (err)
                    return console.error('Error with "Message" event:', err);
                const result = event.result
                const from = tronWeb.address.fromHex(result.from);
                const to = tronWeb.address.fromHex(result.to);
                //console.group('Depositor');
                if (user?.address == to) {
                    console.group('New event received');
                    const amount = fromBn(result.value, 6)

                    try {
                        await api.put('api/account/deposit', {
                            amount,
                            tx: event.transaction,
                            from,
                            to,
                            event
                        })
                        handleSuccess('Deposit Successful', 'Amount in USDT ' + amount)
                        setReload(!reload)
                    } catch (error) {
                        console.log(error)
                    }
                    console.log('- Amount:', amount);
                    console.log('- Transaction:', event.transaction);
                    console.log('- From:', from);
                    console.log('- To:', to);
                    console.log('- Event:', event);
                    console.groupEnd();
                }
            });

            const es = await axios.get(`${process.env.NEXT_PUBLIC_TRON_PROVIDER}v1/accounts/${user?.address}/transactions/trc20?&contract_address=${trc20ContractAddress}`)
            console.log(es?.data?.data)
            const txs = es?.data?.data
            for (let i = 0; i < txs.length; i++) {
                const amount = fromBn(txs[i].value, 6)
                const from = txs[i].from
                const to = txs[i].to
                if (user?.address == to) {

                    try {
                        await api.put('api/account/deposit', {
                            amount,
                            tx: txs[i].transaction_id,
                            from,
                            to,
                            event: txs[i]
                        })
                        handleSuccess('Deposit Successful', 'Amount in USDT ' + amount)
                    } catch (error) {
                        //console.log(error)
                    }
                }
            }
        }
        console.log(router)
        if(router.pathname != '/reset' && router.pathname != '/verify'){
            loadUserFromCookies()
        }
    }, [reload])

    const login = async ({ email, password }) => {
        console.log(email, password)
        try {
            setLoading(true)
            const res = await api.post('api/auth/login', { email, password })
            let accessToken = res?.data?.body?.accessToken
            console.log(accessToken)
            if (accessToken) {
                Cookies.set('token', accessToken, { expires: 60 })
                api.defaults.headers.Authorization = `Bearer ${accessToken}`
                const account = await api.get('api/account/myprofile', {
                    params: {
                        contract_address: process.env.NEXT_PUBLIC_TRON_USDT
                    }
                })
                setUser(account?.data?.body)
                router.push('/?nav=home')
                handleSuccess('Login Successful', 'Welcome')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

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
    }

    const reset = async ({ email, type }) => {
        console.log(email, type)
        try {
            setLoading(true)
            const res = await api.put('api/auth/reset-account-password?type=' + type, { email })
            if (res.data.statuscode == 200) {
                handleSuccess('Reset Email sent', 'Kindly check your email or spam to reset your password')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

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
    }

    const changePassword = async ({ token, type, p1, p2 }) => {
        try {
            setLoading(true)
            const res = await api.put('api/auth/resetpassword-changepassword?type=' + type, {
                resetPasswordToken: token,
                newPassword: p1,
                confirmPassword: p2
            })
            if (res.data.statuscode == 200) {
                handleSuccess('Password Changed', 'Use your new password')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

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
    }


    const verify = async ({ email, verificationCode }) => {
        try {
            setLoading(true)
            const res = await api.post('api/auth/verifyaccount', { email, verificationCode })
            let accessToken = res?.data?.body?.accessToken
            if (accessToken) {
                console.log("Got token")
                Cookies.set('token', accessToken, { expires: 60 })
                api.defaults.headers.Authorization = `Bearer ${accessToken}`
                const account = await api.get('api/account/myprofile', {
                    params: {
                        contract_address: process.env.NEXT_PUBLIC_TRON_USDT
                    }
                })
                setUser(account?.data?.body)
                router.push('/?nav=home')
                handleSuccess('Verification Successful', 'Welcome')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

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

    }

    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        delete api.defaults.headers.Authorization
        router.push('/login')
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user,changePassword, setReload, setLoading, reload, user, reset, verify, login, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// contexts/auth.js
// append this new bit a the end: 

export const ProtectRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter()
    if (loading && !isAuthenticated ) {
        return <Spinner sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            m: 'auto',
            width: '80px',
            height: '80px'
        }} />;
    }
    return children;
};

export const useAuth = () => useContext(AuthContext)
