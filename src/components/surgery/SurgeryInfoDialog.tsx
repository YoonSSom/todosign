import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { User, Calendar, Users, Stethoscope, Info, Hash } from "lucide-react";
import type { PatientInfo } from "@/pages/SurgeryConsent";

interface SurgeryInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientInfo: PatientInfo;
  onConfirm: () => void;
}

const SurgeryInfoDialog = ({
  open,
  onOpenChange,
  patientInfo,
  onConfirm,
}: SurgeryInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">수술 정보 안내</DialogTitle>
          <DialogDescription>
            환자 정보와 예정 수술 정보를 확인해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Patient Info Display */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/50">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              환자 정보
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">이름</span>
                <span className="font-medium">{patientInfo.name}</span>
              </div>
              {patientInfo.receptionNumber ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    접수번호
                  </span>
                  <span className="font-medium font-mono">{patientInfo.receptionNumber}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    생년월일
                  </span>
                  <span className="font-medium">
                    {patientInfo.birthDate
                      ? format(patientInfo.birthDate, "yyyy년 MM월 dd일", { locale: ko })
                      : "-"}
                  </span>
                </div>
              )}
              {patientInfo.isMinor && patientInfo.guardianName && (
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    보호자
                  </span>
                  <span className="font-medium">{patientInfo.guardianName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Surgery Info Display */}
          <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              예정 수술 정보
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">진단명</span>
                <span className="font-medium">자궁내막암</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">수술명</span>
                <span className="font-medium">복강경하 전자궁절제술</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">담당의</span>
                <span className="font-medium">김OO 교수</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="hero" className="w-full" onClick={onConfirm}>
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SurgeryInfoDialog;
