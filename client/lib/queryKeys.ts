export const pdfKeys = {
  all: ["pdfs"] as const,
  lists: () => [...pdfKeys.all, "list"] as const,
  detail: (id: string) => [...pdfKeys.all, "detail", id] as const,
};

export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  credits: () => [...userKeys.all, "credits"] as const,
};
