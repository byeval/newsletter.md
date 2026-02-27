"use client";

import { useState } from "react";

type UploadResult = {
  upload_url: string;
  key: string;
  public_url: string;
};

export default function UploadWidget() {
  const [status, setStatus] = useState<string>("");

  async function handleUpload(file: File) {
    setStatus("Requesting upload...");
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename: file.name, content_type: file.type }),
    });
    if (!res.ok) {
      setStatus("Upload request failed");
      return;
    }
    const data = (await res.json()) as UploadResult;
    setStatus("Uploading...");
    const put = await fetch(data.upload_url, {
      method: "PUT",
      headers: { "content-type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!put.ok) {
      setStatus("Upload failed");
      return;
    }
    const input = document.getElementById("cover_url") as HTMLInputElement | null;
    if (input) input.value = data.public_url || data.key;
    setStatus("Uploaded");
  }

  return (
    <div>
      <label>
        Upload cover image
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
      </label>
      {status ? <p>{status}</p> : null}
    </div>
  );
}
