import Swal from "sweetalert2";

export class Alerts {

    static showError(message: string) {
        Swal.fire({
            title: "Greška",
            text: message,
            icon: "error",
            confirmButtonText: "U redu"
        });
    }

    static showSuccess(message: string) {
        Swal.fire({
            title: "Uspešno",
            text: message,
            icon: "success",
            confirmButtonText: "U redu"
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
            confirmButtonText: "Da",
            cancelButtonText: "Ne"
        }).then(result => {

            if (result.isConfirmed) {
                callback();
            }

        });
    }
}