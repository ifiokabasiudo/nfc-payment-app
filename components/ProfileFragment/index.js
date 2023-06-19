import { Box, Text, Flex, Heading } from "theme-ui"
import { Copy, LogOut, Settings, Aperture, Compass, RefreshCw, Watch, ArrowRight } from 'react-feather'
import { useAuth } from '@/contexts/auth'
import { useRouter } from "next/router"
import { copy } from "@/functions"
import { MdAccountBalanceWallet } from 'react-icons/md'
import { BsPersonCheck, BsDatabaseAdd } from 'react-icons/bs'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { BiReset } from "react-icons/bi"
import { HiGift, HiOutlineCollection } from 'react-icons/hi'
import { CiWallet, CiImport, CiGift } from 'react-icons/ci'
import { numberWithCommas } from "@/functions"
import { handleFailure, handleSuccess } from "../SweetAlert"
import PullToRefresh from 'react-simple-pull-to-refresh'
import Link from "next/link"
import { useEffect } from "react"
const menu = [
  {
    icon: <CiImport size={24} />,
    text: 'Deposits',
    link: '/deposits'
  },
  {
    icon: <BsPersonCheck size={24} />,
    text: 'Upgrade To Merchant',
    link: '/kyc'
  }
]
const Fragment = () => {
  const { logout, user, reset, setReload, reload } = useAuth()
  const router = useRouter()
  useEffect(() => {
    setReload(!reload)
  }, [])
  const handleCopy = async () => {
    try {
      await copy(user?.uid)
      handleSuccess('Copied')
    } catch (error) {
      handleFailure('Unsupported', error.message)
    }
  }
  return (
    <Box sx={styles.layout}>
      <br />
      <br />
      <br />
      <Flex sx={{
        justifyContent: 'space-between'
      }}>
        <Box sx={{
          mt: '5px',
          h3: {
            mb: '5px'
          }
        }}>
          <Text as={'h3'}>{'@' + user?.username}</Text>
          <Text as={'h4'} onClick={handleCopy}>UID: {user?.uid} &nbsp;<Copy size={20} /></Text>
        </Box>
        <Box>
          <Settings onClick={() => {
            router.push('/setting')
          }} />
        </Box>
      </Flex>
      <br />
      <Flex sx={{
        justifyContent: 'space-between',
        fontSize: '12px'
      }}>
        <Text as={'p'}>{user?.role}</Text>
        <Text as={'p'}>KYC Status: <Text variant={user?.kycStatus}>{user?.kycStatus}</Text></Text>

      </Flex>
      <br />
      <PullToRefresh onRefresh={async () => {
        setReload(!reload)
        return true
      }}>
        <Box sx={styles.container}>
          <Flex>

            <Box sx={styles.boxes}>
              <Link href={'/deposits'}>

                <Flex sx={{
                  justifyContent: 'space-between'
                }}>
                  <Flex className="flex">
                    <MdAccountBalanceWallet size={30} />
                    &nbsp;
                    &nbsp;
                    <Text as={'p'} sx={{
                      fontSize: '12px'
                    }}>Balance</Text>
                  </Flex>
                </Flex>

                <Heading>{user?.balance ? numberWithCommas(user?.balance) : '0.000'}</Heading>
                <Text as={'p'} sx={{
                  fontSize: '11px'
                }}>NGN</Text>
              </Link>

            </Box>


            <Box sx={styles.boxes}>
              <Link href={'/commissions'}>
                <Flex className="flex">
                  <HiGift size={30} />
                  &nbsp;
                  &nbsp;
                  <Text as={'p'} sx={{
                    fontSize: '12px'
                  }}>Commission</Text>
                </Flex>
                <Heading>{user?.commission ? numberWithCommas(user?.commission) : '0.000'}</Heading>
                <Text as={'p'} sx={{
                  fontSize: '11px'
                }}>NGN</Text>
              </Link>
            </Box>
          </Flex>

          <Box sx={{
            hr: {
              opacity: '0.3 !important',
              mx: '25px'
            }
          }}>
            {user?.role == 'ADMIN' &&
              <>
                <Link href={'/recharge'}>
                  <Box >
                    <Flex sx={{
                      justifyContent: 'space-between',
                      m: '25px 10px',
                      svg: {
                        opacity: '0.8'
                      }

                    }}>
                      <Flex>
                        <BsDatabaseAdd size={24} />&nbsp;&nbsp;
                        <Text>{'Recharge'}</Text>
                      </Flex>
                      <ArrowRight />
                    </Flex>
                    <hr />
                  </Box>
                </Link>
                <Link href={'/withdraw'}>
                  <Box >
                    <Flex sx={{
                      justifyContent: 'space-between',
                      m: '25px 10px',
                      svg: {
                        opacity: '0.8'
                      }

                    }}>
                      <Flex>
                        <BiMoneyWithdraw size={24} />&nbsp;&nbsp;
                        <Text>{'Withdraw'}</Text>
                      </Flex>
                      <ArrowRight />
                    </Flex>
                    <hr />
                  </Box>
                </Link>
              </>
            }
            {menu.map(({ icon, text, link }, i) => {
              return (
                <Link key={i} href={link}>
                  <Box >
                    <Flex sx={{
                      justifyContent: 'space-between',
                      m: '25px 10px',
                      svg: {
                        opacity: '0.8'
                      }

                    }}>
                      <Flex>
                        {icon}&nbsp;&nbsp;
                        <Text>{text}</Text>
                      </Flex>
                      <ArrowRight />
                    </Flex>
                    <hr />
                  </Box>
                </Link>
              )
            })}
            <Box onClick={() => {
              reset({ email: user?.email, type: 'S' })
            }}>
              <Flex sx={{
                justifyContent: 'space-between',
                m: '25px 10px',
                svg: {
                  opacity: '0.8'
                }

              }}>
                <Flex>
                  <BiReset size={24} />&nbsp;&nbsp;
                  <Text>{'Reset Security Passcode'}</Text>
                </Flex>
                <ArrowRight />
              </Flex>
              <hr />
            </Box>
            <Box onClick={logout}>
              <Flex sx={{
                justifyContent: 'space-between',
                m: '25px 10px',
                svg: {
                  opacity: '0.8'
                }

              }}>
                <Flex>
                  <LogOut size={24} />&nbsp;&nbsp;
                  <Text>{'Log out'}</Text>
                </Flex>
                <ArrowRight />
              </Flex>
              <hr />
            </Box>
            <br />
            <br />
            <br />
            <br />
            <br />
          </Box>

        </Box>
      </PullToRefresh>
    </Box>
  )
}

export default Fragment

const styles = {
  boxes: {
    width: '100%',
    m: '5px',
    display:'none',
    p: '15px 10px',
    borderRadius: '10px',
    boxShadow: '1px 2px 5px 2px #33333320',
    '.flex': {

    },
    h2: {
      mt: '10px',
      color: 'primary'
    }
  },
  layout: {
    height: 'inherit',
    width: '100%',
    color: 'white',
    p: '15px 15px',
    position: 'absolute',
    background: 'primaryGrad'
  },
  container: {
    overflowY: 'scroll',
    height: '100%',
    a: {
      textDecoration: 'none',
      color: 'text'
    },
    color: 'text',
    p: '5px',
    background: 'white',
    borderRadius: '15px 15px 0 0'
  },
}