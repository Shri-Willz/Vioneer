import { Clock, PhoneOff, UserMinus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const problems = [
  {
    icon: Clock,
    title: "The After-Hours Gap",
    description: "Missed calls at 7 PM cost you thousands.",
  },
  {
    icon: PhoneOff,
    title: "The Voicemail Black Hole",
    description: "People don't leave messages; they hang up.",
  },
  {
    icon: UserMinus,
    title: "Staff Burnout",
    description: "Your front desk is too busy answering FAQs to close hot leads.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-balance">
          Where Your Revenue is <span className="text-destructive">Leaking</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Every missed call is a missed opportunity. Here&apos;s where most businesses lose money:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <Card
              key={index}
              className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <problem.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
