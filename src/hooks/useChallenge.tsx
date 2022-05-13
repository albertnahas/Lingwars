import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../config";
import { challengeSelector } from "../store/challengeSlice";
import { removeUser, setUser, setServerUser } from "../store/userSlice";
import { State } from "../types/state";
import { User } from "../types/user";
import { defaultUserSettings } from "../utils/constants";

export const useChallenge = () => {
  const dispatch = useDispatch();

  const challenge = useSelector(challengeSelector);


  return {  };
};
