declare module 'enquire-simple' {
  import { PromptOptions } from 'enquirer';

  export function prompt(message: string, initial?: any): Promise<any>;
  export function confirm(message: string, initial?: boolean): Promise<boolean>;
  export function password(message: string, initial?: string): Promise<string>;
}
