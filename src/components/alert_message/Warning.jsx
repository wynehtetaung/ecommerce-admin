import Swal from "sweetalert2";

export const Warning = (icon,message) => {
    Swal.fire({
        text: message,
        icon: icon
      });
}
