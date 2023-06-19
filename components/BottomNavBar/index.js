import { Box, Flex, Text } from 'theme-ui'
import { useRouter } from 'next/router'

const BottomNav = ({ navContent, selected }) => {
    const router = useRouter()
    return (
        <Box sx={styles.box}>
            <Flex sx={styles.navFlex}>
                {navContent.map(({ icon, name }, i) => {
                    return (
                        <Box key={i} className={`nav-item ${selected == name ? 'selected' : 'not-selected'}`} onClick={() => {
                            router.replace({
                                query: { ...router.query, nav: name },
                            })
                        }}>
                            <Box>{icon}</Box>
                            <Text as={'p'}>{name}</Text>
                        </Box>
                    )
                })}
            </Flex>
        </Box>
    )
}

export default BottomNav

const styles = {
    box: {
        background:'white',
        position: 'fixed',
        bottom: 0,
        height:'10vh',
        boxShadow: '1px 2px 3px 1px #333',
        width: '100%',
        textAlign: 'center',
        zIndex: '1500'
    },
    navFlex: {
        '.nav-item': {
            width: '100%',
            py: '10px',
            p: {
                textTransform: 'capitalize'
            }
        },
        '.selected': {
            color: 'primary',
            svg: {
                path: {
                    fill: 'primary'
                }
            }
        }
    }
}