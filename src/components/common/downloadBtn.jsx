import "./style/uploadBtn.css";
import { UploadIcon, DocumentIcon } from "./assets";

const DownloadBtn = () => {
  return (
    <button className="download-button">
      <div className="docs">
        <DocumentIcon />
        Upload Docs
      </div>
      <div className="download">
        <UploadIcon />
      </div>
    </button>
  );
};

export default DownloadBtn;
