const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const convertToJalali = (dateString: string) => {
  if (!dateString || typeof dateString !== "string") return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", options).format(date);
};
