import React, { useState } from "react";
import type { LoginData, SignUpData, Field } from "../../utils/types";

interface AuthFormProps<T> {
  fields: Field[];
  onSubmit: (formData: T) => Promise<void>;
  buttonText: string;
  declaration: string;
}

const AuthForm = <T extends LoginData | SignUpData>({
  fields,
  onSubmit,
  buttonText,
  declaration,
}: AuthFormProps<T>) => {
  const [formData, setFormData] = useState<T>({} as T);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value } as T);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {fields.map(({ name, type = "text", placeholder }) => (
        <input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={(formData as any)[name] || ""}
          onChange={handleChange}
          required
        />
      ))}

      <button type="submit">{buttonText}</button>
      <p className="auth-declaration">{declaration}</p>
      <p className="auth-error">{error || "\u00A0"}</p>
    </form>
  );
};

export default AuthForm;
