import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { PatientInfo } from "@/pages/SurgeryConsent";
import asanLogo from "@/assets/asan-logo.png";
interface PrintableConsentProps {
  patientInfo: PatientInfo;
  patientSignature?: string;
  guardianSignature?: string;
}

const PrintableConsent = ({ 
  patientInfo, 
  patientSignature, 
  guardianSignature 
}: PrintableConsentProps) => {
  const today = new Date();

  return (
    <div className="print-consent p-8 bg-white text-black max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <img src={asanLogo} alt="서울아산병원 로고" className="h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">수술 동의서</h1>
      </div>

      {/* Patient Info Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">환자 정보</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex">
            <span className="w-24 font-medium">성명:</span>
            <span>{patientInfo.name}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">생년월일:</span>
            <span>
              {patientInfo.birthDate
                ? format(patientInfo.birthDate, "yyyy년 MM월 dd일", { locale: ko })
                : "-"}
            </span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">연락처:</span>
            <span>{patientInfo.phone || "-"}</span>
          </div>
          {patientInfo.isMinor && patientInfo.guardianName && (
            <div className="flex">
              <span className="w-24 font-medium">보호자:</span>
              <span>{patientInfo.guardianName}</span>
            </div>
          )}
        </div>
      </section>

      {/* Surgery Info Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">수술 정보</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex">
            <span className="w-24 font-medium">진단명:</span>
            <span>자궁내막암</span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">수술명:</span>
            <span>복강경하 전자궁절제술</span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">담당의:</span>
            <span>김OO 교수</span>
          </div>
        </div>
      </section>

      {/* Consent Items Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">동의 내용</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium">☑</span>
            <span>본인은 담당 의사로부터 수술 방법, 목적, 효과 및 합병증에 대해 충분히 설명을 들었습니다.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">☑</span>
            <span>본인은 위 설명을 이해하였습니다.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">☑</span>
            <span>본인은 수술과 관련된 합병증 및 부작용의 가능성을 이해하였습니다.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">☑</span>
            <span>본인은 수술 전후 담당 의료진의 지시에 협조할 것을 동의합니다.</span>
          </div>
        </div>
      </section>

      {/* Signature Section */}
      <section className="mt-10">
        <h2 className="text-lg font-bold border-b border-gray-400 pb-2 mb-6">서명</h2>
        
        <div className="text-center mb-6">
          <p className="text-sm">
            상기 본인은 위의 사항에 대하여 충분한 설명을 듣고 이해하였으며, 
            수술에 동의합니다.
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm font-medium">
            {format(today, "yyyy년 MM월 dd일", { locale: ko })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Patient Signature */}
          <div className="text-center">
            <div className="border-b border-black pb-2 mb-2 min-h-[80px] flex items-end justify-center">
              {patientSignature ? (
                <img 
                  src={patientSignature} 
                  alt="환자 서명" 
                  className="max-h-[70px] object-contain"
                />
              ) : (
                <div className="text-gray-400 text-sm">(서명)</div>
              )}
            </div>
            <p className="text-sm font-medium">환자: {patientInfo.name} (인)</p>
          </div>

          {/* Guardian Signature */}
          {patientInfo.isMinor && (
            <div className="text-center">
              <div className="border-b border-black pb-2 mb-2 min-h-[80px] flex items-end justify-center">
                {guardianSignature ? (
                  <img 
                    src={guardianSignature} 
                    alt="보호자 서명" 
                    className="max-h-[70px] object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">(서명)</div>
                )}
              </div>
              <p className="text-sm font-medium">보호자: {patientInfo.guardianName} (인)</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>서울특별시 송파구 올림픽로43길 88 아산병원</p>
      </div>
    </div>
  );
};

export default PrintableConsent;
