/* What worker/brief.js offers, for the TypeScript parts of the project that call it (the local site and the checks). */

export type BriefEnv = {
  EMAIL?: { send: (message: { to: string; subject: string; text: string }) => Promise<unknown> }
  BRIEF_TO?: string
  BRIEF_FROM?: string
}

export function handleBrief(request: Request, env: BriefEnv): Promise<Response>
