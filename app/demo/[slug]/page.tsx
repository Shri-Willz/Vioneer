'use client'

import VapiWidget from "../../../components/Vapi-widget";
import { usePathname } from "next/navigation";


const  vapiconfi ={
    vapi_api_key: process.env.NEXT_PUBLIC_VAPI_KEY || "",

    assistants: {
        "/demo/dental" : process.env.NEXT_PUBLIC_DENTAL_AGENT || "",
        "/demo/consulting": process.env.NEXT_PUBLIC_CONSULTING_AGENT || "",
        "/demo/homeServices": process.env.NEXT_PUBLIC_HOME_SERVICES_AGENT || "",
        "/demo/realEstate": process.env.NEXT_PUBLIC_REAL_ESTATE_AGENT || "",
        "/demo/general": process.env.NEXT_PUBLIC_GENERAL_AGENT || ""
    }
}

export default function DemoNiche(){
    const pathname: string = usePathname()
    const vapi_api = vapiconfi.vapi_api_key
    const assistantsid = vapiconfi.assistants[pathname as keyof typeof vapiconfi.assistants]

    return(
    <VapiWidget
     apiKey={vapi_api}
     assistantId={assistantsid}
     />
    )
}