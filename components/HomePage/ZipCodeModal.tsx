import Modal from "../Modal";

export default function ZipCodeModal({ updateZip, queueUpdateShowModal }:
    { updateZip: Function, queueUpdateShowModal: Function }) {

    function setZipAndClose(zip: string) {
        console.log('zip is', zip);
        console.log('closing')
        if (zip) { updateZip(zip) };
        queueUpdateShowModal(false);
    }

    return (
        <Modal >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3 style={{
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 4,
                }}>
                    Enter Zip
                </h3>
                <input autoFocus
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
                        cursor: "pointer"
                    }}
                    onClick={(event) => {
                        const target = event.target as HTMLButtonElement;
                        const container = target.parentElement;
                        const input = container?.querySelector('input');
                        const zip = input?.value;
                        setZipAndClose(zip || "");
                    }}>
                    Update
                </button>
            </div>
        </Modal>
    )
}