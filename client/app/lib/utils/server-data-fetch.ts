import { headers, cookies } from 'next/headers';

export const useServerRequest = ({ url, payload = { method: 'GET'} }: any) => {
  const headersList = headers();
  const cookiesMap = cookies();
  const DEFAULT_ERRORS = [{ message: 'Something went wrong...' }];
  let errors;

  const request = async () => {
    console.log(cookiesMap);
    try {
      const headers = {
        ...(payload.headers ?? {}),
        'Host': headersList.get('host'),
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_ROOT}${url}`, {
        ...payload,
        headers,
        credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin',
      });
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        errors = result.errors ?? DEFAULT_ERRORS;
        return null;
      }
    } catch (err) {
      errors = DEFAULT_ERRORS;
      return null;
    }
  }

  return { request, errors };
}