import { useEffect } from "react";

export default function Register() {
  useEffect(() => {
    document.title = "Holidaze | Register";
  }, []);
  return <h1>Register</h1>;
}
