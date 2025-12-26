/**
 * 진행 상태 저장/복원 관리
 * - localStorage에 진행 상태 저장 (백엔드 연동 전 임시 저장소)
 * - 백엔드 연동 시 서버와 동기화
 */

const PROGRESS_KEY = 'surgery_consent_progress';

export type ConsentStep = 
  | 'identity' 
  | 'surgery-info' 
  | 'face-recognition' 
  | 'avatar-explanation' 
  | 'game' 
  | 'consent-form' 
  | 'complete';

export interface ProgressData {
  patientId: string;
  currentStep: ConsentStep;
  progressPercentage: number;
  surgeryInfo?: {
    surgeryName?: string;
    surgeryDate?: string;
    surgeryMethod?: string;
  };
  timestamp: number;
  lastUpdated: number;
}

/**
 * 단계별 진행률 매핑
 */
const STEP_PROGRESS: Record<ConsentStep, number> = {
  'identity': 0,
  'surgery-info': 15,
  'face-recognition': 30,
  'avatar-explanation': 45,
  'game': 60,
  'consent-form': 80,
  'complete': 100,
};

/**
 * 진행 상태 저장
 */
export function saveProgress(data: Omit<ProgressData, 'lastUpdated' | 'progressPercentage'>): void {
  const progressData: ProgressData = {
    ...data,
    progressPercentage: STEP_PROGRESS[data.currentStep],
    lastUpdated: Date.now(),
  };
  
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * 진행 상태 조회
 */
export function getProgress(patientId: string): ProgressData | null {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return null;
    
    const data: ProgressData = JSON.parse(stored);
    
    // patientId가 일치하는지 확인
    if (data.patientId !== patientId) {
      return null;
    }
    
    // 완료된 상태는 복원하지 않음
    if (data.currentStep === 'complete') {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * 진행 상태 초기화
 */
export function clearProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
}

/**
 * 현재 단계 업데이트
 */
export function updateProgressStep(patientId: string, step: ConsentStep, surgeryInfo?: ProgressData['surgeryInfo']): void {
  const existing = getProgress(patientId);
  
  saveProgress({
    patientId,
    currentStep: step,
    timestamp: existing?.timestamp || Date.now(),
    surgeryInfo: surgeryInfo || existing?.surgeryInfo,
  });
}

/**
 * 단계 이름을 한글로 변환
 */
export function getStepDisplayName(step: ConsentStep): string {
  const names: Record<ConsentStep, string> = {
    'identity': '본인확인',
    'surgery-info': '수술 정보 확인',
    'face-recognition': '얼굴 인식',
    'avatar-explanation': '수술 설명',
    'game': '이해도 확인',
    'consent-form': '동의서 작성',
    'complete': '완료',
  };
  return names[step];
}

/**
 * Step을 SurgeryConsent의 Step 타입으로 변환
 */
export function convertToPageStep(step: ConsentStep): 'identity' | 'explanation' | 'consent-form' | 'complete' {
  switch (step) {
    case 'identity':
      return 'identity';
    case 'surgery-info':
    case 'face-recognition':
    case 'avatar-explanation':
    case 'game':
      return 'explanation';
    case 'consent-form':
      return 'consent-form';
    case 'complete':
      return 'complete';
    default:
      return 'identity';
  }
}
