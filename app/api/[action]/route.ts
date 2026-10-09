import { handleGet, handlePost } from '../../server';
export const dynamic = 'force-dynamic';
export async function GET(request:Request,context:{params:Promise<{action:string}>}){return handleGet(request,(await context.params).action);}
export async function POST(request:Request,context:{params:Promise<{action:string}>}){return handlePost(request,(await context.params).action);}
