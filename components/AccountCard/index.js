import { Box, Flex, Image, Heading, Text } from "theme-ui"
import { ArrowRight, Delete } from "react-feather"
import { useAuth } from "@/contexts/auth"
import api from "@/services/api"
import { handleFailure,handleSuccess } from "../SweetAlert"

const Card = ({ accountName, accountNumber, bankName, bankLogoUrl,_id }) => {
    const {user,reload,setReload} = useAuth()
    return (
        <Box sx={{
            width: '100%',
            background: 'white',
            borderRadius: '15px',
            p: '15px 15px',
            my: '15px',
            color: 'text',
            boxShadow: '1px 2px 5px 3px #FFFFFF30',
            textAlign: 'left',
            img: {
                width: '40px',
                height: '40px',
            }
        }}>
            <Flex>
                <Image src={bankLogoUrl} alt="logo" width={40} height={40} />
                <Box sx={{
                    width: '100%',
                    mx: '8px'
                }}>
                    <Heading as={'h3'}>{accountName}</Heading>
                    <br />
                    <Text as={'p'}>{bankName}</Text>
                    <br />
                    <Flex sx={{
                        justifyContent: 'space-between'
                    }}>
                        <Text as={'p'}>{accountNumber}</Text>
                        <Delete onClick={async()=>{
                            if(user?.selectedChannel == _id){
                                handleFailure('Failed','Unselect Channel to delete');
                            }
                             try {
                                const res = await api.delete('api/cc', {
                                    data:{
                                        _id
                                    }
                                })
                                if (res.data.statuscode == 200) {
                                    setReload(!reload)
                                    handleSuccess('Delete Successfully')
                                }
                    
                            } catch (error) {
                                console.log(error)
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
                        }}/>
                    </Flex>
                </Box>
                <ArrowRight size={30} />
            </Flex>
        </Box>
    )
}

export default Card