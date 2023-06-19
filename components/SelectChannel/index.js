import { Box, Flex, Heading, Text, Image, Input, Button } from "theme-ui"
import api from "@/services/api"
import Link from "next/link"
const ChannelsSheet = ({ user,setBottomSheet, setChannel }) => {
    return (
        <>
            <Box sx={styles.box}>
                <Heading>Select Channel</Heading>
                <br />
                {!user?.channels || user?.channels.length <= 0 && <Text variant="danger" sx={{
                    textAlign:'center',
                    mx:'auto',
                    my:'20px',
                    a:{
                        textDecoration:'none'
                    },
                    span:{
                    color:'primary'
                }}}>You have no channels <Link href={'/cc'}><span>click to add </span></Link> </Text> }
                {user?.channels.map((data, i) => {
                    return (
                        <>
                            <Box key={i} sx={styles.flex} onClick={() => {
                                setChannel(data)
                                setBottomSheet(false)
                                api.put('api/account/myprofile', {
                                    selectedChannel: data._id
                                  }).then(() => {
                                    console.log('Good')
                                  }).catch((error) => {
                                    console.log(error)
                                    setChannel(null)
                                  })
                            }}>
                                <Text as={'p'}>{data.accountName}</Text>
                                <Text as={'p'}>{data.accountNumber}</Text>
                                <Text as={'p'}>{data.bankName}</Text>
                            </Box>
                            <hr />
                        </>)

                })}
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

export default ChannelsSheet

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