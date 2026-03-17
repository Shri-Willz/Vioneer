import { Building2, Briefcase, Wrench, Dumbbell, Stethoscope } from "lucide-react"

export function SocialProof() {
  const industries = [
    { icon: Stethoscope, label: "Dental Clinics" },
    { icon: Briefcase, label: "Law Firms" },
    { icon: Wrench, label: "HVAC Techs" },
    { icon: Dumbbell, label: "Fitness Centers" },
    { icon: Building2, label: "Medical Offices" },
  ]

  return (
    <section className="py-12 border-y border-border/50 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by high-volume businesses across industries
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-300"
            >
              <industry.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{industry.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
