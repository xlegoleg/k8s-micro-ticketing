import { toDefaultPostPayload, useRequest } from "../utils/client-data-fetch";

export interface IUserCreds {
  email: string;
  password: string;
};

export const useSignin = ({ email, password }: IUserCreds) => {
  return useRequest({
    url: '/api/users/signin',
    payload: toDefaultPostPayload({ email, password }),
  });
};

export const useSignup = ({ email, password }: IUserCreds) => {
  return useRequest({
    url: '/api/users/signup',
    payload: toDefaultPostPayload({ email, password }),
  });
};

export const useSignout = () => {
  return useRequest({
    url: '/api/users/signout',
    payload: { method: 'POST' },
  });
};

export const useCurrentUser = () => {
  return useRequest({
    url: '/api/users/current',
  });
};