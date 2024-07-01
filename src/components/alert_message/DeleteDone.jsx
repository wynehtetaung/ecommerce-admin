import Swal from "sweetalert2";

export const DeleteDone = () => {
  Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success",
  });
};
