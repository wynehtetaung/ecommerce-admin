import Swal from "sweetalert2"

export const InputPopUp = async(title,type,info) => {
    const { value } = await Swal.fire({
        title: title,
        input: type,
        inputPlaceholder: info,
        showCancelButton: true
      });
      return  value;
}
