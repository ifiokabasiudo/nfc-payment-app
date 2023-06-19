/* eslint-disable import/no-anonymous-default-export */
export default {
    // colors with dark mode
    colors: {
        text: "#333333",
        background: "#fff",
        primary: "#561441",
        primaryGrad: "linear-gradient(123.3deg, #561441 0%, #561441 80.13%)",
    },
    fonts: {
        body: "Figtree",
        heading: "Figtree",
    },
    text: {
        PENDING: {
            color: 'yellow',
            fontWeight: 'bold'
        },
        ACCEPTED: {
            color: 'lightgreen',
            fontWeight: 'bold'
        },
        CREDIT: {
            color: 'green !important',
            fontWeight: 'bold'
        },
        DEBIT: {
            color: 'red !important',
            fontWeight: 'bold'
        },
        REJECTED: {
            color: 'red',
            fontWeight: 'bold'
        },
        danger: {
            color: 'red',
            fontWeight: 'bold'
        }
    },
    buttons: {
        primary: {
            fontSize: '16px !important',
            fontFamily: 'body',
            background: 'primaryGrad'
        }
    },
    styles: {
        root: {
            color: 'text',
            fontFamily: "body",
            transition: "ease-in .2s",
            fontWeight: "normal",
            WebkitFontSmoothing: "antialiased",
            input: {
                fontFamily: 'body',
                '&:focus': {
                    outline: 'none',
                    border: '1px solid',
                    borderColor: '#561441 !important'
                },
                '&:hover': {
                    outline: 'none',
                    border: '1px solid',
                    borderColor: '#561441 !important'
                },
                '&:disabled': {
                    opacity: '0.7'
                }
            },
            textarea: {
                fontFamily: 'body',
                '&:focus': {
                    outline: 'none',
                    border: '1px solid',
                    borderColor: '#561441 !important'
                },
                '&:hover': {
                    outline: 'none',
                    border: '1px solid',
                    borderColor: '#561441 !important'
                },
                '&:disabled': {
                    opacity: '0.7'
                }
            }
        }
    },
    layout: {
        container: {
            maxWidth: ["90%", null, "90%", null, "990px", "1100px", "1200px"],
        },
    },
}