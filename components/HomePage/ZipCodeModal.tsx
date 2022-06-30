import { useState } from "react";
import Modal from "../Modal";

export default function ZipCodeModal({ updateZip, queueSetShowModal }:
    { updateZip: Function, queueSetShowModal: Function }) {
    const [staleIsValid, queueSetIsValid] = useState<boolean>(true)

    function setZipAndClose(zip: string) {
        if (!zip) {
            queueSetShowModal(false);
            return;
        }

        queueSetIsValid(zip.length === 5);
        if (zip.length === 5) {
            updateZip(zip);
            queueSetShowModal(false)
        }
    }

    return (
        <Modal onBackgroundTap={() => { queueSetShowModal(false) }}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    backgroundColor: "white", padding: 16, borderRadius: 6,
                }}>
                <h3 style={{
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 4,
                }}>
                    {`Enter Zip`}
                </h3>
                <input autoFocus
                    type="number"
                    style={{
                        borderRadius: 4,
                        height: 50,
                        width: 100,
                        textAlign: "center",
                        fontSize: 28,
                        fontFamily: "inherit"
                    }}
                    onKeyDown={(event) => {
                        if (event.key !== "Enter") return;

                        const target = event.target as HTMLInputElement;
                        setZipAndClose(target.value)
                    }}>
                </input>

                <button
                    style={{
                        backgroundColor: "white",
                        border: "none",
                        marginTop: 20,
                        borderRadius: 4,
                        padding: 4,
                        fontSize: 20,
                        height: 50,
                        width: "fit-content",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        boxShadow: "0 0 7px rgba(0,0,100,0.4)"
                    }}
                    onClick={(event) => {
                        const target = event.target as HTMLButtonElement;
                        const container = target.parentElement;
                        const input = container?.querySelector('input');
                        const zip = input?.value;
                        setZipAndClose(zip || "");
                    }}>
                    {`Update`}
                </button>

                {!staleIsValid &&
                    <p style={{ marginTop: 10, color: "hsl(0deg, 60%, 60%)", textAlign: "center" }}>
                        {`Error`}<br />
                        {`Should be 5 numbers`}
                    </p>}
            </div>
        </Modal>
    )
}