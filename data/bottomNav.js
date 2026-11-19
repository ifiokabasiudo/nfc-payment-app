import { Home, Buy, Profile } from '@/assets/icons'
import HomeFragment from '@/components/Home'
import CardsFragment from '@/components/Cards'
import ProfileFragment from '@/components/ProfileFragment'


const navContent = [
    {
        icon: <Home />,
        fragment:<HomeFragment />,
        name: 'home',
        default:true
    },
    {
        icon: <Buy />,
        fragment:<CardsFragment />,
        name: 'card',
    },
    {
        icon: <Profile />,
        fragment:<ProfileFragment />,
        name: 'profile',
    },
]

export default navContent