'use client'
import { use } from 'react'
import VapiDemo from "@/components/vapi-demo";
import  {usePathname} from "next/navigation"
 
export default function Page()
{
    const pathname = usePathname()
    console.log(pathname)
    return <VapiDemo/>

}