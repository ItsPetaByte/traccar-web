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

    console.log(document.cookie);

    const csrfToken = this.getCookie('CSRF-TOKEN');
    const JSESSIONID = this.getCookie('CSRF-JSESSIONID');

    // const { TOKEN, 'CSRF-TOKEN': CSRF_TOKEN } = args;

    this.headers = {
      // Authorization: `Basic ${TOKEN}`,
      'Content-Type': 'application/json',
      Authorization: 'Basic YWRtaW46QWRtaW4yMDIz',
      Cookie: `CSRF-TOKEN=${csrfToken}; JSESSIONID=${JSESSIONID}`,
      // 'X-CSRF-Token': CSRF_TOKEN,
    };
  }

  getCookie(cookieName) {
    const name = `${cookieName }=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }

    return null; // Return null if the cookie with the specified name is not found
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
