import { createBody, createHead, generatedProjectsIds } from "../../../../atoms";
import { EventSourcePolyfill } from "event-source-polyfill";
import type { StatusCallback } from "./types";
import { formatters, parsers } from "./utils";
import { BASE_URL } from "../../constants";
import type { VM } from "@stackblitz/sdk";
import { axiosFile, apiFile, tableFile, envFile } from "./utils";


export type StreamType = string | "error" | "info" | "id" | "api";
/** Receives a callback to execute on stream ending. Return true if all ok. */
export const executeBuild = async (
  vm: VM,
  signal: AbortSignal,
  query: string,
  token: string,
  callback: StatusCallback
) => {
  const eventStream = new EventSourcePolyfill(`${BASE_URL}/stream/build${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  //this will get this data from backend
  const mockApiData: string = `{
    "api_name": "Stripe",
    "url":"/v1/balance_transactions",
    "base_url":"https://api.stripe.com/",
    "params":[],
    "UIType":"Table",
    "responseDataType":"..."
}`;
  const mockData = JSON.parse(mockApiData);

  eventStream.addEventListener("message", async e => {
    if (signal.aborted) {
      console.log("ABORTED_STREAM");
      eventStream.close();
      return callback(false);
    }
    const { type, data }: { type: StreamType; data: string } = JSON.parse(e.data);
    switch (type) {
      case "error":
        console.log("ERROR_STREAM", data);
        return callback(false, undefined);
      case "info":
        return console.log("INFO_STREAM", data);
      case "api":
        // TODO: Will update here
        return;
      case "id":
        console.log(generatedProjectsIds)
        generatedProjectsIds.set({ ...generatedProjectsIds.get(), Build: data });
        eventStream.close();
        console.log("END_STREAM", data);
        return callback(true);
      default:
        if (data === "[DONE]") return;
        vm.applyFsDiff({ create: { [type]: data }, destroy: [] });
        vm.applyFsDiff({
          create: {
            'api/axios.ts': axiosFile(),
            'api/api.ts': apiFile(mockData.url),
            'a-components/Table.ts': tableFile(),
            '.env': envFile(mockData.base_url)
          }, destroy: [] });
        return;
    }
  });
  eventStream.addEventListener("open", () => {
    console.log("START_STREAM");
  });
  eventStream.addEventListener("error", e => {
    console.log("ERROR_STREAM");
    eventStream.close();
    callback(false, undefined);
  });
};
