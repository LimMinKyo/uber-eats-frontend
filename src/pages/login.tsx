import { useForm } from "react-hook-form";
import { FormError } from "../components/FormError";
import { gql, useMutation } from "@apollo/client";
import { LoginInput, LoginOutput } from "../gql/graphql";

interface IForm {
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

export const LoginPage = () => {
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    { login: LoginOutput },
    { loginInput: LoginInput }
  >(LOGIN_MUTATION);
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>();

  const onCompleted = (data: { login: LoginOutput }) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  const onSubmit = () => {
    const { email, password } = getValues();
    console.log(email);
    console.log(password);
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
      onCompleted,
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register("email", { required: "Email is required" })}
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
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
          <button className="mt-3 btn">
            {loading ? "Loading..." : "Log In"}
          </button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error || ""} />
          )}
        </form>
      </div>
    </div>
  );
};
