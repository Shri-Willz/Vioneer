"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { redirect } from 'next/navigation'

type Question = {
    id: string
    question: string
    type: "select" | "yesno" | "number" | "textarea"
    options?: string[]
    placeholder?: string
};

const questions: Question[] =[
    {
        id: "industry",
        question: "What industry are you in?",
        type: "select",
        options: ["Medical/Dental", "Consulting", "Home Services", "Real Estate", "Other"],
    }
]


export default function VapiDemo(){

    const handleSelectOption = (value:string)  => {
      switch(value){
        case "Medical/Dental":
          value = redirect("/demo/dental");
        case "Consulting":
          value = redirect("/demo/consulting");
        case "Home Services":
          value = redirect("/demo/homeServices");
        case "Real Estate":
          value = redirect("/demo/realEstate");
        case "Other":
          value = redirect("demo/general");
      }
    }
    return(
        <div className="px-4 py-20 md:py-28 mx-auto max-w-2x w-200">
            <Card className="overflow-hidden border-border bg-card shadow-xl mb-8 ">
                <div className="border-b border-border bg-black/30 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                            Question 
                        </span>
                    </div>
                </div>
            <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                {questions[0].question}
              </h3>
            </div>
              <div className="space-y-3">
              {questions[0].type === "select" && questions[0].options && (
                <div className="grid gap-3">
                  {questions[0].options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className={cn(
                        "h-auto justify-start p-4 text-left text-base text-foreground transition-all duration-200",
                        questions[0].id=== option
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50 hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => handleSelectOption(option)}
                    >
                      <div>
                        {questions[0].id === option && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            </CardContent>
            </Card>
        </div>
    )
}