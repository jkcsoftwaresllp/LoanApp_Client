import style from "./style/File.module.css";
export const DocumentTypeSelect = ({ value, onChange }) => {
  return (
    <div className="flex justify-center">
      {" "}
      {/* Centers content horizontally */}
      <div className="w-full" style={{ maxWidth: "350px" }}>
        {" "}
        {/* Sets max-width and allows flexibility */}
        <label htmlFor="type" className={style.fileName}>
          Document Type
        </label>
        <select
          id="type"
          name="type"
          value={value}
          onChange={onChange}
          className={style.select}
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
