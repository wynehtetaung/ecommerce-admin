import Swal from "sweetalert2";

export const Toast = (icon,message,timer) => {
    const result = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      result.fire({
        icon: icon,
        title: message
      });
}
