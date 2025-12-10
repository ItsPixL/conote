import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value } as T);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth__form">
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
      <p className="auth__form__declaration">{declaration}</p>
    </form>
  );
};

export default AuthForm;
