import { showToast } from './common.js';

class FunctionApi {
    error = null;
    data = null;

    constructor(url, params = {}) {
        const {
            method = "GET",
            query = {},
            body = {},
            options = {},
            onSuccess = null,
            onError = null
        } = params;

        const { hideToast = false } = options;
        this.url = url;
        this.method = method;
        this.body = body;
        this.query = query;
        this.options = { hideToast }
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    buildQueryParams() {
        const queryString = new URLSearchParams(this.query).toString();
        return queryString ? `${this.url}?${queryString}` : this.url;
    }

    async call() {
        this.error = null;
        this.data = null;

        try {
            this.data = await new Promise((resolve, reject) => {
                $.ajax({
                    url: this.buildQueryParams(),
                    type: this.method,
                    contentType: 'application/json',
                    data: Object.keys(this.body || {}).length > 0
                        ? JSON.stringify(this.body)
                        : null,
                    dataType: 'json',
                    success: (response) => {
                        resolve(response);
                        this.onSuccess?.(response);
                    },
                    error: (err) => {
                        const errorMessage = err.responseJSON?.message || 'Request failed';
                        reject(errorMessage);
                        this.onError?.(err);
                    }
                });
            });
            return this.data;
        } catch (err) {
            console.log('err', err);

            this.error = err;
            if (!this.options?.hideToast) {
                showToast('Error', err);
            }
            return null;
            // throw err;
        }
    }
}

export default FunctionApi;
