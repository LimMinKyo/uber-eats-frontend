import { useForm } from "react-hook-form";
import { FormError } from "../components/FormError";
import { gql, useMutation } from "@apollo/client";
import { LoginInput, LoginOutput } from "../gql/graphql";
import logoSvg from "../images/logo.svg";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { accessTokenVar, isLoggedInVar } from "../apollo";
import { ACCESS_TOKEN } from "../constants";
import { regExp } from "../constants/regExp.constant";

interface IForm {
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation loginMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

export const LoginPage = () => {
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    { login: LoginOutput },
    { input: LoginInput }
  >(LOGIN_MUTATION);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IForm>();

  const onCompleted = (data: { login: LoginOutput }) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(ACCESS_TOKEN, token);
      accessTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const onSubmit = () => {
    const { email, password } = getValues();
    console.log(email);
    console.log(password);
    loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
      onCompleted,
    });
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logoSvg} className="w-52 mb-10" alt="Uber Eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern: regExp.email,
            })}
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          <input
            {...register("password", {
              required: "Password is required",
            })}
            required
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <Button canClick={isValid} loading={loading} actionText={"Log in"} />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error || ""} />
          )}
        </form>
        <div>
          New to Uber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
