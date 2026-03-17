"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Calendar, DollarSign, AlertCircle, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"

interface FormData {
  industry: string
  has24x7Voice: string
  callsOnHold: string
  crmLogging: string
  missedCallTextBack: string
  staffAnsweringFAQs: string
  afterHoursService: string
  runningPaidAds: string
  followUpWithin5Min: string
  reducingPayrollPriority: string
  ticketValue: string
  missedCalls: string
  primaryGoal: string
  monthlyBudget: string
  businessDescription: string
}

type Question = {
  id: keyof FormData
  question: string
  type: "select" | "yesno" | "number" | "textarea"
  options?: string[]
  placeholder?: string
}

const questions: Question[] = [
  {
    id: "industry",
    question: "What industry are you in?",
    type: "select",
    options: ["Medical/Dental", "Legal", "Home Services", "Fitness", "Other"],
  },
  {
    id: "has24x7Voice",
    question: "Do you have a live voice answering calls 24/7?",
    type: "yesno",
  },
  {
    id: "callsOnHold",
    question: "Are callers ever put on hold for >45 seconds?",
    type: "yesno",
  },
  {
    id: "crmLogging",
    question: "Does your team log every call into a CRM automatically?",
    type: "yesno",
  },
  {
    id: "missedCallTextBack",
    question: "Do you have an automatic missed-call text-back system?",
    type: "yesno",
  },
  {
    id: "staffAnsweringFAQs",
    question: "Do staff spend >2 hours daily answering basic FAQs?",
    type: "yesno",
  },
  {
    id: "afterHoursService",
    question: "Do you currently pay for an after-hours answering service?",
    type: "yesno",
  },
  {
    id: "runningPaidAds",
    question: "Are you actively running paid ads to generate calls?",
    type: "yesno",
  },
  {
    id: "followUpWithin5Min",
    question: "Do you follow up with unconverted leads within 5 minutes?",
    type: "yesno",
  },
  {
    id: "reducingPayrollPriority",
    question: "Is reducing front-desk payroll a priority this year?",
    type: "yesno",
  },
  {
    id: "ticketValue",
    question: "What is the average lifetime value (or ticket size) of one customer in dollars?",
    type: "number",
    placeholder: "e.g., 500",
  },
  {
    id: "missedCalls",
    question: "Roughly how many inbound calls go to voicemail or drop each week?",
    type: "number",
    placeholder: "e.g., 25",
  },
  {
    id: "primaryGoal",
    question: "What is your primary goal for the next 90 days?",
    type: "select",
    options: ["Stop missing leads", "Reduce workload", "Improve data entry"],
  },
  {
    id: "monthlyBudget",
    question: "If an AI guaranteed zero missed calls, what monthly budget makes sense?",
    type: "select",
    options: ["<$500", "$500-$1000", "$1000+"],
  },
  {
    id: "businessDescription",
    question: "Tell me about your business and your current front-desk setup.",
    type: "textarea",
    placeholder: "Describe your business, team size, current call handling process...",
  },
]

const initialFormData: FormData = {
  industry: "",
  has24x7Voice: "",
  callsOnHold: "",
  crmLogging: "",
  missedCallTextBack: "",
  staffAnsweringFAQs: "",
  afterHoursService: "",
  runningPaidAds: "",
  followUpWithin5Min: "",
  reducingPayrollPriority: "",
  ticketValue: "",
  missedCalls: "",
  primaryGoal: "",
  monthlyBudget: "",
  businessDescription: "",
}

