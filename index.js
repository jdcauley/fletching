const fletching = (base) => {
  const defaultHeaders = new Headers();
  defaultHeaders.set("Content-Type", "application/json; charset=utf-8");
  defaultHeaders.set("Accept", "application/json");

  const defaults = {
    root: "/",
    debug: false,
    headers: defaultHeaders,
  };

  if (base.root) {
    defaults.root = base.root;
  }

  if (base.headers) {
    Object.keys(base.headers).forEach((key) => {
      defaults.headers.set(key, base.headers[key]);
    });
  }

  const send = (uri, config) => {
    let url = uri;
    console.log(config);
    /**
     * When using ugly permalinks, the REST base will
     * already include a ? so we need to transform
     * the rest uri to start with a & to have valid
     * query params.
     */
    const safeUri = defaults?.root?.includes("?") ? uri.replace("?", "&") : uri;

    if (defaults && defaults.root) {
      url = `${defaults.root}${safeUri}`;
    }

    const requestConfig = config;

    if (defaults && defaults.headers) {
      requestConfig.headers = defaults.headers;
    }

    if (config.headers != defaults.headers) {
      Object.keys(base.headers).forEach((key) => {
        requestConfig.headers.set(key, base.headers[key]);
      });
    }

    if (defaults.debug) {
      console.log({ uri, requestConfig });
    }

    return fetch(url, requestConfig)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        let headers = {};
        response.headers.forEach((v, k) => {
          headers[k] = v;
        });

        if (response.status === 204) {
          return Promise.resolve({
            ok: response.ok,
            status: response.status,
            data: null,
            error: null,
            headers: headers,
          });
        }
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then((data) => {
            let result = {};
            result.data = data;
            result.ok = response.ok;
            result.status = response.status;

            result.headers = headers;
            return result;
          });
        } else {
          return response.text().then((text) => {
            result.data = text;
            result.ok = response.ok;

            result.headers = headers;
            return result;
          });
        }
      })
      .then((data) => {
        if (!data.ok) {
          return Promise.resolve({
            ok: data.ok,
            status: data.status,
            data: data.data,
            error: null,
            headers: data.headers,
          });
        }
        return Promise.resolve({
          ok: data.ok,
          status: data.status,
          data: data.data,
          error: null,
          headers: data.headers,
        });
      })
      .catch((err) =>
        Promise.resolve({
          ok: false,
          status: data.status,
          data: null,
          error: err,
          headers: data.headers,
        })
      );
  };

  return {
    get: (uri, data = null) => {
      const config = {
        method: "GET",
      };
      if (data) {
        const encodedParams = Object.keys(data)
          .map((key) => `${key}=${encodeURIComponent(data[key])}`)
          .join("&");
        uri = `${uri}?${encodedParams}`;
      }
      return send(uri, config);
    },
    post: (uri, data = null) => {
      const config = {
        method: "POST",
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      return send(uri, config);
    },
    put: (uri, data = null) => {
      const config = {
        method: "PUT",
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      return send(uri, config);
    },
    patch: (uri, data = null) => {
      const config = {
        method: "PATCH",
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      return send(uri, config);
    },
    delete: (uri, data = null) => {
      const config = {
        method: "DELETE",
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      return send(uri, config);
    },
  };
};

(module.exports = fletching), { fletching };
