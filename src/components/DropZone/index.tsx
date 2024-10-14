// DropzoneComponent.tsx
import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

interface DropzoneComponentProps {
  onDrop: any;
  acceptedFileTypes: DropzoneOptions["accept"];
  maxFiles?: number;
  isMultiple?: boolean;
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
  onDrop,
  acceptedFileTypes,
  maxFiles,
  isMultiple = false,
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: (files) => {
        const base64Files: string[] = [];
        const fileReaders: Promise<void>[] = [];

        files.forEach((file) => {
          const reader = new FileReader();
          fileReaders.push(
            new Promise((resolve, reject) => {
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  base64Files.push(reader.result);
                  resolve();
                } else {
                  reject(new Error("Failed to convert file to Base64"));
                }
              };
              reader.onerror = () => reject(new Error("File reading error"));
              reader.readAsDataURL(file);
            })
          );
        });

        Promise.all(fileReaders).then(() => {
          onDrop(base64Files);
        });
      },
      accept: acceptedFileTypes,
      maxFiles: isMultiple ? maxFiles : 1,
      multiple: isMultiple,
    });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #494a53",
        borderRadius: "4px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border 0.3s",
        backgroundColor: isDragActive
          ? "#e0f7fa"
          : isDragReject
          ? "#ffebee"
          : "#fff",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default DropzoneComponent;
