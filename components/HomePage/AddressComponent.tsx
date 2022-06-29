import { Address } from "../../functions/getPoliticalLeaders";

export default function AddressComponent({ address }: { address: Address }) {
    return (
        <div style={{textAlign: "center", fontSize: 12}}>
            <p>{address.locationName}</p>
            <p>{address.line1}</p>
            <span>{address.line2}</span>
            <p>{address.line3}</p>
            <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
        </div>
    )
}
