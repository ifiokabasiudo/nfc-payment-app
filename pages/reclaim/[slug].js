import { Box, Radio, Button,Image, Flex, Text, Spinner, Label, Input, Textarea } from "theme-ui"
import { useForm } from "react-hook-form";
import Link from "next/link";
import api from '@/services/api'
import { handleSuccess, handleFailure } from '@/components/SweetAlert'
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import PullToRefresh from "react-simple-pull-to-refresh";
const KYC = ({ bank, name, num }) => {
    const [show, setShow] = useState(false)
    const router = useRouter()
  const { user, setReload, reload } = useAuth()
  const { handleSubmit, register, formState: { errors }, setError } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reason, setReason] = useState('I have not received payment from buyer')
    const [file, setFile] = useState()
    const { slug } = router.query;
    const [isSubmitted, setIsSubmitted] = useState(false)
  console.log(reason)

  async function onSubmit(formData) {
    console.log(formData)
    if (formData.securityPassword != user?.securityPassword) {
      handleFailure('Failed', 'Incorrect Transaction Pin')
      return
    }
   
    var kycFormData = new FormData()
    kycFormData.append('reason', reason != 'Others' ? reason:formData.reason)
    kycFormData.append('image', formData.face[0])
    kycFormData.append('orderId', slug)

    setIsSubmitting(true)
    try {
      const res = await api({
        method: 'put',
        url: 'api/account/appeal',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: kycFormData
      })
      if (res.data.statuscode == 200) {
       // setReload(!reload)
        handleSuccess('Successful', 'Appeal Sent our team would review it right away')
        setIsSubmitting(false)
        setIsSubmitted(true)
        router.back()
      }

    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
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
    setIsSubmitting(false)
  }
  return (
    <>
      <Box sx={{
        width: '100vw',
        height: '100vh',
        overflowY: 'scroll',
        p: '35px 15px',
        m: 'auto',
        textAlign: 'center',
        borderRadius: '15px',
        '.BigPic': {
          position: 'absolute',
          background: 'rgba(0,0,0,0.4)',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
          objectFit: 'contain',
          my: 'auto',
          width: '100%',
          height: '100%',
      }
      }}>
        <br />
        <br />
        <Text as={'h3'} variant={user?.kycStatus == 'REJECTED' ? 'danger' : 'normal'}>Appeal</Text>

        <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
          textAlign: 'left',
          label: {
            mt: '10px'
          }
        }}>
          <br />
          <Box sx={{ svg: { color: 'text' } }}>
            <Label htmlFor="referral">Please Select Reason</Label>
            <Label my={2}>
              <Radio name="referral"
                onChange={(e) => {
                  setReason('I have not received payment from buyer')
                }} defaultChecked={true} />
              I have not received payment from buyer
            </Label>
            <Label my={2}>
              <Radio name="referral" onChange={(e) => {
                setReason('Received amount does not match order amount')
              }} />
              Received amount does not match order amount
            </Label>
            <Label my={2}>
              <Radio name="referral" onChange={(e) => {
                setReason('Others')
              }} />
              Others
            </Label>
          </Box>
          {reason == 'Others' && <Box>
            <Label htmlFor="firstName">Write your reason</Label>
            <Textarea name="firstName" id="firstName" type="text" {...register("reason", {
              required: "Required",
              value: name
            })} my={2} onChange={(e) => {
            }} placeholder="Type..." />
            <Text variant='danger'>{errors.reason && errors.reason.message}</Text>
          </Box>}
          <br />
          <Box>
            <Label htmlFor="face">Include Supplementary Screenshot</Label>
            <Input name="face" id="face" type="file" {...register("face", {
              required: "Required",
            })} my={2} placeholder="Face" onChange={(e) => {
              setFile(URL.createObjectURL(e.target.files[0]))
          }} />
            <Text variant='danger'>{errors.face && errors.face.message}</Text>
          </Box>
          {file && <Image className={!show ? 'smallPic' : 'BigPic'} onClick={() => {
                        setShow(!show)
                    }} sx={{
                        mx: 'auto',
                        alignItems: 'center'
                    }} src={file} width={100} height={100} alt='fine' />}
          <Box>
            <Label htmlFor="securityPassword">Transaction Pin</Label>
            <Input name="securityPassword" id="securityPassword" type="password" pattern="[0-9]*" {...register("securityPassword", {
              required: "Required",
            })} my={2} onChange={(e) => {
            }} placeholder="Enter Transaction Pin" />
            <Text variant='danger'>{errors.securityPassword && errors.securityPassword.message}</Text>
          </Box>
          <br />
          <Flex sx={{
            flexDirection: ['column', null, null, 'row'],
            justifyContent: 'space-between',
          }}>
            <Button type="submit">Submit</Button>

            {isSubmitting ? <Box>
              <Spinner />
            </Box> : null}
          </Flex>
        </Box>

      </Box>
    </>


  )
}

export default KYC