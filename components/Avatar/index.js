import { Box, Heading, Image } from "theme-ui"

const Avatar = ({ size, src, font,onClick,text }) => {
    return !src ? (
        <Box sx={{
            borderRadius: '100%',
            background: 'text',
            width: size,
            display: 'flex',
            height: size,
            cursor:'pointer'
        }} onClick={()=>{
            if(onClick){
                onClick()
            }
        }}>
            <Heading sx={{
                fontSize: font,
                //transform:'scale(1)',
                m: 'auto',
                color: 'white'
            }}>
                {text ? text.slice(0, 2).toUpperCase() : 'CK'}
            </Heading>
        </Box>
    ) : (
        <Image src={src} alt='Pic' sx={{
            borderRadius: '100%',
            background: 'primary',
            objectFit: 'cover',
            width: size,
            height: size
        }} onClick={()=>{
            if(onClick){
                onClick()
            }
        }}/>
    )
}

export default Avatar