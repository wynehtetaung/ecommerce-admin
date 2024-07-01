import Swal from "sweetalert2"

export const Loading = (message) => {
    Swal.fire({
        title :message,
        width : '250px'
      })
      Swal.showLoading();
}
