'use client'

import VapiWidget from "../../../components/Vapi-widget";
import { vapiconfi } from "../../../components/vapiconfig";
import { usePathname } from "next/navigation";

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