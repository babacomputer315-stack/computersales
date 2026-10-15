import { GetServerSidePropsContext } from "next";

export function detectDevice(context: GetServerSidePropsContext): {
  isMobileSSR: boolean;
} {
  const userAgent = context.req.headers["user-agent"] || "";
  const isMobileSSR =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  return { isMobileSSR };
}
