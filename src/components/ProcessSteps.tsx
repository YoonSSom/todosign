import { FileText, UserCheck, PenTool } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "문서 수신",
    description: "병원에서 발송한 수술 동의서를 확인합니다",
    icon: FileText,
  },
  {
    number: 2,
    title: "본인인증",
    description: "안전한 본인인증 절차를 진행합니다",
    icon: UserCheck,
  },
  {
    number: 3,
    title: "전자서명",
    description: "수술 동의서에 전자서명을 완료합니다",
    icon: PenTool,
  },
];

const ProcessSteps = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            간편한 <span className="text-gradient">3단계</span> 프로세스
          </h2>
          <p className="text-muted-foreground text-lg">
            누구나 쉽게 따라할 수 있는 간단한 절차
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center group animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step Number Circle */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
