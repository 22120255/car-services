import { showToast } from './common.js';

class FunctionApi {
    error = null;
    data = null;

    constructor(url, { method = "GET", query = {}, body = {}, options = { showToast: true } }) {
        this.url = url;
        this.method = method;
        this.body = body;
        this.query = query;
        this.options = options;
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
                    success(response) {
                        resolve(response);
                    },
                    error(err) {
                        reject(err);
                        if (this.options?.showToast) {
                            showToast('error', err.responseJSON?.message || 'Request failed');
                        }
                    }
                });
            });
            return this.data;
        } catch (err) {
            this.error = err;
            throw err;
        }
    }
}

export default FunctionApi;
