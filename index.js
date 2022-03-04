const fletching = (base) => {
  const defaultHeaders = new Headers();
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Accept", "application/json");

  const defaults = {
    root: "/",
    debug: false,
    headers: defaultHeaders,
  };

  if (base.root) {
    defaults.root = base.root;
  }

  if (base.headers) {
    base.headers.forEach((headerValue, headerName) => {
      defaults.headers.set(headerName, headerValue);
    });
  }

  const send = (uri, config) => {
    let url = uri;

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

    if (config.headers) {
      config.headers.forEach((headerValue, headerName) => {
        requestConfig.headers.headers.set(headerName, headerValue);
      });
    }

    if (defaults.debug) {
      console.log({ uri, requestConfig });
    }

    return fetch(url, requestConfig)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then((data) => {
            let result = {};
            result.data = data;
            result.ok = response.ok;
            result.status = response.status;

            let headers = {};
            response.headers.forEach((v, k) => {
              headers[k] = v;
            });
            result.headers = headers;
            return result;
          });
        } else {
          return response.text().then((text) => {
            result.data = text;
            result.ok = response.ok;

            let headers = {};
            response.headers.forEach((v, k) => {
              headers[k] = v;
            });
            result.headers = headers;
            return result;
          });
        }
      })
      .then((data) => {
        if (!data.ok) {
          return Promise.resolve({ ok: data.ok, response: data, error: null });
        }
        return Promise.resolve({ ok: data.ok, response: data, error: null });
      })
      .catch((err) =>
        Promise.resolve({ ok: false, response: null, error: err })
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
    post: (uri, data) => {
      const config = {
        method: "POST",
        body: JSON.stringify(data),
      };
      return send(uri, config);
    },
    put: (uri, data) => {
      const config = {
        method: "PUT",
        body: JSON.stringify(data),
      };

      return send(uri, config);
    },
    patch: (uri, data) => {
      const config = {
        method: "PATCH",
        body: JSON.stringify(data),
      };

      return send(uri, config);
    },
    delete: (uri, data) => {
      const config = {
        method: "DELETE",
        body: JSON.stringify(data),
      };

      return send(uri, config);
    },
  };
};

(module.exports = fletching), { fletching };
