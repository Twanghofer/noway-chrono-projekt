export async function customFetch<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Status: ${response.status} -  Failed to fetch ${url}`);
  }

  return (await response.json()) as T;
}
