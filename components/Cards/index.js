import { Box, Container, Flex, Button, Image, Heading, Text } from "theme-ui"
import { useState } from "react"
import Slider from "react-slick"
import { useAuth } from "@/contexts/auth";
import { Copy } from 'react-feather'
import { copy } from "@/functions"

const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: false,
  //autoplay: true,
  //autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 1,
};

const CardsFragment = () => {
  //const [status, setStatus] = useState('VIRTUAL')
  const { user } = useAuth()
  const handleCopy = async () => {
    try {
      await copy(user?.uid)
      handleSuccess('Copied')
    } catch (error) {
      handleFailure('Unsupported', error.message)
    }
  }

  return (
    <Box>
      <Box sx={{
        background: 'primary',
        pt: '40px',
        width: '100%',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        color: 'white'
      }}>
        <Container>
          <Flex sx={{
            position: 'relative',
            zIndex: '2',
            pt: '20px',
            justifyContent: 'space-between'
          }}>
            <Flex sx={{
              h3: {
                fontWeight: '450',
                my: 'auto',
                ml: '10px'
              }
            }}>
              <Text as='h3'>Your {user?.role == 'MERCHANT'?'Device':'Card'}</Text>
            </Flex>
            <Box sx={{
              background: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 9px 50px rgba(0,0, 0, 0.6)',
              borderRadius: '50%',
              height: '30px',
              width: '30px',
              color: 'primary',
              textAlign: 'center',
              p: {
                m: 'auto',
              },
            }}>
              <Text as={'p'} sx={{
                right: '11px',
                fontWeight: '700',
                transform: 'scale(2)'
              }}>+</Text>
            </Box>
          </Flex>
          <br />
          <br />
          <br />
          <Heading>You can check your {user?.role == 'MERCHANT'?'device details':'card'} here.</Heading>
        </Container>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Box>
      <Box sx={{
        mt: '-80px',
        '.slick-list': {
        },
        '.slick-slide': {
          // ml:'-170px',
          // width: ['fit-content !important',null,null,'fit-content !important'],
        },
        '.slick-active': {

        },

      }}>
        <Slider {...sliderSettings}>
          <Box>
            <Box sx={{
              boxShadow: '0px 9px 49px rgba(89, 136, 248, 0.2)',
              borderRadius: '10px',
              mx: 'auto',
              width: '90%',
              maxWidth: '305px',
              background: 'linear-gradient(176.59deg, #02A75A -11.96%, #561441 106.3%)',
              height: '190px',
              display: 'block !important',
              py: '30px',
              px: '12px',
              mb: '10px',
              color: 'white',
              hr: {
                height: '3px',
                background: 'white',
                my: '10px',
                border: 'none'
              },
              h2: {
                my: '0px'
              }
            }}>
              <Flex sx={{
                justifyContent: 'space-between',
              }}>
                <Flex>
                  <Text as='p' sx={{
                    fontSize: '12px',
                    fontWeight: '450'
                  }}>{user?.role == 'MERCHANT'?'Device':'Card'} Number</Text>
                </Flex>
              </Flex>
              <Box sx={{
                my: '5px'
              }}>
                <Text as='h3' onClick={handleCopy}><span>{user?.uid?.toString().replace(/\d{5}(?=.)/g, '$& ')}</span>&nbsp;<Copy size={20} /></Text>
              </Box>
              <Flex sx={{
                div: {
                  mr: '25px'
                },
                visibility: 'hidden'
              }}>
                <Box>
                  <Text as='p' sx={{
                    fontSize: '10px',
                    opacity: '0.7'
                  }}>Expiry</Text>
                  <Text as='p'>01/2027</Text>
                </Box>
                <Box>
                  <Text as='p' sx={{
                    fontSize: '10px',
                    opacity: '0.7'
                  }}>CVV</Text>
                  <Text as='p'>975</Text>
                </Box>
              </Flex>
              <hr />
              <Flex sx={{
                justifyContent: 'space-between',
                p: {
                  fontSize: '12px'
                }
              }}>
                <Box>
                  <Text as='p' sx={{
                    fontSize: '10px',
                    opacity: '0.7'
                  }}>{user?.role == 'MERCHANT'?'Device':'Card'} Name</Text>
                  <Text as='p'> {user?.firstName && user?.lastName ? user?.firstName + ' ' + user?.lastName : '@' + user?.username}</Text>
                </Box>
                <Box>
                  <Image width={40} height={40} src='/masterCard.png' alt='master' />
                </Box>
              </Flex>
            </Box>
            <Button variant="style2" sx={{
              mx: 'auto',
              display: 'flex',
              justifyContent: 'center',
              p: '10px 15px',
              fontSize: '12px',
              borderRadius: '10px'
            }}>Hide Details</Button>
            <br />
          </Box>
        </Slider>
      </Box>
    </Box>

  )
}

export default CardsFragment