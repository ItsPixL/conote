import { useNavigate } from "react-router-dom";
import type { AuthPageProps } from "../../utils/types";
import "./AuthPage.css";

const AuthPage: React.FC<AuthPageProps> = ({
  title,
  subtitle,
  redirectText,
  redirectPath,
  redirectLinkText,
  FormComponent,
}) => {
  const navigate = useNavigate();
  const redirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(redirectPath);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-text">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <p>
            {redirectText} <a onClick={redirect}>{redirectLinkText}</a>
          </p>
        </div>
        <FormComponent />
      </div>
    </div>
  );
};

export default AuthPage;
