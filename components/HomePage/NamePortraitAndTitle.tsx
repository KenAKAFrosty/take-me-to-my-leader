import { Leader } from "../../functions/getPoliticalLeaders"

export function NamePortraitAndTitle({ preferredLeader }: { preferredLeader: Leader }) {
    const shadow = "0px 0px 2px rgba(0,0,0,0.24)"

    return (
        <div style={{ display: "flex", width: "100%", gap: 8, textAlign: "center" }}>
            <img
                src={preferredLeader.image}
                height={120}
                onError={(event) => {
                    const target = event.target as HTMLImageElement;
                    if (!target.src) return;
                    target.src = "";
                }}
                style={{
                    background: "linear-gradient(60deg, #f800df, #ad00f8, #010ff8, #0173f8)",
                    borderRadius: 4,
                    boxShadow: shadow
                }}
            />
            <div style={{ margin: "auto", }}>
                <p style={{
                    boxShadow: shadow,
                    height: "fit-content",
                    padding: 4,
                    fontSize: 26,
                    zIndex: 2,
                    borderTopRightRadius: 4,
                    borderTopLeftRadius: 4,
                    fontWeight: "bold",
                    wordBreak: "break-word",
                    backgroundColor: "white"
                }}>
                    {preferredLeader.name}
                </p>
                <p style={{
                    boxShadow: shadow,
                    height: "fit-content",
                    padding: 4,
                    fontSize: 22,
                    marginTop: 4,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderBottomRightRadius: 4,
                    borderBottomLeftRadius: 4,
                    backgroundColor: "white"
                }}>
                    {preferredLeader.office}
                </p>
            </div>
        </div>
    )
}
