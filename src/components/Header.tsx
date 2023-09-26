import { Link, useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import logoSvg from "../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import { ACCESS_TOKEN } from "../constants";
import { accessTokenVar, isLoggedInVar } from "../apollo";
import { useApolloClient } from "@apollo/client";

export const Header = () => {
  const { data } = useMe();
  const history = useHistory();
  const client = useApolloClient();

  const onClickLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    accessTokenVar(null);
    isLoggedInVar(false);
    client.clearStore();
    history.replace("/");
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={logoSvg} className="w-44" alt="Uber Eats" />
          </Link>
          <div className="text-xs flex gap-8">
            <button type="button" onClick={onClickLogout}>
              <FontAwesomeIcon icon={faDoorOpen} className="text-3xl" />
            </button>
            <Link to="/update-profile">
              <FontAwesomeIcon icon={faUser} className="text-3xl" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
