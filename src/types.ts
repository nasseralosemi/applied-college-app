export type RequestStatus =
  | 'pending_manager'
  | 'returned_emp'
  | 'pending_auditor'
  | 'returned_manager'
  | 'approved_final'
  | 'uploaded_irtqaa'
  | 'rejected';

export type UserRole = 'login' | 'emp' | 'manager' | 'auditor' | 'uploader';

export interface ActivityRequest {
  id: number;
  name: string;
  type: string;
  presenter: string;
  date: string;
  hours: string | number;
  location: string;
  summary: string;
  status: RequestStatus;
  note: string;
  submittedAt?: string;
}

export interface UserProfile {
  name: string;
  roleTitle: string;
  roleBadge: string;
  avatarText: string;
}
