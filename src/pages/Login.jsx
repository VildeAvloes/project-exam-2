import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    document.title = "Holidaze | Login";
  }, []);

  return <h1>Login</h1>;
}
