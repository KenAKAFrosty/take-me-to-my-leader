export default async function fetcher(arg: any, ...args: any) { 
    const raw = await fetch(arg, ...args);
    const json = await raw.json();
    return json;
}