import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "de-DE";

  return {
    locale,
  };
});
