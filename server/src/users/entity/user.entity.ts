export class User {
  id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  mobile_number: string | null;
  avatar_url: string | null;
  role: string | null;
  business_name: string | null;
  business_type: string | null;
  business_address: string | null;
  business_registration_number: string | null;
  tax_identification_number: string | null;
  value_added_tax_number: string | null;
  business_logo_url: string | null;
  goverment_photo_id_urls: string[] | null;
  account_status: string | null;
  created_at: Date;
  updated_at: Date;
}
