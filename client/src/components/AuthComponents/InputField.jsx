import { useId } from "react";
import PasswordInput from "../BaseComponents/PasswordInput";

export default function InputField({ label, type, id, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="input-group">
      <label htmlFor={inputId}>{label}</label>
      {type === "password" ? (
        <PasswordInput id={inputId} {...props} />
      ) : (
        <input id={inputId} type={type} {...props} />
      )}
    </div>
  );
}