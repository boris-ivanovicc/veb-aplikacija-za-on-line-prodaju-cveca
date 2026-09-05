import Swal from "sweetalert2";

export class Alerts {

    static showError(message: string) {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            confirmButtonText: "Okay"
        });
    }

    static showSuccess(message: string) {
        Swal.fire({
            title: "Success",
            text: message,
            icon: "success",
            confirmButtonText: "Okay"
        });
    }

    static showConfirm(
        message: string,
        callback: Function
    ) {

        Swal.fire({
            title: message,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(result => {

            if (result.isConfirmed) {
                callback();
            }

        });
    }
}