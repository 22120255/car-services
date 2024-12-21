import { showToast } from './common.js';

class FunctionApi {
    loading = false;
    error = null;
    data = null;

    constructor(url, method, body, options = { showToast: true }) {
        this.url = url;
        this.method = method;
        this.body = body;
        this.options = options;
    }

    async call() {
        this.loading = true;
        this.error = null;
        this.data = null;

        try {
            this.data = await new Promise((resolve, reject) => {
                $.ajax({
                    url: this.url,
                    type: this.method,
                    data: this.body,
                    success(response) {
                        resolve(response);
                    },
                    error(err) {
                        reject(err);
                        if (this.options.showToast) {
                            showToast('error', err.responseJSON.message);
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