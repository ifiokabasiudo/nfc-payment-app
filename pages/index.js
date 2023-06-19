import BottomNavBar from '@/components/BottomNavBar'
import { Box } from 'theme-ui'
import { useNavData } from '@/contexts/nav'
export default function Dashboard() {
  const { navContent, navValue } = useNavData()
  return (
    <>
      <Box sx={styles.fragment}>
        {navValue.fragment}
      </Box>
      <BottomNavBar navContent={navContent} selected={navValue.name} />
    </>
  )
}

const styles = {
  fragment: {
    background: 'white',
    height: '90vh',
    overflowY: 'scroll'
  }
}
