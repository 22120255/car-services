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

        const { showToast = true } = options;
        this.url = url;
        this.method = method;
        this.body = body;
        this.query = query;
        this.options = { showToast }
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
                    data: this.body,
                    success: (response) => {
                        resolve(response);
                        this.onSuccess?.();
                    },
                    error: (err) => {
                        reject(err);
                        if (this.options?.showToast) {
                            showToast('error', err.responseJSON?.message || 'Request failed');
                        }
                        this.onError?.();
                    }
                });
            });
        } catch (err) {
            this.error = err;
            // throw err;
        } finally {
            return this.data;
        }
    }
}

export default FunctionApi;
