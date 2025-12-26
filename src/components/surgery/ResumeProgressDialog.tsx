import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { History, RotateCcw, ArrowRight } from "lucide-react";
import { ProgressData, getStepDisplayName } from "@/lib/progressStorage";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ResumeProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progressData: ProgressData | null;
  onResume: () => void;
  onStartFresh: () => void;
}

const ResumeProgressDialog = ({
  open,
  onOpenChange,
  progressData,
  onResume,
  onStartFresh,
}: ResumeProgressDialogProps) => {
  if (!progressData) return null;

  const lastUpdatedDate = new Date(progressData.lastUpdated);
  const formattedDate = format(lastUpdatedDate, "yyyy년 M월 d일 a h시 m분", { locale: ko });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <History className="w-7 h-7 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            이전에 진행하시던 내역이 있습니다
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p>
              마지막으로 저장된 단계에서 이어서 진행하시겠습니까?
            </p>
            
            <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">진행 단계</span>
                <span className="font-medium text-foreground">
                  {getStepDisplayName(progressData.currentStep)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">진행률</span>
                <span className="font-medium text-foreground">
                  {progressData.progressPercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">마지막 저장</span>
                <span className="font-medium text-foreground text-xs">
                  {formattedDate}
                </span>
              </div>
              {progressData.surgeryInfo?.surgeryName && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">수술명</span>
                  <span className="font-medium text-foreground">
                    {progressData.surgeryInfo.surgeryName}
                  </span>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onStartFresh}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            처음부터 시작
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onResume}
            className="gradient-button text-primary-foreground flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            이어서 진행
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResumeProgressDialog;
