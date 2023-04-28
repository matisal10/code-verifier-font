export type Kata = {
    _id?: string
    creator: string
    description: string
    intents: number
    level: string
    name: string
    participants: []
    solution: string
    valoration: number,
    date: Date,
    num_valorations: number,
    files: []
}

export type Dato = {
    img:object
    pdf:object
}