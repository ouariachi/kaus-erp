import dns from "node:dns";

/**
 * Verifies the domain of an email address by checking for MX records
 *
 * @param {string} domain
 * @returns {Promise<boolean>}
 */
export async function verifyDomain(domain) {
  if (domain.includes("@")) {
    if (domain.startsWith("@")) {
      domain = domain.slice(1);
    } else {
      domain = domain.split("@")[1];
    }
  }

  return new Promise((resolve) => {
    // Local domains are always valid
    if (domain.includes(".local")) {
      return resolve(true);
    }

    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        return resolve(false);
      } else if (addresses.length === 0) {
        return resolve(false);
      } else {
        return resolve(true);
      }
    });
  });
}
