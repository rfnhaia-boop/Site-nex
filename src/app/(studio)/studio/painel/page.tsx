import type { Metadata } from 'next';
import Studio from '@/studio/components/studio';
export const metadata: Metadata = { title: { absolute: 'Meu projeto | NEX Site Studio' }, robots: { index: false, follow: false } };
export default function Page(){return <Studio/>}
