import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SURGERY_CONSENT_CONTEXT = `
당신은 수술 동의서에 대해 설명하는 전문 의료 상담 AI입니다.
다음 수술 동의서 내용을 기반으로 환자의 질문에 친절하고 정확하게 답변해주세요.

## 수술 동의서 주요 내용

### 1. 수술 정보
- 수술명: 무릎 관절경 수술
- 예정 수술일: 환자 본인 확인 후 결정
- 담당 의사: 김철수 (정형외과 전문의)

### 2. 수술 목적
- 무릎 관절 내부 손상 확인 및 치료
- 반월상 연골 손상 수복
- 관절 내 이물질 제거

### 3. 수술 방법
- 전신마취 또는 척추마취 하에 진행
- 무릎에 2-3개의 작은 절개(약 0.5cm)
- 관절경 삽입하여 관절 내부 관찰 및 치료
- 수술 시간: 약 30분~1시간

### 4. 예상되는 위험 및 합병증
- 일반적 위험: 출혈, 감염, 마취 관련 합병증
- 수술 관련 위험: 신경 손상, 혈관 손상, 관절 강직
- 드문 합병증: 심부정맥 혈전증, 폐색전증

### 5. 수술 후 주의사항
- 수술 후 2-3일간 목발 사용
- 2주간 격렬한 운동 금지
- 정기적인 외래 방문 필요
- 물리치료 권장

### 6. 환자 권리
- 수술 전 언제든지 동의를 철회할 수 있습니다
- 추가 설명을 요청할 권리가 있습니다
- 다른 치료 방법에 대해 문의할 수 있습니다

답변 시 주의사항:
- 의학적 조언은 담당 의사와 상담하도록 안내
- 친절하고 이해하기 쉬운 언어 사용
- 불안감을 줄이도록 안심시키는 어조 유지
- 질문과 관련 없는 내용은 답변하지 않음
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SURGERY_CONSENT_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "서비스 이용 한도를 초과했습니다." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI 서비스 오류가 발생했습니다." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "알 수 없는 오류" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
