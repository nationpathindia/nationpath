export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      height: "70vh",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{fontSize:"42px", marginBottom:"10px"}}>
        404
      </h1>

      <p style={{fontSize:"18px"}}>
        Page not found
      </p>

      <a href="/" style={{
        marginTop:"20px",
        padding:"10px 20px",
        background:"#e11d48",
        color:"#fff",
        textDecoration:"none",
        borderRadius:"6px"
      }}>
        Go Home
      </a>
    </div>
  );
}