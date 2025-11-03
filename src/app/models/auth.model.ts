export interface GoogleCredential {
  credential: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  email: string;
  name: string;
  message?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  picture?: string;
}


