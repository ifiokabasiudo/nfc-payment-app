import { Box, Heading, Input, Label, Text, Image, Spinner, Button, Flex } from "theme-ui"
import { Copy } from "react-feather"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { handleFailure, handleSuccess } from "@/components/SweetAlert";
import { useForm } from "react-hook-form";
import ConfirmPayment from "@/components/ConfirmPayment";
import PullToRefresh from "react-simple-pull-to-refresh";
import Countdown from "react-countdown";
import { copy } from "@/functions";
import { useAuth } from "@/contexts/auth";
import api from "@/services/api";
import { syncWait } from "@/functions";
const Order = () => {
    const router = useRouter();
    const { user,reset, setReload, reload, setLoading } = useAuth()
    const [bottomSheet, setBottomSheet] = useState()
    const [order, setOrder] = useState()
    const [show, setShow] = useState(false)
    const [file, setFile] = useState()
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { slug } = router.query;

    const time = {
        starting: new Date(order?.startTime),
        now: new Date(),
        ending: new Date(order?.endTime),
    };

    const Completionist = () => {
        return (
            <Flex sx={styles.countdown}>
                {/* <Box>
                    <Heading as="h1">{"00"}</Heading>
                    <Text as="p">Days</Text>
                </Box>
                <Heading as="h2">:</Heading>
                <Box>
                    <Heading as="h1">{"00"}</Heading>
                    <Text as="p">Hours</Text>
                </Box>
                <Heading as="h2">:</Heading> */}

                <Box>
                    <Heading as="h1">{"00"}</Heading>
                    <Text as="p">Mins</Text>
                </Box>
                <Heading as="h2">:</Heading>

                <Box>
                    <Heading as="h1">{"00"}</Heading>
                    <Text as="p">Secs</Text>
                </Box>
            </Flex>
        );
    };
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
       if (completed) {
            return <Completionist />;
        } else {
            return (
                <Flex sx={styles.countdown}>
                    {/* <Box>
                        <Heading as="h1">{days}</Heading>
                        <Text as="p">Days</Text>
                    </Box>
                    <Heading as="h2">:</Heading>
                    <Box>
                        <Heading as="h1">{hours}</Heading>
                        <Text as="p">Hours</Text>
                    </Box>
                    <Heading as="h2">:</Heading> */}

                    <Box>
                        <Heading as="h1">{minutes}</Heading>
                        <Text as="p">Mins</Text>
                    </Box>
                    <Heading as="h2">:</Heading>

                    <Box>
                        <Heading as="h1">{seconds}</Heading>
                        <Text as="p">Secs</Text>
                    </Box>
                </Flex>
            );
        }
    };

    const Real = () => {
        return order?.status == 'ACTIVE' && !order?.metaData?.image ?(
            <>
                <Box sx={styles.content1}>
                    <Text as="p" sx={{
                        textAlign:'center'
                    }}>
                        {time.now < time.starting ? "Starting In" : time.now > time.ending ? "Ended" : "Ending In"}
                    </Text>
                </Box>
                {time.ending > time.now &&
                    <Countdown
                        date={time.now < time.starting ? time.starting : time.ending}
                        renderer={renderer}
                    />
                }
            </>
        ): null
    }



    const handleConfirm = (orderId, status) => {
        setLoading(true)
        api.put('api/account/recharge', {
            orderId,
            status
        }).then(() => {
            setReload(!reload)
            setLoading(false)
            handleSuccess('Successful')
            router.back()
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            handleSuccess('Failed')
        })
    }

    async function onSubmit(formData) {

        console.log(formData)
        var kycFormData = new FormData()
        kycFormData.append('image', formData.id[0])
        kycFormData.append('orderId', slug)

        setIsSubmitting(true)
        try {
            const res = await api({
                method: 'put',
                url: 'api/account/orders',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: kycFormData
            })
            if (res.data.statuscode == 200) {
                handleSuccess('Voucher Uploaded')
                setIsSubmitting(false)
                setIsSubmitted(true)
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

    const getOrder = async () => {
        try {
            const account = await api.get('api/account/orders', {
                params: {
                    orderId: slug,
                }
            })
            if (account?.data?.body) {
                setOrder(account.data.body)
                if (account.data?.body?.metaData?.image) {
                    setFile(account.data?.body?.metaData?.image)
                }

            }
        } catch (error) {
            if (error.response?.data) {
                handleFailure('Failed', error.response.data.message);
            } else {
                if (error.reason) {
                    handleFailure(error.reason);
                } else {
                    handleFailure(error.message);
                }
            }
            //router.back()
        }
    }

    useEffect(() => {
        if (!order) {
            getOrder()
        }
        if (order?.status == 'ACTIVE') {
            getOrder()
            syncWait(2500);
        }
    })
    return order ? order?.reqUid == user?.uid ? (

        <Box sx={{
            p: '15px 15px',
            height: '100vh',
            overflow: 'scroll',
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
            <Heading>CU Payment </Heading>
            <br />
            <Heading as='h3'>30mins Payment Window</Heading>
            <br />
                    <Real />
            <br />

            {order?.reqUid == user?.uid && <Box>
                <Text as='p'>Step 1: Make a transfer to the following bank using a valid bank account</Text>
            </Box>}
            <Box>

                <Box>
                    <Flex sx={{
                        justifyContent: 'space-between',
                        m: '25px 10px',
                        svg: {
                            opacity: '0.8'
                        }

                    }}>
                        <Text>{'Bank Name'}</Text>
                        <Flex onClick={() => {
                            copy(order?.collectionChannel?.bankName)
                            handleSuccess('Copied')
                        }}>
                            <Text>{order?.collectionChannel?.bankName}</Text>
                            &nbsp;&nbsp;
                            <Copy />

                        </Flex>
                    </Flex>
                    <hr />
                </Box>
                <Box>
                    <Flex sx={{
                        justifyContent: 'space-between',
                        m: '25px 10px',
                        svg: {
                            opacity: '0.8'
                        }

                    }}>
                        <Text>{'Account Name'}</Text>
                        <Flex onClick={() => {
                            copy(order?.collectionChannel?.accountName)
                            handleSuccess('Copied')
                        }}>
                            <Text>{order?.collectionChannel?.accountName}</Text>
                            &nbsp;&nbsp;
                            <Copy />

                        </Flex>
                    </Flex>
                    <hr />
                </Box>

                <Box>
                    <Flex sx={{
                        justifyContent: 'space-between',
                        m: '25px 10px',
                        svg: {
                            opacity: '0.8'
                        }

                    }}>
                        <Text>{'Account Number'}</Text>
                        <Flex onClick={() => {
                            copy(order?.collectionChannel?.accountNumber)
                            handleSuccess('Copied')
                        }}>
                            <Text>{order?.collectionChannel?.accountNumber}</Text>
                            &nbsp;&nbsp;
                            <Copy />

                        </Flex>
                    </Flex>
                    <hr />
                </Box>

                <Box>
                    <Flex sx={{
                        justifyContent: 'space-between',
                        m: '15px 10px',
                        svg: {
                            opacity: '0.8'
                        }

                    }}>
                        <Heading>{'Amount'}</Heading>
                        <Heading as='p' variant="danger" sx={{ fontSize: '24px' }}>{order?.amount}&nbsp;NGN</Heading>
                    </Flex>
                    <Text as='p' variant="danger">*Tip: Pay in strict accordance with above amount to avoid recharge complications</Text> :
                    <Text as='p' variant="danger">*Order Status:  <Text sx={{
                        fontSize: '20px',
                        color: 'primary'
                    }}>{order?.status}</Text> </Text>
                     <br />
                        <br />
                        <Text as='p'>Payer Info</Text>
                        <br />
                        <Flex sx={{
                            justifyContent: 'space-between',
                            fontWeight: 'bold'
                        }}>
                            <Text>Username:</Text>
                            <Text>{'@' + order?.creatorUsername}</Text>
                        </Flex>
                        <br />
                </Box>
            </Box>
            <br />
            {order?.status != 'SUCCESS' &&
                <>
                    <Text as='p'>Voucher</Text>
                    <br />
                    {file && <Image className={!show ? 'smallPic' : 'BigPic'} onClick={() => {
                        setShow(!show)
                    }} sx={{
                        mx: 'auto',
                        alignItems: 'center'
                    }} src={file} width={100} height={100} alt='fine' />}
                    <br />
                    <br />
                    {order?.reqUid == user?.uid && !order?.metaData?.image && <Box>
                        <Box>
                            <Text as='p'>Step 2: Upload Voucher</Text>
                        </Box>
                        <br />
                        <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                            textAlign: 'left',
                            label: {
                                mt: '10px'
                            }
                        }}>
                            <Box>
                                <Label htmlFor="id">Upload a valid Voucher</Label>
                                <Input name="id" id="id" type="file" {...register("id", {
                                    required: "Required",
                                })} my={2} onChange={(e) => {
                                    setFile(URL.createObjectURL(e.target.files[0]))
                                }} placeholder="id" />
                                <Text variant='danger'>{errors.id && errors.id.message}</Text>
                            </Box>
                            <Flex sx={{
                                flexDirection: ['column', null, null, 'row'],
                                justifyContent: 'space-between',
                            }}>
                                <Button type="submit">Upload</Button>
                                <br />
                                {isSubmitting ? <Box>
                                    <Spinner />
                                </Box> : null}
                            </Flex>
                        </Box>
                        <br />
                    </Box>}
                </>}


        </Box>
    ) : (
        <>
            {bottomSheet && <ConfirmPayment setBottomSheet={setBottomSheet} slug={slug} user={user} reset={reset} handleConfirm={handleConfirm} amount={order?.amount} />}
            <PullToRefresh onRefresh={async () => {
                await getOrder()
                return true
            }}>
                <Box sx={{
                    p: '45px 15px',
                    height: '100vh',
                    overflow: 'scroll',
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
                    },
                    h2: {
                        color: 'primary'
                    }
                }}>
                    <Heading>Order is being Traded</Heading>
                    <Text as={'p'}>The order is being traded, check and confirm payment time</Text>
                    <br />
                    <Real />
                    <Text as='p' variant="danger">*Order Status:  <Text sx={{
                        fontSize: '20px',
                        color: 'primary'
                    }}>{order?.status}</Text> </Text>
                    <br />
                    {order?.appeal && <Box>
                        <Text sx={{
                            color: 'primary',
                            fontWeight: 'bold'
                        }}>Reason: {order.appeal.reason}</Text>
                    </Box>}
                    <br />
                    <Box>
                        <Text as={'p'}>Order Information</Text>
                        <Box>
                            <Box >
                                <Flex sx={{
                                    justifyContent: 'space-between',
                                    m: '15px 10px',
                                    svg: {
                                        opacity: '0.8'
                                    }

                                }}>
                                    <Text as={'p'}>{'Amount'}</Text>
                                    <Text as={'p'} sx={{
                                        fontWeight: 'bold',
                                        fontSize: '19px',
                                        color: 'primary'
                                    }}>{order?.amount}&nbsp;NGN</Text>
                                </Flex>
                                <hr />
                            </Box>
                            <Box >
                                <Flex sx={{
                                    justifyContent: 'space-between',
                                    m: '15px 10px',
                                    svg: {
                                        opacity: '0.8'
                                    }
                                }}>
                                    <Text as={'p'} sx={{
                                        span: {
                                            fontSize: '10px',
                                            color: 'primary',
                                            fontWeight: 'bold'
                                        }
                                    }}>Commission <span>{'(' + order?.amount + '*2%)'}</span> </Text>
                                    <Text as={'p'} sx={{
                                        color: 'primary'
                                    }}>{order?.amount * 2 / 100}&nbsp;NGN</Text>
                                </Flex>
                                <hr />
                            </Box>
                            <Box >
                                <Flex sx={{
                                    justifyContent: 'space-between',
                                    m: '15px 10px',
                                    svg: {
                                        opacity: '0.8'
                                    }
                                }}>
                                    <Text as={'p'} sx={{
                                        span: {
                                            fontSize: '10px',
                                            color: 'primary',
                                            fontWeight: 'bold'
                                        }
                                    }}>Time </Text>
                                    <Text as={'p'} sx={{
                                        color: 'primary',
                                        fontSize: '13px'
                                    }}>{order?.createdAt}</Text>
                                </Flex>
                                <hr />
                            </Box>
                            <Box >
                                <Flex sx={{
                                    justifyContent: 'space-between',
                                    m: '15px 10px',
                                    svg: {
                                        opacity: '0.8'
                                    }
                                }}>
                                    <Text as={'p'} sx={{
                                        span: {
                                            fontSize: '10px',
                                            color: 'primary',
                                            fontWeight: 'bold'
                                        }
                                    }}>Order ID </Text>
                                    <Flex>
                                        <Text as={'p'} sx={{
                                            color: 'primary',
                                            fontWeight: 'bold'
                                        }}>{order?.orderId}</Text>&nbsp;<Copy onClick={() => {
                                            copy(order?.orderId)
                                            handleSuccess('Copied')
                                        }} />
                                    </Flex>
                                </Flex>
                                <hr />
                            </Box>
                        </Box>
                    </Box>
                    <br />
                    <Box>
                        <Text as='p'>Voucher</Text>
                        <br />
                        {file ? <Image className={!show ? 'smallPic' : 'BigPic'} onClick={() => {
                            setShow(!show)
                        }} sx={{
                            mx: 'auto',
                            alignItems: 'center'
                        }} src={file} width={100} height={100} alt='fine' /> :
                            <Text variant="danger">The Payers has not uploaded the payment voucher</Text>}
                        <br />
                        <br />
                        <Text as='p'>Payer Info</Text>
                        <br />
                        <Flex sx={{
                            justifyContent: 'space-between',
                            fontWeight: 'bold'
                        }}>
                            <Text>Username:</Text>
                            <Text>{'@' + order?.reqUsername}</Text>
                        </Flex>
                        <br />
                    </Box>
                    <Box>
                        <Text as={'h3'}>Personal Information</Text>

                        <Box>
                            <Flex sx={{
                                justifyContent: 'space-between',
                                m: '15px 10px',
                                svg: {
                                    opacity: '0.8'
                                }

                            }}>
                                <Text>{'Bank Name'}</Text>
                                <Flex onClick={() => {
                                    copy(order?.collectionChannel?.bankName)
                                    handleSuccess('Copied')
                                }}>
                                    <Text>{order?.collectionChannel?.bankName}</Text>
                                    &nbsp;&nbsp;
                                    <Copy />

                                </Flex>
                            </Flex>
                            <hr />
                        </Box>
                        <Box>
                            <Flex sx={{
                                justifyContent: 'space-between',
                                m: '15px 10px',
                                svg: {
                                    opacity: '0.8'
                                }

                            }}>
                                <Text>{'Account Name'}</Text>
                                <Flex onClick={() => {
                                    copy(order?.collectionChannel?.accountName)
                                    handleSuccess('Copied')
                                }}>
                                    <Text>{order?.collectionChannel?.accountName}</Text>
                                    &nbsp;&nbsp;
                                    <Copy />

                                </Flex>
                            </Flex>
                            <hr />
                        </Box>

                        <Box>
                            <Flex sx={{
                                justifyContent: 'space-between',
                                m: '15px 10px',
                                svg: {
                                    opacity: '0.8'
                                }

                            }}>
                                <Text>{'Account Number'}</Text>
                                <Flex onClick={() => {
                                    copy(order?.collectionChannel?.accountNumber)
                                    handleSuccess('Copied')
                                }}>
                                    <Text>{order?.collectionChannel?.accountNumber}</Text>
                                    &nbsp;&nbsp;
                                    <Copy />

                                </Flex>
                            </Flex>
                            <hr />
                        </Box>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </Box>
                    {order?.status == 'ACTIVE' &&
                        <><Flex sx={{
                            position: 'absolute',
                            bottom: '0',
                            zIndex: '3999',
                            left: '0',
                            zIndex: 100,
                            right: '0',
                            background: 'primaryGrad',
                            color: 'white',
                            mx: '20px',
                            mb: '20px',
                            boxShadow: '1px 1px 6px 3px #56144160',
                            width: 'auto',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            p: {
                                my: 'auto'
                            },

                        }}>
                            <Button sx={{
                                background: 'white',
                                color: 'text',
                                width: '35%'
                            }} onClick={() => {
                                router.push(`/reclaim/${slug}`)
                            }}><Text as={'p'}>{'Reclaim'}</Text></Button>
                            <Button onClick={() => {
                                if (!file) {
                                    handleFailure('Only confirm when voucher is uploaded', 'Payer has not uploaded Voucher')
                                }
                                setBottomSheet(true)
                            }} sx={{
                                width: '65%'
                            }}><Text as={'p'}>{'Confirm Payment'}</Text></Button>
                        </Flex></>}

                </Box>
            </PullToRefresh>

        </>

    ) : ('Loading.......')
}

export default Order

const styles = {
    countdown: {
        justifyContent: "center",
        h1: {
            background:
                "radial-gradient(114% 421.6% at -6.17% 23.08%, rgba(243, 240, 252, 0.26) 0%, rgba(163, 133, 255, 0.26) 100%)",
            boxSizing: "border-box",
            boxShadow: "0px 2.95133px 2.95133px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(5.72464px)",
            borderRadius: "12.5431px",
            textAlign: "center",
            fontSize: ["40px", "50px", null, null, "70px"],
            width: ["70px", "80px", null, null, "100px"],
            height: ["50px", "60px", null, null, "80px"],
        },
        h2: {
            textAlign: "center",
            fontSize: ["30px", "50px", null, null, "70px"],
            ml: "5px",
            mr: "5px",
        },
        p: {
            textAlign: "center",
            mt: "5px",
        },
    },
    container1: {
        position: "relative",
        alignItems: "center",
        textAlign:'center'
    },
}