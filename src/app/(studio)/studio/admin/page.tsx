import type { Metadata } from 'next';
import Admin from '@/studio/components/admin/workspace';
export const metadata: Metadata = { title: { absolute: 'Administração | NEX Site Studio' }, robots: { index: false, follow: false } };
export default function Page(){return <Admin/>}
