export const  vapiconfi ={
    vapi_api_key: process.env.NEXT_PUBLIC_VAPI_KEY || "",

    assistants: {
        "/demo/dental" : process.env.NEXT_PUBLIC_DENTAL_AGENT || "",
        "/demo/consulting": process.env.NEXT_PUBLIC_CONSULTING_AGENT || "",
        "/demo/homeServices": process.env.NEXT_PUBLIC_HOME_SERVICES_AGENT || "",
        "/demo/realEstate": process.env.NEXT_PUBLIC_REAL_ESTATE_AGENT || "",
        "/demo/general": process.env.NEXT_PUBLIC_GENERAL_AGENT || ""
    }
}