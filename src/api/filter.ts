export const filter:Filter = {
    genres: [],
    variance: 5, // 0-9
    history: []
}

type Filter = {
    genres: string[],
    variance: number,
    history: BroadcastRefernce[]
}

type BroadcastRefernce = {
    prismicId: string,
    score: number, // 0-4 how likely are you to listen more like this
    title: string,
    host: HostReference,
    alias: string, 
}

type HostReference = {
    prismicId: string,
    name: string,
    alias: string,
}