export function QuizForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showResults, setShowResults] = useState(false)
  const [errors, setErrors] = useState<string>("")

  const totalSteps = questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const currentQuestion = questions[currentStep]

  const updateFormData = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
    setErrors("")
  }

  const validateCurrentStep = (): boolean => {
    const value = formData[currentQuestion.id]

    if (!value || value.trim() === "") {
      setErrors("Please provide an answer to continue")
      return false
    }

    if (currentQuestion.type === "number") {
      const numValue = parseFloat(value)
      if (isNaN(numValue) || numValue <= 0) {
        setErrors("Please enter a valid positive number")
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setErrors("")
    }
  }

  const handleSelectOption = (value: string) => {
    updateFormData(value)
    // Auto-advance for select and yesno types
    if (currentQuestion.type === "select" || currentQuestion.type === "yesno") {
      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => prev + 1)
        } else {
          setShowResults(true)
        }
      }, 300)
    }
  }

  // Calculate monthly lost revenue
  const calculateLostRevenue = () => {
    const ticketValue = parseFloat(formData.ticketValue) || 0
    const missedCalls = parseFloat(formData.missedCalls) || 0
    return ticketValue * missedCalls * 4
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (showResults) {
    const lostRevenue = calculateLostRevenue()
    const ticketValue = parseFloat(formData.ticketValue) || 0

    return (
     <div className="min-h-screen bg-slate-950 pt-20 pb-20 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/50 mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Critical Insight</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl font-bold mb-4 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            You're losing
          </motion.h1>
        </div>

        {/* Main Revenue Display */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-red-900/20 to-red-900/10 border-red-500/30 p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-transparent"></div>
            </div>

            <motion.div
              className="relative z-10"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="text-red-400 text-xl mb-4">Annual Lost Revenue</p>
              <motion.div
                className="text-8xl font-bold text-red-500 mb-4 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                ${lostRevenue.toLocaleString()}
              </motion.div>
              <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Per Month</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${Math.round(lostRevenue/12).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Per Day</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${Math.round(lostRevenue/300).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          className="grid gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <AlertCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Main Challenge</p>
                <p className="text-2xl font-bold text-white capitalize">{formData.primaryGoal}</p>
                <p className="text-xs text-slate-500 mt-1">area to improve</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Insights</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"></div>
              <div>
                <p className="font-semibold text-white mb-1">Ineffective Call Pattern</p>
                <p className="text-slate-400">
                  Approximately 20% of your conversations are likely losing deals due to your identified challenge: <strong>{formData.primaryGoal}</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"></div>
              <div>
                <p className="font-semibold text-white mb-1">Revenue Impact</p>
                <p className="text-slate-400">
                  With an average deal value of ${parseInt(formData.ticketValue).toLocaleString()}, this translates to <strong>${lostRevenue.toLocaleString()} annually</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"></div>
              <div>
                <p className="font-semibold text-white mb-1">Opportunity</p>
                <p className="text-slate-400">
                  Improving your call quality could recover this revenue within 6-12 months through targeted training.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold">
            <Link href="/demo" className="flex items-center gap-2" onClick={(e) => {
              e.preventDefault();
              // Call VAPI integration here
              console.log('Starting VAPI demo...');
            }}>
              See Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Link href="/">Back to Home</Link>
          </Button>
        </motion.div>

        <motion.p
          className="text-center text-slate-400 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          Ready to improve your sales process? Our team can help you implement these insights.
        </motion.p>
      </motion.div>
    </div>
  );
  }

  return (
    <section id="quiz-section" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Your Missed Call Revenue Audit
          </h2>
          <p className="mt-2 text-muted-foreground">
            Answer 15 quick questions to get your personalized ROI report
          </p>
        </div>

        <Card className="overflow-hidden border-border bg-card shadow-xl">
          {/* Progress bar */}
          <div className="border-b border-border bg-black/30 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Answer options */}
            <div className="space-y-3">
              {currentQuestion.type === "select" && currentQuestion.options && (
                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className={cn(
                        "h-auto justify-start p-4 text-left text-base text-foreground transition-all duration-200",
                        formData[currentQuestion.id] === option
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50 hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => handleSelectOption(option)}
                    >
                      <div
                        className={cn(
                          "mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          formData[currentQuestion.id] === option
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        )}
                      >
                        {formData[currentQuestion.id] === option && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "yesno" && (
                <div className="grid gap-3 md:grid-cols-2">
                  {["Yes", "No"].map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className={cn(
                        "h-auto p-6 text-lg font-medium text-foreground transition-all duration-200  hover:border-white",
                        formData[currentQuestion.id] === option
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50 hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => handleSelectOption(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "number" && (
                <div>
                  <div className="relative">
                    {currentQuestion.id === "ticketValue" && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                        $
                      </span>
                    )}
                    <Input
                      type="number"
                      min="0"
                      placeholder={currentQuestion.placeholder}
                      value={formData[currentQuestion.id]}
                      onChange={(e) => updateFormData(e.target.value)}
                      className={cn(
                        "h-14 text-lg",
                        currentQuestion.id === "ticketValue" && "pl-8"
                      )}
                    />
                  </div>
                </div>
              )}

              {currentQuestion.type === "textarea" && (
                <Textarea
                  placeholder={currentQuestion.placeholder}
                  value={formData[currentQuestion.id]}
                  onChange={(e) => updateFormData(e.target.value)}
                  className="min-h-[150px] resize-none text-base"
                />
              )}
            </div>

            {/* Error message */}
            {errors && (
              <p className="mt-4 text-sm text-destructive">{errors}</p>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {(currentQuestion.type === "number" || currentQuestion.type === "textarea") && (
                <Button onClick={handleNext} className="gap-2">
                  {currentStep === totalSteps - 1 ? "See Results" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
