import { getEnv } from "./env";

type EmailRecipient = {
  email: string;
  name?: string | null;
};

type EmailMessage = {
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(
  to: EmailRecipient[],
  message: EmailMessage
): Promise<boolean> {
  const env = getEnv();
  if (!env.SEND_EMAIL || !env.EMAIL_FROM) return false;
  await env.SEND_EMAIL.send({
    to: to.map((recipient) => ({
      email: recipient.email,
      name: recipient.name ?? undefined,
    })),
    from: { email: env.EMAIL_FROM, name: "Letters" },
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
  return true;
}
