export type PinnedProject = {
  repo: string;
  narrative: string;
};

export const pinnedProjects: PinnedProject[] = [
  {
    repo: "gta-vi-global-pricing",
    narrative:
      "Live PlayStation Store pricing for GTA VI across 73 regions, scraped, normalised, and compared in one place.",
  },
  {
    repo: "glasspick",
    narrative:
      "Provably fair giveaway winner picker: commit-reveal draws seeded by the drand public randomness beacon, verifiable by anyone.",
  },
  {
    repo: "git-chunks",
    narrative:
      "Splits large pushes into chunked commits to beat SCM push size limits and per-push scan/hook timeouts.",
  },
  {
    repo: "qr-code-generator",
    narrative:
      "Generates QR code images from contact details in an Excel file, with flexible output formats and a clean CLI.",
  },
];
