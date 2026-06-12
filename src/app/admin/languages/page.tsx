import { redirect } from 'next/navigation';

export default function AdminLanguagesRedirectPage() {
  redirect('/admin/dashboard?tab=languages');
}
