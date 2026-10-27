export type CategoryId = "all" | "wafer" | "peep" | "snack";

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  category: CategoryId;
  price: number;
  tag: string;
  tagColor: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  { id: "all", name: "ทั้งหมด", icon: "fa-layer-group" },
  { id: "wafer", name: "เวเฟอร์สติ๊ก", icon: "fa-cookie" },
  { id: "peep", name: "ขนมขาไก่", icon: "fa-box-archive" },
  { id: "snack", name: "ขนมทานเล่น", icon: "fa-utensils" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "สติ๊กช็อกโกแลต",
    category: "wafer",
    price: 65,
    tag: "ขายดี",
    tagColor: "bg-stone-800",
    image:
      "/สติ๊กช็อกโกแลต.jpg",
    description: "Chocolate Rolled Wafer Stick",
  },
  {
    id: 2,
    name: "สติ๊กสตอเบอรี่",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image:
      "/สติ๊กสตอเบอรี่.jpg",
    description: "Strawberry Rolled Wafer Stick",
  },
  {
    id: 3,
    name: "สติ๊กลายช็อกโกแลต",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image:
      "/สติ๊กสตอเบอรี่.jpg",
    description: "Strawberry Rolled Wafer Stick",
  },
  {
    id: 2,
    name: "สติ๊กสตอเบอรี่",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image:
      "/สติ๊กสตอเบอรี่.jpg",
    description: "Strawberry Rolled Wafer Stick",
  },
  {
    id: 3,
    name: "ขาไก่ 5 รส",
    category: "peep",
    price: 180,
    tag: "แนะนำ",
    tagColor: "bg-amber-700",
    image:
      "/ขาไก่ 5 รส.jpg",
    description: "Five Tasty Stick Biscuit",
  },
  {
    id: 4,
    name: "ขาไก่เค็ม",
    category: "peep",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image:
      "/ขาไก่เค็ม.jpg",
    description: "Salty Stick Biscuit",
  },
  {
    id: 5,
    name: "บุษราคัม",
    category: "peep",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image:
      "/บุษราคัม.jpg",
    description: "Topaz Salty Biscuit",
  },
  {
    id: 6,
    name: "คิงคอง 5 รส",
    category: "peep",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image:
      "/คิงคอง 5 รส.jpg",
    description: "King Kong Five Tasty",
  },
  {
    id: 7,
    name: "ขาไก่เค็มอบกรอบสูตรโบราณ",
    category: "snack",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    description: "ขาไก่อบกรอบ เค็มๆ มันๆ ทานเพลินเคี้ยวสนุก",
  },
  {
    id: 8,
    name: "ขาไก่เค็มอบกรอบสูตรโบราณ",
    category: "snack",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    description: "ขาไก่อบกรอบ เค็มๆ มันๆ ทานเพลินเคี้ยวสนุก",
  },
  {
    id: 9,
    name: "ขาไก่เค็มอบกรอบสูตรโบราณ",
    category: "snack",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    description: "ขาไก่อบกรอบ เค็มๆ มันๆ ทานเพลินเคี้ยวสนุก",
  },
];