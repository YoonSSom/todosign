import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { 
  CheckCircle2, 
  User, 
  Users, 
  MapPin, 
  Navigation, 
  Printer, 
  Home,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import type { PatientInfo } from "@/pages/SurgeryConsent";
import PrintableConsent from "./PrintableConsent";

interface CompletePageProps {
  patientInfo: PatientInfo;
  patientSignature?: string;
  guardianSignature?: string;
}

const CompletePage = ({ patientInfo, patientSignature, guardianSignature }: CompletePageProps) => {
  const navigate = useNavigate();
  const [locationGranted, setLocationGranted] = useState(false);

  const asanHospital = {
    name: "아산병원",
    address: "서울특별시 송파구 올림픽로43길 88",
    lat: 37.5269,
    lng: 127.1106,
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
          toast.success("위치 정보 사용이 허용되었습니다.");
        },
        () => {
          toast.error("위치 정보 사용이 거부되었습니다.");
        }
      );
    } else {
      toast.error("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
    }
  };

  const handlePrint = () => {
    toast.success("동의서 출력을 준비합니다.");
    window.print();
  };

  const openNaverMap = () => {
    window.open(
      `https://map.naver.com/v5/search/${encodeURIComponent(asanHospital.address)}`,
      "_blank"
    );
  };

  const openKakaoMap = () => {
    window.open(
      `https://map.kakao.com/link/search/${encodeURIComponent(asanHospital.address)}`,
      "_blank"
    );
  };

  return (
    <>
      {/* Print-only content */}
      <div className="hidden print:block">
        <PrintableConsent 
          patientInfo={patientInfo}
          patientSignature={patientSignature}
          guardianSignature={guardianSignature}
        />
      </div>

      {/* Screen-only content */}
      <div className="print:hidden max-w-2xl mx-auto space-y-6 animate-fade-up">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="mx-auto w-20 h-20 rounded-full bg-medical-success/10 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-medical-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          수술 동의서 작성 완료
        </h1>
        <p className="text-muted-foreground">
          동의서가 성공적으로 제출되었습니다
        </p>
      </div>

      {/* Patient Info Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            환자 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">이름</span>
              <p className="font-medium">{patientInfo.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">생년월일</span>
              <p className="font-medium">
                {patientInfo.birthDate
                  ? format(patientInfo.birthDate, "yyyy년 MM월 dd일", { locale: ko })
                  : "-"}
              </p>
            </div>
          </div>
          {patientInfo.isMinor && patientInfo.guardianName && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">보호자:</span>
                <span className="font-medium">{patientInfo.guardianName}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Navigation */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            아산병원 길 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="font-medium">{asanHospital.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{asanHospital.address}</p>
          </div>

          {!locationGranted && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLocationPermission}
            >
              <Navigation className="w-4 h-4 mr-2" />
              위치 정보 사용 권한 승인
            </Button>
          )}

          {/* Google Maps Embed */}
          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              title="Asan Medical Center Location"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(asanHospital.address)}&zoom=15`}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Map Links */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={openNaverMap}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              네이버 지도
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={openKakaoMap}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              카카오맵
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={handlePrint}
        >
          <Printer className="w-5 h-5 mr-2" />
          동의서 출력
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-1"
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5 mr-2" />
          홈으로 돌아가기
        </Button>
      </div>
      </div>
    </>
  );
};

export default CompletePage;
