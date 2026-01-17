export interface JoinMessage {
  type: "JOIN_CALL";
  token: string;
}

export interface SignalMessage {
  type: "SIGNAL";
  payload: {
    to: string;
    data: any;
  };
}
