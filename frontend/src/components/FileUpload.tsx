import { ChangeEvent, useRef } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import "./FileUpload.css";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
}

// Lets the user attach image files when creating or editing a listing.
// Previews are generated locally so nothing uploads until the form is submitted.
function FileUpload({ files, onChange, existingImages = [], onRemoveExisting }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(event: ChangeEvent<HTMLInputElement>): void {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    onChange([...files, ...selected]);
    event.target.value = "";
  }

  function removeFile(index: number): void {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="file-upload">
      <button
        type="button"
        className="file-dropzone"
        onClick={() => inputRef.current?.click()}
      >
        <FiUploadCloud size={26} />
        <span className="file-dropzone-title">Upload property images</span>
        <span className="file-dropzone-hint">PNG or JPG, up to 5MB each</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleSelect}
      />

      {(existingImages.length > 0 || files.length > 0) && (
        <div className="file-previews">
          {existingImages.map((url) => (
            <div className="file-preview" key={url}>
              <img src={url} alt="Existing property" />
              {onRemoveExisting ? (
                <button
                  type="button"
                  className="file-preview-remove"
                  onClick={() => onRemoveExisting(url)}
                  aria-label="Remove image"
                >
                  <FiX size={14} />
                </button>
              ) : null}
            </div>
          ))}

          {files.map((file, index) => (
            <div className="file-preview" key={`${file.name}-${index}`}>
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <button
                type="button"
                className="file-preview-remove"
                onClick={() => removeFile(index)}
                aria-label="Remove image"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
