import {createContext, useContext} from "react";
import * as signalR from "@microsoft/signalr";

export interface SignalRContextValue {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  connectionError: string | null;
}

export const SignalRContext = createContext<SignalRContextValue | undefined>(undefined);

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};
