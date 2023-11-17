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
    const { TOKEN, 'CSRF-TOKEN': CSRF_TOKEN, 'JSESSIONID': JSESSIONID } = args;
    this.headers = {
      Authorization: `Basic ${TOKEN}`,
      // 'Content-Type': 'application/json',
      // 'X-CSRF-TOKEN': CSRF_TOKEN
    };


    this.setCookie('JSESSIONID', JSESSIONID, 1);
    this.setCookie('CSRF-TOKEN', CSRF_TOKEN, 1);

  }

  set headers(headers) {
    this.options.headers = { ...this.options.headers, ...headers };
  }

  // eslint-disable-next-line class-methods-use-this
  setCookie(name, value, daysToExpire, path = '/', domain = '') {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=${path}; domain=${domain}`;
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
