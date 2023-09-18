import { gql, useApolloClient, useMutation } from "@apollo/client";
import { VerifyEmailInput, VerifyEmailOutput } from "../../gql/graphql";
import { useEffect } from "react";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmailMutation($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmailPage = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const [verifyEmail] = useMutation<
    { verifyEmail: VerifyEmailOutput },
    { input: VerifyEmailInput }
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted: (data) => {
      const {
        verifyEmail: { ok },
      } = data;
      if (ok && userData?.me.id) {
        client.writeFragment({
          id: `User:${userData.me.id}`,
          fragment: gql`
            fragment VerifiedUser on User {
              verified
            }
          `,
          data: {
            verified: true,
          },
        });
        history.push("/");
      }
    },
  });

  useEffect(() => {
    const code = window.location.href.split("code=")[1];
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [verifyEmail]);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Uber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
