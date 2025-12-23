import { useState } from "react";
import { Helmet } from "react-helmet-async";
import IdentityVerification from "@/components/surgery/IdentityVerification";
import SurgeryInfoDialog from "@/components/surgery/SurgeryInfoDialog";
import FaceRecognitionDialog from "@/components/surgery/FaceRecognitionDialog";
import AvatarVoiceChatDialog from "@/components/surgery/AvatarVoiceChatDialog";
import SurgeryOrderGame from "@/components/surgery/SurgeryOrderGame";
import ConsentForm from "@/components/surgery/ConsentForm";
import CompletePage from "@/components/surgery/CompletePage";
import ProgressIndicator from "@/components/surgery/ProgressIndicator";

export interface PatientInfo {
  name: string;
  birthDate: Date | null;
  phone: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
}

export interface SurgeryInfo {
  diagnosis: string;
}

type Step = "identity" | "consent-form" | "complete";

const SurgeryConsent = () => {
  const [currentStep, setCurrentStep] = useState<Step>("identity");
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [surgeryInfo, setSurgeryInfo] = useState<SurgeryInfo | null>(null);

  // Dialog states
  const [showSurgeryInfoDialog, setShowSurgeryInfoDialog] = useState(false);
  const [showFaceRecognitionDialog, setShowFaceRecognitionDialog] = useState(false);
  const [showAvatarVoiceChatDialog, setShowAvatarVoiceChatDialog] = useState(false);
  const [showGameDialog, setShowGameDialog] = useState(false);

  const handleIdentityVerified = (info: PatientInfo) => {
    setPatientInfo(info);
    setShowSurgeryInfoDialog(true);
  };

  const handleSurgeryInfoConfirmed = (info: SurgeryInfo) => {
    setSurgeryInfo(info);
    setShowSurgeryInfoDialog(false);
    setShowFaceRecognitionDialog(true);
  };

  const handleFaceRecognitionComplete = () => {
    setShowFaceRecognitionDialog(false);
    setShowAvatarVoiceChatDialog(true);
  };

  const handleAvatarVideoComplete = () => {
    setShowAvatarVoiceChatDialog(false);
    setShowGameDialog(true);
  };

  const handleGameComplete = () => {
    setShowGameDialog(false);
    setCurrentStep("consent-form");
  };

  const handleConsentComplete = () => {
    setCurrentStep("complete");
  };

  return (
    <>
      <Helmet>
        <title>수술 동의서 작성 | 아산병원</title>
        <meta name="description" content="아산병원 비대면 수술 동의서 작성 페이지입니다." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-foreground">아산병원</span>
            </div>
          </div>
        </header>

        <main className="container py-8">
          {currentStep !== "complete" && (
            <ProgressIndicator currentStep={currentStep} />
          )}

          {currentStep === "identity" && (
            <IdentityVerification onVerified={handleIdentityVerified} />
          )}

          {currentStep === "consent-form" && patientInfo && surgeryInfo && (
            <ConsentForm 
              patientInfo={patientInfo} 
              surgeryInfo={surgeryInfo}
              onComplete={handleConsentComplete} 
            />
          )}

          {currentStep === "complete" && patientInfo && (
            <CompletePage patientInfo={patientInfo} />
          )}
        </main>

        {/* Dialogs */}
        {patientInfo && (
          <>
            <SurgeryInfoDialog
              open={showSurgeryInfoDialog}
              onOpenChange={setShowSurgeryInfoDialog}
              patientInfo={patientInfo}
              onConfirm={handleSurgeryInfoConfirmed}
            />

            <FaceRecognitionDialog
              open={showFaceRecognitionDialog}
              onOpenChange={setShowFaceRecognitionDialog}
              onComplete={handleFaceRecognitionComplete}
            />

            <AvatarVoiceChatDialog
              open={showAvatarVoiceChatDialog}
              onOpenChange={setShowAvatarVoiceChatDialog}
              patientName={patientInfo.name}
              onComplete={handleAvatarVideoComplete}
            />

            <SurgeryOrderGame
              open={showGameDialog}
              onOpenChange={setShowGameDialog}
              onComplete={handleGameComplete}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SurgeryConsent;
