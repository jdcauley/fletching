const fletching = (base) => {
  const defaults = {};
  if (base.root) {
    defaults.root = base.root;
  }

  if (base.headers) {
    defaults.headers = base.headers;
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

    const fetchConfig = config;

    if (defaults && defaults.headers) {
      fetchConfig.headers = defaults.headers;
    }
    if (!fetchConfig.headers) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      fetchConfig.headers = headers;
    }

    return fetch(url, fetchConfig)
      .then((response) =>
        response.json().then((data) => {
          let result = {};
          result.data = data;
          result.ok = response.ok;

          let headers = {};
          response.headers.forEach((v, k) => {
            headers[k] = v;
          });
          result.headers = headers;
          return result;
        })
      )
      .then((data) => {
        if (!data.ok) {
          return Promise.reject(data);
        }
        return data;
      })
      .catch((err) => Promise.reject(err));
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
