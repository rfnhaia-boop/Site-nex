// APIs globais injetadas pelos scripts compartilhados em /nex-shared (rastreio, leads, config).
interface NexTrackingApi {
  track: (name: string, props?: Record<string, unknown>) => unknown;
  funnelStep: (name: string, step: string, n: number, total: number) => void;
  funnelDone: () => void;
  attribution: () => unknown;
  sessionId: string;
}
interface Window {
  NEX_WHATSAPP_NUMBER?: string;
  NEXTracking?: NexTrackingApi;
  NEX_TRACK?: { visitor: string; session: string; product: string; send: (kind: string, target?: string) => Promise<unknown> };
}
