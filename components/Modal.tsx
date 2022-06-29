import { ReactNode } from "react";

export default function Modal({children} : {children: ReactNode}) { 
    return ( 
        <section style={{ 
            position: "absolute",
            zIndex: 99,
            top:0,
            left:0,
            width:"100vw",
            height: "100vh",
            display: "flex",
            backgroundColor: "rgba(0,0,0,0.90)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {children}
        </section>
    )
}