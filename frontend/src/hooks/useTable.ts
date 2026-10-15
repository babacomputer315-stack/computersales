import { useRouter } from "next/router";
import { useMemo } from "react";

export const useTable = (): string => {
  const router = useRouter();

  const table = useMemo(() => {
    return router?.query?.table?.toString() || "";
  }, [router?.query?.table]);

  return table;
};
