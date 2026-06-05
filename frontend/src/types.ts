export type ScreenType = 'REGISTRATION' | 'SIGN_IN' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'PROFILE' | 'TRUCK';

export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePicture: string;
  latitude: string;
  longitude: string;
  memberSince: string;
  accountStatus: 'Verified' | 'Pending' | 'Suspended';
  totalPickups: number;
}
