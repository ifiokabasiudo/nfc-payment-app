/* eslint-disable react-hooks/exhaustive-deps */
import { useState, createContext, useContext, useEffect } from "react";
export const NavContext = createContext();
import { useRouter } from "next/router";
import navContent from '@/data/bottomNav'

// gives selected chain

export default function NavProvider({ children }) {
    const [navValue, setNavValue] = useState(navContent[0]);
    const router = useRouter()
    useEffect(() => {
        const localChain = localStorage.getItem('nav')
        const routerChain = router.query.nav;
        // is site for first time
        if (routerChain && routerChain != undefined && routerChain != 'undefined') {
            setNavData(getParticularFragment(routerChain))
        } else if (localChain && localChain != undefined && localChain != 'undefined') {
            setNavData(getParticularFragment(localChain))
        } else {
            setNavData(getDefaultFragment())
        }
    }, [router.query.nav])

    const setNavData = (value) => {
        localStorage.setItem('nav', value.name)
        setNavValue(value);
    };

    const getParticularFragment = (name) => {
        for (let i = 0; i < navContent.length; i++) {
            if (name && name == navContent[i].name) {
                return navContent[i]
            }
        }
    }
    const getDefaultFragment = () => {
        for (let i = 0; i < navContent.length; i++) {
            if (navContent[i].default) {
                return navContent[i]
            }
        }
    }

    return (
        <NavContext.Provider value={{ navContent, navValue }}>
            {children}
        </NavContext.Provider>
    );
}

export const useNavData = () => useContext(NavContext);