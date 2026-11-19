import BuyCard from '@/components/DepositCard'
import { Box, Text, Flex } from 'theme-ui'
import { Filter } from 'react-feather'
import BottomSheet from '@/components/BottomSheet'
import { useAuth } from '@/contexts/auth'
import { useState } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'
const Fragment = () => {
    const { user, setReload, reload } = useAuth()
    const [bottomSheet, setBottomSheet] = useState(false)
    return (
        <Box sx={styles.buyLayout}>
            {bottomSheet && <BottomSheet setBottomSheet={setBottomSheet} />}
            <Flex sx={styles.flex}>
                <Text as={'p'}>All Deposits</Text>
                <Box>
                    <Text as={'p'}>&nbsp;<Filter /></Text>
                </Box>
            </Flex>
            <PullToRefresh onRefresh={async () => {
                setReload(!reload)
                return true
            }}>
                <Box sx={styles.buyContainer}>
                    {user?.deposits?.map((data, i) => {
                        return (
                            <BuyCard key={i} {...data} setBottomSheet={setBottomSheet} />
                        )
                    })}

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </Box>
            </PullToRefresh>
        </Box>
    )
}

export default Fragment

const styles = {
    flex: {
        justifyContent: 'space-between',
        p: '25px 15px',
        color: 'white',
        svg: {
            fill: 'white'
        }
    },
    buyLayout: {
        height: 'inherit',
        width: '100%',
        height: '100vh',
        overflowY: 'hidden',
        position: 'absolute',
        background: 'primaryGrad'
    },
    buyContainer: {
        overflowY: 'scroll',
        height: '100%',
        pt: '20px',
        background: 'white',
        borderRadius: '15px 15px 0 0'
    },
}