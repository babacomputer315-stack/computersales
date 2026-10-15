import type { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk.toString();
    });

    req.on("end", () => {
      const data = querystring.parse(rawBody);
      const callbackData = {
        Token: data.Token || data.Token,
        status: data.status || data.status,
        OrderId: data.OrderId || data.OrderId,
        TerminalNo: data.TerminalNo || data.TerminalNo,
        RRN: data.RRN || data.RRN,
        HashCardNumber: data.HashCardNumber || data.HashCardNumber,
        Amount: data.Amount || data.Amount,
      };

      res.redirect(
        303,
        `/cart/checkout?token=${callbackData.Token}&status=${callbackData.status}&provider=pec`
      );
    });
  } else {
    const success = req.query.success;
    const orderId = req.query.orderId;
    const trackId = req.query.trackId;
    const status = req.query.status;
    res.redirect(
      303,
      `/cart/checkout?success=${success}&orderId=${orderId}&trackId=${trackId}&status=${status}&provider=zibal`
    );
  }
}
