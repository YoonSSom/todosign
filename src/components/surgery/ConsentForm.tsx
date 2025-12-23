import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInYears } from "date-fns";
import { ko } from "date-fns/locale";
import { FileText, User, Stethoscope, Heart, ClipboardCheck, PenLine } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SignatureDialog from "./SignatureDialog";
import type { PatientInfo } from "@/pages/SurgeryConsent";

interface ConsentFormProps {
  patientInfo: PatientInfo;
  onComplete: () => void;
}

type HealthStatus = "yes" | "no" | "unknown";

interface HealthItem {
  id: string;
  label: string;
  value: HealthStatus;
}

const ConsentForm = ({ patientInfo, onComplete }: ConsentFormProps) => {
  // Form state
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [surgeryName, setSurgeryName] = useState("");
  const [surgeryMethod, setSurgeryMethod] = useState<string>("");
  const [surgeryDate, setSurgeryDate] = useState("");
  const [surgeryScope, setSurgeryScope] = useState<string[]>([]);
  
  const [healthItems, setHealthItems] = useState<HealthItem[]>([
    { id: "pastHistory", label: "과거 병력(질병·상해전력)", value: "unknown" },
    { id: "allergy", label: "알레르기", value: "unknown" },
    { id: "specialCondition", label: "특이체질", value: "unknown" },
    { id: "diabetes", label: "당뇨병", value: "unknown" },
    { id: "bloodPressure", label: "고·저혈압", value: "unknown" },
    { id: "medication", label: "복용약물", value: "unknown" },
    { id: "smoking", label: "흡연여부", value: "unknown" },
    { id: "heartDisease", label: "심장질환(심근경색 등)", value: "unknown" },
    { id: "respiratoryDisease", label: "호흡기질환(기침·가래 등)", value: "unknown" },
    { id: "kidneyDisease", label: "신장질환(부종 등)", value: "unknown" },
    { id: "drugAccident", label: "마약사고", value: "unknown" },
    { id: "airwayIssue", label: "기도이상", value: "unknown" },
    { id: "bleedingTendency", label: "출혈소인", value: "unknown" },
    { id: "other", label: "기타", value: "unknown" },
  ]);

  const [requiredConsents, setRequiredConsents] = useState({
    explained: false,
    understood: false,
    complications: false,
    cooperation: false,
  });

  const [optionalConsents, setOptionalConsents] = useState({
    methodChange: false,
    doctorChange: false,
    guardianCooperation: false,
    studentObservation: false,
  });

  const [additionalConsents, setAdditionalConsents] = useState({
    anesthesia: false,
    transfusion: false,
    surgeryMark: false,
    frozenSection: false,
    specialTest: false,
  });

  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  // Refs for scrolling
  const formRef = useRef<HTMLDivElement>(null);

  const surgeryScopes = [
    "자궁절제술",
    "난소 절제",
    "골반세척세포검사",
    "감시림프절",
    "골반 림프절",
    "대동맥주위 림프절",
  ];

  const handleHealthStatusChange = (id: string, value: HealthStatus) => {
    setHealthItems((items) =>
      items.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleSurgeryScopeChange = (scope: string, checked: boolean) => {
    setSurgeryScope((prev) =>
      checked ? [...prev, scope] : prev.filter((s) => s !== scope)
    );
  };

  const validateForm = (): boolean => {
    if (!registrationNumber.trim()) {
      toast.error("등록번호를 입력해주세요.");
      return false;
    }
    if (!surgeryName.trim()) {
      toast.error("수술명을 입력해주세요.");
      return false;
    }
    if (!surgeryMethod) {
      toast.error("수술방법을 선택해주세요.");
      return false;
    }
    if (!surgeryDate) {
      toast.error("시행예정일을 선택해주세요.");
      return false;
    }
    if (!requiredConsents.explained || !requiredConsents.understood || 
        !requiredConsents.complications || !requiredConsents.cooperation) {
      toast.error("필수 동의 항목을 모두 체크해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowSignatureDialog(true);
  };

  const handleSignatureComplete = () => {
    setShowSignatureDialog(false);
    onComplete();
  };

  const age = patientInfo.birthDate
    ? differenceInYears(new Date(), patientInfo.birthDate)
    : 0;

  return (
    <div ref={formRef} className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      {/* Patient Basic Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            환자 기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">등록번호</Label>
              <Input
                id="registrationNumber"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="등록번호 입력"
              />
            </div>
            <div className="space-y-2">
              <Label>성명</Label>
              <Input value={patientInfo.name} disabled className="bg-muted" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>생년월일</Label>
              <Input
                value={
                  patientInfo.birthDate
                    ? format(patientInfo.birthDate, "yyyy.MM.dd", { locale: ko })
                    : ""
                }
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>나이</Label>
              <Input value={`만 ${age}세`} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>성별</Label>
              <Input value="여성" disabled className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surgery Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="w-5 h-5 text-primary" />
            수술 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>진단명</Label>
              <Input value="자궁내막암" disabled className="bg-muted font-medium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surgeryName">수술명</Label>
              <Input
                id="surgeryName"
                value={surgeryName}
                onChange={(e) => setSurgeryName(e.target.value)}
                placeholder="수술명 입력"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>수술방법</Label>
            <RadioGroup value={surgeryMethod} onValueChange={setSurgeryMethod} className="flex gap-6">
              {["개복", "복강경", "로봇"].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <RadioGroupItem value={method} id={method} />
                  <Label htmlFor={method} className="font-normal cursor-pointer">{method}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>수술 범위</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {surgeryScopes.map((scope) => (
                <div key={scope} className="flex items-center space-x-2">
                  <Checkbox
                    id={scope}
                    checked={surgeryScope.includes(scope)}
                    onCheckedChange={(checked) => handleSurgeryScopeChange(scope, !!checked)}
                  />
                  <Label htmlFor={scope} className="font-normal text-sm cursor-pointer">{scope}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surgeryDate">시행예정일</Label>
            <Input
              id="surgeryDate"
              type="date"
              value={surgeryDate}
              onChange={(e) => setSurgeryDate(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Current Status */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-primary" />
            환자의 현재 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{item.label}</span>
                <RadioGroup
                  value={item.value}
                  onValueChange={(value) => handleHealthStatusChange(item.id, value as HealthStatus)}
                  className="flex gap-4"
                >
                  {[
                    { value: "yes", label: "유" },
                    { value: "no", label: "무" },
                    { value: "unknown", label: "미상" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-1">
                      <RadioGroupItem value={option.value} id={`${item.id}-${option.value}`} />
                      <Label htmlFor={`${item.id}-${option.value}`} className="font-normal text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Required Consents */}
      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            최종 동의 사항 (필수)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "explained", label: "위 수술에 대한 설명을 들었음을 확인합니다." },
            { id: "understood", label: "수술의 목적, 효과, 과정을 이해했습니다." },
            { id: "complications", label: "수술 시 발생할 수 있는 합병증에 대해 이해했습니다." },
            { id: "cooperation", label: "수술 전후 의료진의 지시에 협력할 것을 서약합니다." },
          ].map((consent) => (
            <div key={consent.id} className="flex items-start space-x-3">
              <Checkbox
                id={consent.id}
                checked={requiredConsents[consent.id as keyof typeof requiredConsents]}
                onCheckedChange={(checked) =>
                  setRequiredConsents((prev) => ({ ...prev, [consent.id]: !!checked }))
                }
                className="mt-0.5"
              />
              <Label htmlFor={consent.id} className="font-normal cursor-pointer leading-relaxed">
                {consent.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optional Consents */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            기타 동의 사항 (선택)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "methodChange", label: "수술 방법 변경 가능성에 대해 이해합니다." },
            { id: "doctorChange", label: "주치의 변경 가능성에 대해 이해합니다." },
            { id: "guardianCooperation", label: "보호자도 의료진의 지시에 협력할 것을 서약합니다." },
            { id: "studentObservation", label: "학생의사 수술참관에 동의합니다." },
          ].map((consent) => (
            <div key={consent.id} className="flex items-start space-x-3">
              <Checkbox
                id={consent.id}
                checked={optionalConsents[consent.id as keyof typeof optionalConsents]}
                onCheckedChange={(checked) =>
                  setOptionalConsents((prev) => ({ ...prev, [consent.id]: !!checked }))
                }
                className="mt-0.5"
              />
              <Label htmlFor={consent.id} className="font-normal cursor-pointer leading-relaxed">
                {consent.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Consents */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenLine className="w-5 h-5 text-primary" />
            추가 동의 사항
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "anesthesia", label: "마취 동의" },
            { id: "transfusion", label: "수혈 동의" },
            { id: "surgeryMark", label: "수술부위 표식 동의" },
            { id: "frozenSection", label: "동결절편검사 및 병리조직검사 시행 동의" },
            { id: "specialTest", label: "특수검사 시행 가능성 동의" },
          ].map((consent) => (
            <div key={consent.id} className="flex items-start space-x-3">
              <Checkbox
                id={consent.id}
                checked={additionalConsents[consent.id as keyof typeof additionalConsents]}
                onCheckedChange={(checked) =>
                  setAdditionalConsents((prev) => ({ ...prev, [consent.id]: !!checked }))
                }
                className="mt-0.5"
              />
              <Label htmlFor={consent.id} className="font-normal cursor-pointer leading-relaxed">
                {consent.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button variant="hero" size="xl" className="w-full" onClick={handleSubmit}>
        <PenLine className="w-5 h-5 mr-2" />
        전자서명으로 동의하기
      </Button>

      {/* Signature Dialog */}
      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        patientInfo={patientInfo}
        onComplete={handleSignatureComplete}
      />
    </div>
  );
};

export default ConsentForm;
