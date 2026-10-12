import type {Question,Step} from './curriculum';
export function seeded(seed:number){let s=seed>>>0;return(lo:number,hi:number)=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return lo+Math.floor(s/4294967296*(hi-lo+1));};}
export const fmt=(n:number)=>Number(n.toFixed(6)).toString();
export const step=(title:string,text:string,math:string,ask:string,answer:number):Step=>({title,text,math,ask,answer});
export const question=(prompt:string,answer:number,hint:string,steps:Step[],expression?:string,unit?:string,note?:string):Question=>({prompt,answer,hint,steps,expression,unit,note});
