import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import { FormError } from "../components/FormError";
import logoSvg from "../images/logo.svg";
import {
  CreateAccountInput,
  CreateAccountOutput,
  UserRole,
} from "../gql/graphql";
import { regExp } from "../constants/regExp.constant";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccountPage = () => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<
    { createAccount: CreateAccountOutput },
    { input: CreateAccountInput }
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted: (data: { createAccount: CreateAccountOutput }) => {
      const {
        createAccount: { ok },
      } = data;
      if (ok) {
        history.push("/");
      }
    },
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          input: { email, password, role },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logoSvg} className="w-52 mb-10" alt="Uber Eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
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
            {...register("password", { required: "Password is required" })}
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
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <Button
            canClick={isValid}
            loading={loading}
            actionText={"Create Account"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
