import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QuickReplyProps } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSuggestionsProps(content: string | QuickReplyProps): content is QuickReplyProps {
  return (content as QuickReplyProps) !== undefined;
}

export function isString(content: string | QuickReplyProps): content is string {
  return (content as string) !== undefined;
}