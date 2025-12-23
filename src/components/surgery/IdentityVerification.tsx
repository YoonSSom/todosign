import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInYears } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Shield, User, Phone, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PatientInfo } from "@/pages/SurgeryConsent";

interface IdentityVerificationProps {
  onVerified: (info: PatientInfo) => void;
}

const IdentityVerification = ({ onVerified }: IdentityVerificationProps) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [phone, setPhone] = useState("");
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Check if minor when birth date changes
  useEffect(() => {
    if (birthDate) {
      const age = differenceInYears(new Date(), birthDate);
      setIsMinor(age < 19);
    }
  }, [birthDate]);

  // Validate name (Korean or English only, no single consonants/vowels)
  const validateName = (value: string): boolean => {
    // Allow Korean (complete syllables), English, and spaces
    const validPattern = /^[가-힣a-zA-Z\s]+$/;
    // Check for single consonants/vowels (ㄱ-ㅎ, ㅏ-ㅣ)
    const invalidPattern = /[ㄱ-ㅎㅏ-ㅣ]/;
    return validPattern.test(value) && !invalidPattern.test(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers, max 11 digits
    const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
    setPhone(numbersOnly);
  };

  const handleGuardianPhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
    setGuardianPhone(numbersOnly);
  };

  const formatPhoneDisplay = (value: string) => {
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!validateName(name)) {
      toast.error("이름은 한글 또는 영문만 입력 가능합니다.");
      return;
    }
    if (!birthDate) {
      toast.error("생년월일을 선택해주세요.");
      return;
    }
    if (phone.length < 10) {
      toast.error("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }
    if (isMinor) {
      if (!guardianName.trim()) {
        toast.error("보호자 이름을 입력해주세요.");
        return;
      }
      if (!validateName(guardianName)) {
        toast.error("보호자 이름은 한글 또는 영문만 입력 가능합니다.");
        return;
      }
      if (guardianPhone.length < 10) {
        toast.error("올바른 보호자 휴대폰 번호를 입력해주세요.");
        return;
      }
    }

    toast.success("본인확인이 완료되었습니다.");
    
    onVerified({
      name,
      birthDate,
      phone,
      isMinor,
      guardianName: isMinor ? guardianName : undefined,
      guardianPhone: isMinor ? guardianPhone : undefined,
    });
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-up">
      <Card className="shadow-card">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-button flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">본인확인</CardTitle>
          <CardDescription>
            수술 동의서 작성을 위해 본인확인이 필요합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              이름
            </Label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              생년월일
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "yyyy년 MM월 dd일", { locale: ko }) : "생년월일 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1920}
                  toYear={new Date().getFullYear()}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              휴대폰 번호
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="휴대폰 번호를 입력하세요"
              value={formatPhoneDisplay(phone)}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Minor notification */}
          {isMinor && (
            <div className="animate-scale-in p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">미성년자 확인</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    만 19세 미만은 보호자 정보가 필요합니다
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">보호자 이름</Label>
                  <Input
                    id="guardianName"
                    placeholder="보호자 이름을 입력하세요"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">보호자 휴대폰 번호</Label>
                  <Input
                    id="guardianPhone"
                    type="tel"
                    placeholder="보호자 휴대폰 번호를 입력하세요"
                    value={formatPhoneDisplay(guardianPhone)}
                    onChange={(e) => handleGuardianPhoneChange(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
          >
            본인확인 진행
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentityVerification;
