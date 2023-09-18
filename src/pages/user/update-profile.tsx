import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { regExp } from "../../constants/regExp.constant";
import { useMe } from "../../hooks/useMe";
import { UpdateProfileInput, UpdateProfileOutput } from "../../gql/graphql";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";

const UPDATE_PROFILE_MUTATION = gql`
  mutation updateProfileMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  email: string;
  password: string;
}

export const UpdateProfilePage = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const [updateProfile, { loading }] = useMutation<
    { updateProfile: UpdateProfileOutput },
    { input: UpdateProfileInput }
  >(UPDATE_PROFILE_MUTATION, {
    onCompleted: ({ updateProfile: { ok, error } }) => {
      if (ok && userData) {
        const {
          me: { email: prevEmail, id },
        } = userData;
        const { email: newEmail } = getValues();
        if (prevEmail !== newEmail) {
          client.writeFragment({
            id: `User:${id}`,
            fragment: gql`
              fragment UpdatedUser on User {
                verified
                email
              }
            `,
            data: {
              email: newEmail,
              verified: false,
            },
          });
        }
      }
    },
  });

  const onSubmit = ({ email, password }: IForm) => {
    updateProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Update Profile | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("email", {
            pattern: regExp.email,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
