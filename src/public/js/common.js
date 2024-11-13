// js for all pages

function showToast(type, message) {
    $("#notify-toast").removeClass("toast-warning toast-info toast-error");

    switch (type) {
        case "Warning":
            $("#notify-toast").addClass("toast-warning");
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

export { showToast };