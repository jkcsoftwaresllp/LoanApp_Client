import style from "./style/File.module.css";

export const DocumentTypeSelect = ({ value, onChange }) => {
  return (
    <div className="flex justify-center items-center w-full ml-2">
      <div className="w-4/5 max-w-lg">
        <label htmlFor="type" className={style.fileName}>
          Document Type
        </label>
        <select
          id="type"
          name="type"
          value={value}
          onChange={onChange}
          className={`${style.select} w-4/5 max-w-lg`}
          required
        >
          <option value="">Select Document Type</option>
          <option value="id_proof">ID Proof</option>
          <option value="aadhar">Aadhar</option>
          <option value="pan">PAN</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
};
