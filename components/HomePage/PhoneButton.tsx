

export default function PhoneButton({ phoneNumber }: { phoneNumber: string }) {
    const shadow = "0px 0px 7px rgba(0,0,0,0.44)"
    return (
      <a href={`tel:${phoneNumber}`}>
        <div style={{
          backgroundColor: "white", display: "flex", alignItems: "center",
          paddingTop: 2, paddingBottom: 2, borderRadius: 4, boxShadow: shadow
        }}>
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd"><path d="M16 22.621l-3.521-6.795c-.007.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.082-1.026-3.492-6.817-2.106 1.039c-1.622.845-2.298 2.627-2.289 4.843.027 6.902 6.711 18.013 12.212 18.117.575.011 1.137-.098 1.677-.345.121-.055 2.102-1.029 2.11-1.033zm4-5.621h-1v-13h1v13zm-2-2h-1v-9h1v9zm4-1h-1v-7h1v7zm-6-1h-1v-5h1v5zm-2-1h-1v-3h1v3zm10 0h-1v-3h1v3zm-12-1h-1v-1h1v1z" /></svg>
        </div>
      </a>
    )
  }
  