import type { Metadata } from 'next';
import Studio from '@/studio/components/studio';
export const metadata: Metadata = { title: { absolute: 'Briefing do seu site | NEX Site Studio' }, alternates: { canonical: '/studio/briefing' }, robots: { index: true, follow: true } };
export default function Page(){return <Studio/>}
