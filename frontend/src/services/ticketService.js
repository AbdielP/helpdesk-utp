import userApiClient from "./userApiClient";

export const createTicket = async (ticketData) => {
  const { data } = await userApiClient.post("/ticket/new", ticketData);
  return data;
};
