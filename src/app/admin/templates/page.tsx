import { redirect } from 'next/navigation';

export default function AdminTemplatesRedirectPage() {
  redirect('/admin/dashboard?tab=templates');
}
