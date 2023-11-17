class AxelorFetchService {
  constructor(baseURL, options) {
    this.baseURL = baseURL;
    this.options = options;
  }

  async post(url, options) {
    const _options = this.buildOptions({ method: 'POST', ...options });
    return fetch(this.baseURL + url, _options);
  }

  async get(url, options) {
    const _options = this.buildOptions({ method: 'GET', ...options });
    return fetch(this.baseURL + url, _options);
  }

  get headers() {
    return this.options?.headers ?? {};
  }

  initAuthHeaders(args) {

    const { TOKEN, 'CSRF-TOKEN': CSRF_TOKEN, JSESSIONID } = args;

    this.headers = {
      // Authorization: `Basic ${TOKEN}`,
      'Content-Type': 'application/json',
      Authorization: `Basic YWRtaW46QWRtaW4yMDIz`,
      Cookie: 'CSRF-TOKEN=16083f3d46014563a01d2723ed2c6568; JSESSIONID=F61BB02FA4A2F95E3A637824F58BFBCB',
      // 'X-CSRF-Token': CSRF_TOKEN,
    };
  }

  set headers(headers) {
    this.options.headers = { ...this.options.headers, ...headers };
  }

  // eslint-disable-next-line class-methods-use-this
  setCookie(name, value, daysToExpire, path = '/', domain = '') {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    return `${name}=${value}; ${expires}; path=${path}; domain=${domain}`;
  }

  buildOptions(options) {
    return {
      ...this.options,
      ...options,
      headers: {
        ...this.options.headers,
        ...options.headers,
      },
    };
  }
}

const http = new AxelorFetchService('/axelor-api', { headers: { 'Content-Type': 'application/json' } });

// eslint-disable-next-line import/prefer-default-export
export { http };
