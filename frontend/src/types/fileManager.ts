export interface FileItem {
  id: number;
  createdAt: string;
  name: string;
  size: number;
  type: string;
  alt?: string;
  order?: number;
}

export type FileManagerContextType = {
  isOpen: boolean;
  selectedFiles: FileItem[];
  currentField: string | null;
  multiple: boolean;
  openFileManager: (
    fieldName: string,
    isMultiple?: boolean,
    maxFileNum?: number | null | undefined
  ) => void;
  closeFileManager: () => void;
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  files: FileItem[];
  isLoading: boolean;
  uploadFile: (file: File | Blob) => Promise<void>;
  handleDeleteFile: () => void;
  maxFile: number | null | undefined;
};
