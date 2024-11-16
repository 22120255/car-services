// js for all pages

function showToast(type, message) {
    $("#notify-toast").removeClass("toast-warning toast-info toast-error");

    switch (type) {
        case "Warning":
            $("#notify-toast").addClass("toast-warning");
            break;
        case "Success":
            $("#notify-toast").addClass("toast-success");
            break;
        case "Info":
            $("#notify-toast").addClass("toast-info");
            break;
        case "Error":
            $("#notify-toast").addClass("toast-error");
            break
        default:
            $("#notify-toast").removeClass("toast-warning toast-info toast-error");
            break;
    }
    $("#notify-toast #toast-title").text(type);

    $("#notify-toast").find(".toast-body").text(message);

    const toast = new bootstrap.Toast($("#notify-toast"));
    toast.show();
}
// callback will be done when modal hidden
function showModal(title, content, callback = () => { }) {
    const modal = $("#notify-modal")
    modal.find('.modal-title').text(title)
    modal.find('.modal-body').text(content)
    modal.modal('show').css("background-color", "rgba(0, 0, 0, 0.4)");
    modal.on('hidden.bs.modal', callback);
}


export { showToast, showModal };