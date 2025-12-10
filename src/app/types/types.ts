export type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
export type DocumentRow = {
  id: number;
  fileName: string;
  version: string;
  size: string;
  sizeKb: number;
  uploadedAt: string;
  uploadedAtTs: number;
  original: JsonPlaceholderPost;
};
export type  DocumentDetailsModalProps = {
  open: boolean;
  document: DocumentRow | null;
  analyzing: boolean;
  onClose: () => void;
  onAnalyze: () => Promise<void>;
};
export type ChatMessage = {
  id: number;
  from: 'user' | 'assistant';
  text: string;
};
export type NavItem = {
  label: string;
  href: string;
};