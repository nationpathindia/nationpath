"use client";

export default function Error() {
  return (
    <div style={{
      display:"flex",
      height:"70vh",
      alignItems:"center",
      justifyContent:"center",
      flexDirection:"column"
    }}>
      <h1>Something went wrong</h1>
      <a href="/">Go Home</a>
    </div>
  );
}