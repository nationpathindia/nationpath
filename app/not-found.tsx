export default function NotFound() {
  return (
    <div style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      height:"100vh",
      fontFamily:"sans-serif"
    }}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:"48px",marginBottom:"10px"}}>404</h1>
        <p>Page not found</p>
      </div>
    </div>
  );
}