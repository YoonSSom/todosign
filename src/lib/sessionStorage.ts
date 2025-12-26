/**
 * 세션 토큰 암호화 및 localStorage 관리 유틸리티
 * - 세션 토큰만 암호화하여 저장
 * - 개인정보는 저장하지 않음
 * - 24시간 만료 시간 설정
 */

const SESSION_KEY = 'surgery_consent_session';
const SESSION_EXPIRY_HOURS = 24;

interface SessionData {
  patientId: string;
  token: string;
  expiresAt: number;
}

// 간단한 Base64 인코딩/디코딩 (실제 프로덕션에서는 더 강력한 암호화 필요)
function encodeToken(data: SessionData): string {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonString));
  } catch {
    return '';
  }
}

function decodeToken(encoded: string): SessionData | null {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * 세션 토큰 저장
 */
export function saveSessionToken(patientId: string): string {
  const token = generateToken();
  const expiresAt = Date.now() + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000);
  
  const sessionData: SessionData = {
    patientId,
    token,
    expiresAt,
  };
  
  const encoded = encodeToken(sessionData);
  localStorage.setItem(SESSION_KEY, encoded);
  
  return token;
}

/**
 * 세션 토큰 조회 및 검증
 */
export function getSessionToken(): SessionData | null {
  const encoded = localStorage.getItem(SESSION_KEY);
  if (!encoded) return null;
  
  const sessionData = decodeToken(encoded);
  if (!sessionData) {
    clearSessionToken();
    return null;
  }
  
  // 만료 확인
  if (Date.now() > sessionData.expiresAt) {
    clearSessionToken();
    return null;
  }
  
  return sessionData;
}

/**
 * 세션 토큰 삭제
 */
export function clearSessionToken(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * 세션 갱신 (만료 시간 연장)
 */
export function refreshSessionToken(): void {
  const session = getSessionToken();
  if (session) {
    saveSessionToken(session.patientId);
  }
}

/**
 * 세션 유효성 확인
 */
export function isSessionValid(): boolean {
  const session = getSessionToken();
  return session !== null;
}

/**
 * 간단한 토큰 생성기
 */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
