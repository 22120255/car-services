import { showToast } from './common.js';

class FunctionApi {
    loading = false;
    error = null;
    data = null;

    constructor(url, { method = "GET", query = {}, body = {}, options = {} }) {
        const { showToast = true } = options;
        this.url = url;
        this.method = method;
        this.body = body;
        this.query = query;
        this.options = { showToast }
    }

    buildQueryParams() {
        const queryString = new URLSearchParams(this.query).toString();
        return queryString ? `${this.url}?${queryString}` : this.url;
    }

    async call() {
        this.loading = true;
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
                        if (this.options.showToast) {
                            showToast('error', err.responseJSON?.message || 'Request failed');
                        }
                    }
                });
            });
            return this.data;
        } catch (err) {
            this.error = err;
            throw err;
        } finally {
            this.loading = false;
        }
    }
}

export default FunctionApi;
