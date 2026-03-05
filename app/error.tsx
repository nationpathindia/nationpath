"use client";

export default function GlobalError({
  error,
}: {
  error: Error;
}) {

  console.error(error);

  return (
    <div style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      height:"100vh"
    }}>
      <h1>Something went wrong</h1>
    </div>
  );
}