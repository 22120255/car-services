// js for all pages

function showToast(type, message) {
    const toastContainer = $('#toast-container')

    const toastElement = $(
        `<div class="toast toast-notify toast-${type.toLowerCase()}" role="alert" aria-live="assertive" aria-atomic="true"></div>`
    )
    const toastContent = `
        <div class="toast-header">
            <strong id="toast-title" class="me-auto">${type}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `
    toastElement.html(toastContent)
    toastContainer.append(toastElement)

    setTimeout(() => {
        toastElement.addClass('show')
    }, 10)

    setTimeout(() => {
        toastElement.removeClass('show')
        setTimeout(() => {
            toastElement.remove()
        }, 500)
    }, 3000)
}
// callback will be done when modal hidden
function showModal(title, content, callback = () => {}) {
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

function showProductModal(title, product = null, callback = () => {}) {
    const modal = $('#product-modal')

    modal.find('.modal-title').text(title)

    // Reset form
    const form = modal.find('#product-form')[0]
    form.reset()

    // Nếu có dữ liệu sản phẩm, điền vào các field
    if (product) {
        Object.keys(product).forEach((key) => {
            if (typeof product[key] === 'object' && key === 'images') {
                Object.keys(product[key]).forEach((imageKey, index) => {
                    form[`images.image${index + 1}`].value =
                        product[key][imageKey]
                })
            } else if (form[key]) {
                form[key].value = product[key]
            }
        })
    }

    // Hiển thị modal
    modal.modal('show')
    modal.on('hidden.bs.modal', callback)
}

export { showToast, showModal, showProductModal }
