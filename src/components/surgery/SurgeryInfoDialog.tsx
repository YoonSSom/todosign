import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { User, Calendar, Users, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import type { PatientInfo, SurgeryInfo } from "@/pages/SurgeryConsent";

interface SurgeryInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientInfo: PatientInfo;
  onConfirm: (info: SurgeryInfo) => void;
}

const SurgeryInfoDialog = ({
  open,
  onOpenChange,
  patientInfo,
  onConfirm,
}: SurgeryInfoDialogProps) => {
  const [diagnosis, setDiagnosis] = useState("");

  const handleConfirm = () => {
    if (!diagnosis.trim()) {
      toast.error("진단명을 입력해주세요.");
      return;
    }
    onConfirm({ diagnosis });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">수술 정보 확인</DialogTitle>
          <DialogDescription>
            환자 정보와 예정 수술 정보를 확인해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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

          {/* Diagnosis Input */}
          <div className="space-y-3">
            <Label htmlFor="diagnosis" className="flex items-center gap-2 text-base font-semibold">
              <Stethoscope className="w-4 h-4 text-primary" />
              예정 수술 정보
            </Label>
            <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
              <Label htmlFor="diagnosis" className="text-sm text-muted-foreground">
                진단명
              </Label>
              <Input
                id="diagnosis"
                placeholder="예: 자궁내막암"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="mt-2 h-12 text-lg font-medium border-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="hero" onClick={handleConfirm}>
            확인 및 다음 단계
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurgeryInfoDialog;
