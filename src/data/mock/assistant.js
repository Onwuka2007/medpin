export const assistantQuickActions = [
  {
    id: "scan-prescription",
    title: "Scan doctor's scribble",
    description: "Upload a prescription photo and extract medicine names quickly.",
    icon: "scanText",
    category: "upload",
  },
  {
    id: "scan-drug-pack",
    title: "Scan drug pack",
    description: "Snap a drug pack or label to detect the name and strength.",
    icon: "packageSearch",
    category: "upload",
  },
  {
    id: "find-alternatives",
    title: "Find alternatives",
    description: "See dummy AI alternatives when a drug is unavailable nearby.",
    icon: "sparkles",
    category: "insight",
  },
  {
    id: "explain-prescription",
    title: "Explain prescription",
    description: "Get a simple explanation of what is written on a prescription.",
    icon: "fileSearch",
    category: "insight",
  },
];

export const assistantUploadFlows = {
  "scan-prescription": {
    title: "Scan doctor's scribble",
    description:
      "Upload a prescription image and MedPin will pull out drug names and common spellings.",
    helperText:
      "Best results come from clear photos taken in good light with the full note visible.",
  },
  "scan-drug-pack": {
    title: "Scan drug pack",
    description:
      "Upload a photo of a drug pack, sachet, or label to extract the medicine name and strength.",
    helperText:
      "Include the drug name area, brand, and dosage details where possible.",
  },
};
