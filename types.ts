export enum NodeType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export interface FileNode {
  name: string;
  path: string; // e.g. "notes/tech/vue.md"
  type: NodeType;
  children?: FileNode[];
  content?: string;
  lastModified?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}