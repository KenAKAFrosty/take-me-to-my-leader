import { Leader } from "../../functions/getPoliticalLeaders";

export default
    function MessageButton({ preferredLeader, subjectLines, body }:
        { preferredLeader: Leader, subjectLines?: string[], body: string }) {

    let href = `mailto:${preferredLeader.emails[0]}`
    if (subjectLines) {
        const randomIndex = Math.floor(Math.random() * subjectLines.length);
        href += `?subject=${subjectLines[randomIndex]}&body=${body ? body.replaceAll("\n", " ") : ""}`
    }

    const shadow = "0px 0px 7px rgba(0,0,0,0.44)"
    return (
        <a href={href} >
            <button
                className='gradient-border'
                onClick={async () => {
                    navigator.clipboard.writeText(body).then(() => {
                        //no op
                    })
                }}
                style={{
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: 4,
                    boxShadow: shadow,
                    fontSize: 24,
                    fontWeight: "bold",
                    fontFamily: "inherit",
                    border: "none",
                    backgroundColor: "white"
                }}>
                Message Me!
            </button>
        </a >
    )
}

