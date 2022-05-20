/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Challenge } from "../types/challenge"
import { ChallengeState, State } from "../types/state"

const initialState: ChallengeState = { value: {} }

export const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {
    setChallenge: (state: ChallengeState, action: PayloadAction<Challenge>) => {
      state.value = action.payload
    },
  },
})
export const challengeSelector = (state: State) => state.challenge?.value

// Action creators are generated for each case reducer function
export const { setChallenge } = challengeSlice.actions

export default challengeSlice.reducer
