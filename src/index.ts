import {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from "@metamask/snaps-types";
import { heading, panel, text } from "@metamask/snaps-ui";
import {
  assertIsMakeNotificationParams,
  makeNotification,
} from "./notification";

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ request }) => {
  switch (request.method) {
    case "notification":
      assertIsMakeNotificationParams(request.params);
      return makeNotification(request.params);
    default:
      throw new Error("Method not found.");
  }
};

// Handle outgoing transactions
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const currentGasPrice = await ethereum.request<string>({
    method: "eth_gasPrice",
  });

  const transactionGas = parseInt(transaction.gas as string, 16);
  const currentGasPriceInWei = parseInt(currentGasPrice ?? "", 16);
  const maxFeePerGasInWei = parseInt(transaction.maxFeePerGas as string, 16);
  const maxPriorityFeePerGasInWei = parseInt(
    transaction.maxPriorityFeePerGas as string,
    16
  );

  const gasFees = Math.min(
    maxFeePerGasInWei * transactionGas,
    (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas
  );

  return {
    content: panel([
      heading("Fundme Snap"),
      text(`The current gas fees for this transaction is **${gasFees}%**`),
    ]),
  };
};
