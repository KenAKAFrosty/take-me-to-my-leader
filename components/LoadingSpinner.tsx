
export default function LoadingSpinnerWithMessage({ message, loading }: { message: string, loading: boolean }) {

    return (
        <>
            <h1 style={{
                textAlign: "center",
                maxWidth: 900,
                lineHeight: 1.15,
                marginBottom: 20,
                fontSize: "calc(16px + 5vw)",
                transition: "220ms ease-in-out",
                opacity: loading ? 1 : 0,
                height: loading ? "auto" : 0
            }}>
                {message}
            </h1>

            <img
                className='spinning'
                src="/apple-touch-icon.png"
                height={75}
                width={75}
                style={{
                    opacity: loading ? 1 : 0,
                    height: loading ? "auto" : 0
                }} />
        </>
    )
}
