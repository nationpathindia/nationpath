"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Editor({ value, onChange }: any) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      className="bg-white dark:bg-gray-800"
    />
  );
}