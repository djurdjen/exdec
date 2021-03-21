const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const get = async function <T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "same-origin",
  });
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(await response.json());
};

export const post = async function <T, K>(url: string, data: T): Promise<K> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(await response.json());
};
