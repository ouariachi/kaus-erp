export const SMTP_ERROR_MESSAGES = {
  421: {
    message: "The recipient's mail server is temporarily unavailable. Please try again later.",
    httpCode: 503,
  },
  450: {
    message: "The recipient's mailbox is unavailable at the moment.",
    httpCode: 400,
  },
  451: {
    message: "Temporary error on the recipient's mail server.",
    httpCode: 500,
  },
  452: {
    message: "The recipient's mailbox is full.",
    httpCode: 400,
  },
  530: {
    message: "Authentication required. Please check your SMTP credentials.",
    httpCode: 500,
  },
  535: {
    message: "Incorrect SMTP authentication credentials.",
    httpCode: 500,
  },
  550: {
    message: "The email does not exist or was rejected by the server.",
    httpCode: 400,
  },
  551: {
    message: "The recipient's server does not accept emails from this domain.",
    httpCode: 400,
  },
  552: {
    message: "The recipient's mailbox is full.",
    httpCode: 400,
  },
  553: {
    message: "Invalid email address format.",
    httpCode: 400,
  },
  554: {
    message: "The recipient's server blocked the email.",
    httpCode: 400,
  },
};
