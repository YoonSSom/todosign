import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "전자서명의 법적 효력은 어떻게 되나요?",
    answer:
      "전자서명법에 따라 전자서명은 서면 서명과 동일한 법적 효력을 가집니다. 본 서비스는 공인된 본인인증 절차를 거쳐 안전하게 서명을 진행합니다.",
  },
  {
    question: "본인인증은 어떤 방식으로 진행되나요?",
    answer:
      "휴대폰 본인인증과 얼굴 인식을 통한 본인확인 절차를 진행합니다. 환자 본인만이 서명할 수 있도록 철저한 인증 시스템을 갖추고 있습니다.",
  },
  {
    question: "서명 후 동의서를 다시 확인할 수 있나요?",
    answer:
      "네, 서명 완료 후 동의서 사본을 출력하거나 PDF로 저장할 수 있습니다. 또한 병원 방문 시에도 언제든지 확인 가능합니다.",
  },
  {
    question: "미성년자의 경우 어떻게 서명하나요?",
    answer:
      "미성년자의 경우 법정대리인(보호자)의 동의가 필요합니다. 환자 본인과 보호자 모두의 서명이 진행되며, 보호자의 본인인증도 함께 진행됩니다.",
  },
  {
    question: "수술 내용에 대해 추가 설명이 필요하면 어떻게 하나요?",
    answer:
      "AI 음성 상담을 통해 수술 관련 질문에 대한 답변을 받으실 수 있습니다. 더 자세한 상담이 필요한 경우 의료진 면담을 신청하실 수 있습니다.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            자주 묻는 <span className="text-gradient">질문</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            궁금한 점을 확인해보세요
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-xl border border-border/50 px-6 shadow-sm data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-foreground font-medium py-5 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
