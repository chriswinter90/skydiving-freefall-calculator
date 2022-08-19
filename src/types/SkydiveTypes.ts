export interface Skydive {
  jumpNumber: number
  exitAltitude: number
  openingAltitude: number
}

export interface SkydiveComplete extends Skydive {
  freefallDelay: number // freefall delay in seconds for this jump
  totalTime: number // total time in seconds
}
