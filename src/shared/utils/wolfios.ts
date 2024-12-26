import isJSON from "validator/lib/isJSON";

type WolfiosProps = RequestInit & {
  json?: Record<any, any>;
  searchParams?: Record<string, string[] | string | number>;
  cookies?: Record<string, string>;
};

/**
 * wolfios is a wrapper around fetch that handles authentication, caching and more.
 *
 * @param url The url to request
 * @param config The config for the request
 * @param config.next The config for NextJS caching. When this is set, the request will be cached.
 * Also, the return response will be a JSON object, you DON'T need to chain .then((res) => res.data).
 */
const wolfios = async (endpoint: string, config?: WolfiosProps) => {
  const isServer = typeof window === "undefined";

  // create a url from the endpoint
  // if we have a document, use the baseURI as the base URL (client side)
  // otherwise, use the nginx container (server side)
  const url = new URL(endpoint, isServer ? "http://nginx" : document.baseURI);

  // ---------------------------------------
  // if we have a `data` param, handle it based on content type
  // ----------------------------------------
  if (config?.json) {
    const contentType = config.headers?.["Content-Type"] || "application/json";

    if (contentType === "application/x-www-form-urlencoded") {
      config.body = new URLSearchParams(config.json).toString();
    } else {
      config.body = JSON.stringify(config.json);
    }

    config.headers = {
      "Content-Type": contentType,
      ...config.headers,
    };
  }

  // ----------------------------------------
  // If we have params, add them to the URL
  // ----------------------------------------
  if (config?.searchParams) {
    Object.entries(config.searchParams).map(([key, value]) => {
      if (Array.isArray(value)) {
        value.map((v) => {
          if (v) {
            url.searchParams.append(key, v);
          }
        });
      } else if (value) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  // ----------------------------------------
  // If we have cookies, add them to the headers
  // ----------------------------------------
  if (config?.cookies) {
    const cookieString = Object.entries(config.cookies)
      .filter(([key, value]) => key && value !== undefined) // Filter out undefined values
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    if (cookieString) {
      config.headers = {
        ...config.headers,
        Cookie: cookieString,
      };
    }
  }

  // ----------------------------------------
  // Make the request
  // ----------------------------------------
  const response = await fetch(url.toString(), config);

  return await handleApiResponse(response);
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let data: any;

    try {
      // -- Always get the text first since it's the most reliable
      const rawText = await response.text();

      // -- Then try to parse as JSON if it's a JSON content type
      if (isJSON(rawText)) {
        data = JSON.parse(rawText);
      } else {
        data = rawText;
      }
    } catch (error) {
      console.warn("Error while reading response !", error);
      data = {
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url,
      };
    }

    throw {
      message: "An error occurred on the server.\nPlease try again.",
      response: response,
      data: data,
    };
  }

  return response;
};

export { wolfios };
