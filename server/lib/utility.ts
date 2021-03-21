export function replacer(key:any,value:any)
{
  if (key=="hiddenCard") return undefined;
  else if (key=="ws") return undefined;
  else return value;
}

export function replaceWs(key:any,value:any)
{
  if (key=="ws") return undefined;
  else return value;
}