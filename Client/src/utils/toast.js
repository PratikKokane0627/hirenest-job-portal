import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  newestOnTop: true,
  timeOut: 2800,
  extendedTimeOut: 1200
};

export function toastSuccess(message, title = "Success") {
  toastr.success(message, title);
}

export function toastError(message, title = "Error") {
  toastr.error(message, title);
}

export function toastInfo(message, title = "Info") {
  toastr.info(message, title);
}

export function toastWarning(message, title = "Warning") {
  toastr.warning(message, title);
}
