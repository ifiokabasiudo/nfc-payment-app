import { Box, Text, Heading, Button } from "theme-ui"
import { Plus } from "react-feather"
import Account from '@/components/AccountCard'
import { useRouter } from "next/router";
/*import { useEffect, useState } from "react";
import { handleFailure, handleSuccess } from "@/components/SweetAlert";
import api from "@/services/api";*/
import PullToRefresh from "react-simple-pull-to-refresh";
import { useAuth } from "@/contexts/auth";

const CollectionChannel = () => {
    const { user, reload, setReload } = useAuth()
    const router = useRouter()
    const channels = user?.channels

    /*async function getChannels() {
        try {
            const account = await api.get('api/cc')
            console.log(account)
            if (account?.data?.body?.data) {
                setChannels(account?.data?.body.data)
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
        }
    }*/
    return (
        <Box sx={styles.layout}>
            <Heading>Collection Channels</Heading>
            <PullToRefresh onRefresh={async () => {
                setReload(!reload)
                return
            }}>
                <Box sx={styles.container}>

                    {channels?.map((data, i) => {
                        return (
                            <Account {...data} key={i} />
                        )
                    })}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </Box>
            </PullToRefresh>

            <Button onClick={() => router.push('/addcc')}><Plus />&nbsp;&nbsp;<Text as={'p'}>Add Account</Text> </Button>
        </Box>
    )
}

export default CollectionChannel

const styles = {
    layout: {
        background: 'primaryGrad',
        width: '100vw',
        height: '100vh',
        overflowY: 'hidden',
        color: 'white',
        textAlign: 'center',
        p: '35px 15px',
        button: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            zIndex: 100,
            right: '0',
            mx: '20px',
            mb: '20px',
            boxShadow: '1px 1px 6px 3px #56144160',
            width: 'auto',
            background: 'white',
            color: 'primary',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            p: {
                my: 'auto'
            }
        }
    },
    container: {
        overflowY: 'scroll',
        height: '100%',
    },
}