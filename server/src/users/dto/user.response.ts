export class UserResponse {
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobileNumber: string | null;
  avatarUrl: string | null;
  role: string | null;
  businessName: string | null;
  businessType: string | null;
  businessAddress: string | null;
  businessRegistrationNumber: string | null;
  taxIdentificationNumber: string | null;
  valueAddedTaxNumber: string | null;
  businessLogoUrl: string | null;
  govermentPhotoIdUrls: string[] | null;
  accountStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
}
