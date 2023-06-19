import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export const handleSuccess = (title,msg) => {
    return MySwal.fire({
        title: title,
        text: msg,
        icon: "success",
    });
};

export const handleFailure = (title,msg) => {
    return MySwal.fire({
        title: title,
        text: msg,
        icon: "error",
    });
};
