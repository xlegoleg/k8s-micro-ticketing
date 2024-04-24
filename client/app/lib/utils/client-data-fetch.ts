import { useState } from "react";

export const useRequest = ({ url, payload = { method: 'GET'} }: any) => {
  const [errors, setErrors] = useState([] as any);
  const DEFAULT_ERRORS = [{ message: 'Something went wrong...' }];

  const request = async () => {
    try {
      setErrors([]);

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_ROOT}${url}`, {
        ...payload,
        headers: (payload.headers ?? {}),
        credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin',
      });
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        setErrors(result?.errors ?? DEFAULT_ERRORS);
        return null;
      }
    } catch (err) {
      setErrors(DEFAULT_ERRORS);
      return null;
    }
  }

  const resetErrors = () => {
    setErrors([]);
  }

  return { request, errors, resetErrors };
}

export const toDefaultPostPayload = (body: Record<string, any> = {}) => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(body),
  }
}