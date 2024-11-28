// js for all pages

function showToast(type, message) {
    const toastContainer = $('#toast-container');

    const toastElement = $(`<div class="toast toast-notify toast-${type.toLowerCase()}" role="alert" aria-live="assertive" aria-atomic="true"></div>`);
    const toastContent = `
        <div class="toast-header">
            <strong id="toast-title" class="me-auto">${type}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    toastElement.html(toastContent);
    toastContainer.append(toastElement);

    setTimeout(() => {
        toastElement.addClass('show');
    }, 10);

    setTimeout(() => {
        toastElement.removeClass('show');
        setTimeout(() => {
            toastElement.remove();
        }, 500);
    }, 3000);
}
// callback will be done when modal hidden
function showModal(title, content, callback = () => { }) {
    const modal = $('#notify-modal')
    // modal.off('hidden.bs.modal')

    modal.find('.modal-title').text(title)
    modal.find('.modal-body').text(content)

    modal.on('hidden.bs.modal', () => {
        callback()
        modal.off('hidden.bs.modal')
    })

    modal.modal('show').css('background-color', 'rgba(0, 0, 0, 0.4)')
}

export { showToast, showModal }
