const DocumentTypeSelect = ({ value, onChange }) => {
    return (
      <div>
        <label htmlFor="type" className="block text-lg font-medium text-gray-600 mb-2">Document Type</label>
        <select
          id="type"
          name="type"
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Document Type</option>
          <option value="id_proof">ID Proof</option>
          <option value="aadhar">Aadhar</option>
          <option value="pan">PAN</option>
          <option value="other">Other</option>
        </select>
      </div>
    );
  };
  
  export default DocumentTypeSelect;
  