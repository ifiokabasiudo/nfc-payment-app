import '@/styles/globals.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider } from 'theme-ui'
import theme from '@/theme'
import NavProvider from "@/contexts/nav";
import { AuthProvider, ProtectRoute } from '@/contexts/auth';
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from 'react';
import { FloatingWhatsApp } from '@/components/src/components/FloatingWhatsApp';
import api from '@/services/api';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

CapacitorUpdater.notifyAppReady();
CapacitorUpdater.addListener('majorAvailable', (info) => {
  console.log('majorAvailable was fired', info.version);
});
export default function App({ Component, pageProps }) {
  const [phone,setPhone] = useState()
  useEffect(() =>{
    async function setMobile(){
      try {
       const res = await api.get('api/account/wa')
       console.log(res.data)
        if(res?.data?.body?.mobileNumber){
          setPhone(res?.data?.body)
        }
      } catch (error) {
        console.log(error)
      }
    }
    setMobile()
    
    StatusBar.setStyle({ style: Style.Dark }).catch(()=>{});
    // Display content under transparent status bar (Android only)
    StatusBar.setOverlaysWebView({ overlay: true }).catch(()=>{});
  },[])
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ProtectRoute>
          <NavProvider>
            <NextNProgress
              height={4} color='white' />
            {/* <FloatingWhatsApp
              phoneNumber={phone?.mobileNumber}
              accountName={phone?.firstName}
              avatar={phone?.avatar}
              allowEsc
              allowClickAway
              notification
              notificationSound
            /> */}
            <Component {...pageProps} />
          </NavProvider>
        </ProtectRoute>
      </AuthProvider>
    </ThemeProvider>
  )
}
