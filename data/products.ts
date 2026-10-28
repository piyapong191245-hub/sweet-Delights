export type CategoryId = "all" | "wafer" | "peep" | "pineapple";

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
  { id: "wafer", name: "เวเฟอร์สติ๊ก", icon: "fa-stroopwafel" },
  { id: "peep", name: "ขนมขาไก่", icon: "fa-drumstick-bite" },
  { id: "pineapple", name: "บิสกิตสอดไส้แยมสับปะรด", icon: "fa-cookie-bite" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "สติ๊กช็อกโกแลต",
    category: "wafer",
    price: 65,
    tag: "ขายดี",
    tagColor: "bg-stone-800",
    image: "/สติ๊กช็อกโกแลต.jpg",
    description: "Chocolate Rolled Wafer Stick",
  },
  {
    id: 2,
    name: "สติ๊กม้าลาย",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/สติ๊กม้าลาย.jpg",
    description: "Zebra Chocolate Rolled Wafer Stick",
  },
  {
    id: 3,
    name: "สติ๊กลายช็อกโกแลต",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/สติ๊กลายช็อกโกแลต.jpg",
    description: "Magic Chocolate Rolled Wafer Stick",
  },
  {
    id: 4,
    name: "สติ๊กสตอเบอรี่",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/สติ๊กสตอเบอรี่.jpg",
    description: "Strawberry Rolled Wafer Stick",
  },
  {
    id: 5,
    name: "สติ๊กส้ม",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/สติ๊กส้ม.jpg",
    description: "Orange Rolled Wafer Stick",
  },
  {
    id: 6,
    name: "มินิสติ๊กช็อกโกแลต",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/มินิสติ๊กช็อกโกแลต.jpg",
    description: "Mini Chocolate Rolled Wafer Stick",
  },
  {
    id: 7,
    name: "มินิสติ๊กม้าลาย",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/มินิสติ๊กม้าลาย.jpg",
    description: "Mini Zebra Chocolate Rolled Wafer Stick",
  },
  {
    id: 8,
    name: "มินิสติ๊กสตรอเบอรี่",
    category: "wafer",
    price: 180,
    tag: "อบสดใหม่",
    tagColor: "bg-amber-500",
    image: "/มินิสติ๊กสตรอเบอรี่.jpg",
    description: "Mini Strawberry Rolled Wafer Stick",
  },
  {
    id: 9,
    name: "ขาไก่ 5 รส",
    category: "peep",
    price: 180,
    tag: "แนะนำ",
    tagColor: "bg-amber-700",
    image: "/ขาไก่ 5 รส.jpg",
    description: "Five Tasty Stick Biscuit",
  },
  {
    id: 10,
    name: "ขาไก่เค็ม",
    category: "peep",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/ขาไก่เค็ม.jpg",
    description: "Salty Stick Biscuit",
  },
  {
    id: 11,
    name: "บุษราคัม",
    category: "peep",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/บุษราคัม.jpg",
    description: "Topaz Salty Biscuit",
  },
  {
    id: 12,
    name: "คิงคอง 5 รส",
    category: "peep",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/คิงคอง 5 รส.jpg",
    description: "King Kong Five Tasty",
  },
  {
    id: 13,
    name: "กะทิสับปะรด",
    category: "pineapple",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/กะทิสับปะรด.jpg",
    description: "Coconut Pineapple Jam Biscuit",
  },
  {
    id: 14,
    name: "จักรทอง",
    category: "pineapple",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/จักรทอง.jpg",
    description: "Golden Wheel Pineapple Biscuit",
  },
  {
    id: 15,
    name: "จักรเล็ก",
    category: "pineapple",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/จักรเล็ก.jpg",
    description: "Mini Wheel Pineapple Biscuit",
  },
  {
    id: 16,
    name: "ชีสสับปะรด",
    category: "pineapple",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/ชีสสับปะรด.jpg",
    description: "Pineapple Cheese Biscuit",
  },
  {
    id: 17,
    name: "ชีสจิ๋วสับปะรด",
    category: "pineapple",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/ชีสจิ๋วสับปะรด.jpg",
    description: "Mini Pineapple Cheese Biscuit",
  },
  {
    id: 18,
    name: "อิงริชสับปะรด",
    category: "pineapple",
    price: 45,
    tag: "ทานเล่น",
    tagColor: "bg-stone-600",
    image: "/อิงริชสับปะรด.jpg",
    description: "English Pineapple Jam Biscuit",
  },
];