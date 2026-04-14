export default function InputField({ label, ...props }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}