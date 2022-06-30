import Image from "next/image";
import { MouseEventHandler } from "react";
import dice from "../../images/dice.svg"

export default function Shuffle({ handleShuffle }: { handleShuffle?: MouseEventHandler }) {
    return (
        <div
            onClick={handleShuffle}
            style={{
                display: "flex", marginTop: 40, marginBottom: 40, alignItems: "center", gap: 5, cursor: "pointer",
                backgroundColor: "white", borderRadius: 8, padding: 4, boxShadow: "0px 0px 8px rgba(0,0,0,0.6)", userSelect: "none"
            }}>
            <Image style={{ opacity: 0.7 }} src={dice} height={40} width={40} />
            <h3 style={{ marginTop: -5 }}>{`Shuffle`}</h3>
        </div>
    )
}


