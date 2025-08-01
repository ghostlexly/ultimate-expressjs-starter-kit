type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: JsonValue }
  | JsonValue[];

type WolfiosProps = Parameters<typeof fetch>[1] & {
  json?: JsonValue;
  params?: Record<string, string[] | string | number>;
  cookies?: Record<string, string>;
  timeout?: number;
};

/**
 * Custom error class for wolfios that mimics axios error behavior
 */
class WolfiosError extends Error {
  response: Response;
  status: number;
  config: WolfiosProps;
  data?: unknown; // Will hold parsed response data if available

  constructor(message: string, response: Response, config: WolfiosProps) {
    super(message);
    this.name = "WolfiosError";
    this.response = response;
    this.status = response.status;
    this.config = config;
  }
}

/**
 * wolfios is a wrapper around fetch that handles authentication, caching and more.
 *
 * @param url The url to request
 * @param config The config for the request
 * @param config.next The config for NextJS caching. When this is set, the request will be cached.
 * Also, the return response will be a JSON object, you DON'T need to chain .then((res) => res.data).
 */
const wolfios = async (endpoint: string, config?: WolfiosProps) => {
  // If we don't have a config, create an empty one
  if (!config) {
    config = {};
  }

  // if we have a `data` param, handle it based on content type
  if (config?.json) {
    const contentType = config.headers?.["Content-Type"] || "application/json";

    if (contentType === "application/x-www-form-urlencoded") {
      // Convert Record<string, unknown> to Record<string, string> for URLSearchParams
      const formData: Record<string, string> = {};
      Object.entries(config.json).forEach(([key, value]) => {
        formData[key] = String(value);
      });
      config.body = new URLSearchParams(formData).toString();
    } else {
      config.body = JSON.stringify(config.json);
    }

    config.headers = {
      "Content-Type": contentType,
      ...config.headers,
    };
  }

  // If we have params, add them to the endpoint
  if (config?.params) {
    const searchParams = new URLSearchParams();

    Object.entries(config.params).map(([key, value]) => {
      if (Array.isArray(value)) {
        value.map((v) => {
          if (v) {
            searchParams.append(key, v);
          }
        });
      } else if (value) {
        searchParams.append(key, value.toString());
      }
    });

    endpoint = `${endpoint}?${searchParams.toString()}`;
  }

  // If we have cookies, add them to the headers
  if (config?.cookies) {
    const cookieString = Object.entries(config.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    config.headers = {
      ...config.headers,
      Cookie: cookieString,
    };
  }

  // If we have a timeout, add it to the request
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config?.timeout ?? 30000
  );
  config.signal = controller.signal;

  // Make the request
  const response = await fetch(endpoint, config);

  // Clear the timeout
  clearTimeout(timeout);

  // Check if the response is successful (status code 200-299)
  if (!response.ok) {
    // Create a custom error
    const customError = new WolfiosError(
      `Request failed with status code ${response.status}`,
      response,
      config
    );

    // Try to parse response data if possible
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        customError.data = await response.clone().json();
      } else {
        customError.data = await response.clone().text();
      }
    } catch {
      // Ignore parsing errors
    }

    throw customError;
  }

  return response;
};

export { wolfios, WolfiosError };
