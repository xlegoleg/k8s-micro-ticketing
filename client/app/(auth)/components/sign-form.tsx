'use client'

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup, useSignin } from "../../lib/hooks/auth";
import { UserContext } from "../../lib/context/user";

export interface ISignFormProps {
  isSignIn?: boolean;
}

const SignForm = ({ isSignIn = false }: ISignFormProps) => {
  const {setUser} = useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {request, errors, resetErrors} = isSignIn ? useSignin({ email, password }) : useSignup({ email, password });

  const submitHandle = async () => {
    const success = await request();
    setUser(success);
    if (success) {
      router.push('/');
    }
  };

  const cancelHandle = () => {
    setEmail('');
    setPassword('');
    resetErrors();
  };

  return <>
    <h2 className="mb-3 px-3">{`Sign ${isSignIn ? 'In' : 'Up'}`}</h2>
    <form className="mx-3" onSubmit={(e) => { e.preventDefault(); submitHandle() }}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input 
          type="email"
          className="form-control" 
          aria-describedby="emailHelp" 
          placeholder="Enter email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password" 
          className="form-control" 
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-2">
        <button disabled={!email || !password} type="submit" className="btn btn-outline-primary">
          {`Sign ${isSignIn ? 'In' : 'Up'}`}
        </button>
        <button className="btn btn-outline-secondary" onClick={(e) => { e.preventDefault(); cancelHandle(); }}>Cancel</button>
      </div>
    </form>
    {!!errors.length && (
      <div className="mt-5 mx-3">
        <div className="alert alert-danger">
          <ul className="my-0">
            {errors.map((err: any) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </>
};

export default SignForm;