import paracetamolImage from "../../assets/drugs/paracetamol.jpg";
import ventolin from "../../assets/drugs/ventolin.webp";
import amartem from "../../assets/drugs/amartem.jpg";
import postinor from "../../assets/drugs/postinor.jpg";

export const mockPopularNeeds = [
  {
    id: "need-pain-relief",
    title: "Pain relief",
    description: "Common options for headaches, body pain, and mild fever support.",
    drugIds: ["drug-paracetamol-500-tablet", "drug-ibuprofen-200-capsule"],
    resultCount: 24,
    accent: "#2f5a4f",
    image: paracetamolImage,
  },
  {
    id: "need-malaria",
    title: "Malaria care",
    description: "Frequently searched antimalarial medicines around partner pharmacies.",
    drugIds: ["drug-amatem-softgel", "drug-coartem-20-120-tablet"],
    resultCount: 12,
    accent: "#285b66",
    image: amartem,
  },
  {
    id: "need-womens-health",
    title: "Women's health",
    description: "Emergency contraception and other commonly requested women's health products.",
    drugIds: ["drug-postinor-2-tablet", "drug-levonorgestrel-1-5mg-tablet"],
    resultCount: 8,
    accent: "#6a4b52",
    image: postinor,
  },
  {
    id: "need-respiratory",
    title: "Respiratory",
    description: "Quick access to inhalers and nearby alternatives for breathing support.",
    drugIds: ["drug-ventolin-inhaler", "drug-salbutamol-inhaler-generic"],
    resultCount: 6,
    accent: "#4f5e2b",
    image: ventolin,
  },
];
