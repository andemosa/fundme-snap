export type MakeNotificationParams = {
  message: string;
};
/**
 * Throws if the value passed in isn't of type MakeNotificationParams.
 *
 * @param params - The value to be checked.
 */
export function assertIsMakeNotificationParams(
  params: unknown
): asserts params is MakeNotificationParams {
  if (
    !(
      typeof params === "object" &&
      params !== null &&
      "message" in params &&
      typeof params.message === "string"
    )
  ) {
    throw new Error("params must be instance of `MakeNotificationParams`");
  }
}

export const makeNotification = ({ message }: MakeNotificationParams) => {
  return snap.request({
    method: "snap_notify",
    params: {
      type: "native",
      message,
    },
  });
};
