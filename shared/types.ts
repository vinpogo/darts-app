export type Miss = ''
export type Field =
  | '1'
  | 'D1'
  | 'T1'
  | '2'
  | 'D2'
  | 'T2'
  | '3'
  | 'D3'
  | 'T3'
  | '4'
  | 'D4'
  | 'T4'
  | '5'
  | 'D5'
  | 'T5'
  | '6'
  | 'D6'
  | 'T6'
  | '7'
  | 'D7'
  | 'T7'
  | '8'
  | 'D8'
  | 'T8'
  | '9'
  | 'D9'
  | 'T9'
  | '10'
  | 'D10'
  | 'T10'
  | '11'
  | 'D11'
  | 'T11'
  | '12'
  | 'D12'
  | 'T12'
  | '13'
  | 'D13'
  | 'T13'
  | '14'
  | 'D14'
  | 'T14'
  | '15'
  | 'D15'
  | 'T15'
  | '16'
  | 'D16'
  | 'T16'
  | '17'
  | 'D17'
  | 'T17'
  | '18'
  | 'D18'
  | 'T18'
  | '19'
  | 'D19'
  | 'T19'
  | '20'
  | 'D20'
  | 'T20'
  | 'Bull'
  | 'DBull'

export type FieldEntry = Partial<Record<Field, number>>
export type ScoringAverage = Partial<
  Record<
    Exclude<Field, '0'>,
    FieldEntry & {
      shots: number
    }
  >
>

export type PlayerProfile = Record<
  Field,
  { stats: Record<Field, number>; shots: number }
>

export type PossibleCheckouts = Field[][]

export type Suggestion = {
  score: Field[]
  explanation: string
}
