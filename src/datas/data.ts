import { FormInputOption_Type } from "@/types/type";
import { ProductObject_Type } from "./type";

const RAW_PRODUCT: string[] = [
"Adaptogenic Cafe Latte, 300 mL", // lattes
"Adaptogenic Mocha Latte, 300 mL",

"Celery, 300 mL", // cold-pressed juices
"Deep Roots, 300 mL",
"Farma-C, 60 mL, 300 mL",
"Gatsby, 300 mL, 900 mL, 946 mL",
"Genius, 300 mL",
"Ginger Apple Crips, 300 mL, 946 mL",
"Ginger-Aid+, 300 mL",
"Rose, 300 mL",
"The Giver, 300 mL",
"The Good, 300 mL",
"The Stranger, 300 mL",
"Wing Man, 300 mL",

"Blue Lemonade, 300 mL", // lemonades
"Fiery Ginger Lemonade, 300 mL",
"Lavender Lemonade, 300 mL",
"Spicy Turmeric Lemonade, 300 mL",
"Strawberry Lemonade, 300 mL",

"Almondmilk, 946 mL", // nutmilks
"Almondmilk - Unsweetened, 946 mL",
"Oatmilk, 946 mL",
"Oatmilk - Unsweetened, 946 mL",
"Pumpkin Spcice Oatmilk, 946 mL",
"Holiday Nog, 946 mL",
"Oat Creamer, 473 mL",
"Oat Creamer - Unsweetened, 473 mL",

"Easy Greens Super Smoothie, 300 mL, 900 mL", // RTD smoothies
"Marvelous Mango Super Smoothie, 300 mL, 900 mL",

"Chocolate Protein Shake, 300 mL, 900 mL", // shakes
"Coffee Protein Shake, 300 mL",
"Matcha Protein Shake, 300 mL, 900 mL",
"Rococoa, 300 mL, 946 mL",
"Vanilla Almond Protein Shake, 300 mL, 900 mL",

"Blood Orange & Hibiscus Probiotic Sparkling Water, 355 mL", // sparklings
"Blueberry & Elderflower Probiotic Sparkling Water, 355 mL",
"Grapefruit Yuzu & Rosemary Probiotic Sparkling Water, 355 mL",
"Citrus Cayenne Kombucha, 325 mL",
"Cranberry Kombucha, 325 mL",
"Ginger Turmeric Kombucha, 325 mL",
"Grapefruit Kombucha, 325 mL",
"Lime Lemongrass Kombucha, 325 mL",
"Ultraviolet Kombucha, 325 mL",
"Ginger Beer, 340 mL",
"Unwind Passionflower Sparkling Phytotonic, 355 mL",
"Uplift Ashwagandha Sparkling Phytotonic, 355 mL",
"Clarify Dandelion Sparkling Phytotonic, 355 mL",

"Detox, 60 mL", // shots
"Everyday Greens, 60 mL",
"Fiery Ginger, 60 mL, 1.26 L",
"Flu Shot, 60 mL",
"Ginger Defence, 60 mL",
"Glow, 60 mL",
"Green Ritual, 60 mL",
"Inside Job, 60 mL",
"Lullaby, 60 mL",
"Memoir, 60 mL",
"Mood Shine, 60 mL",
"Pick-Me-Up, 60 mL",
"Power-Up Mushroom, 60 mL",
"Smart Energy, 60 mL"
];

export const PRODUCT: ProductObject_Type[] = RAW_PRODUCT.map(product => {
  const s = product.split(", ");
  const flavour = s[0];
  var size: string[] = s.slice(1);
  return {productFlavour: flavour, productSize: size};
});

export const FLAVOUR: string[] = PRODUCT.map((product) => product.productFlavour);
export const SIZE: string[] = ["60 mL", "300 mL", "325 mL", "340 mL", "355 mL", "900 mL", "946 mL", "1.26 L"];

export const LOCATION: string[] = [
  "Brookfield",
  "Forest Hill",
  "Macpherson",
  "Queen West",
  "St. Clair",
  "Union Station",
  "Home Delivery",
  "Amazon",
  "Nashua",
  "Customer Service (Grocery / Non-Greenhouse Retail Store)"
]

export const COMPLAINT_TYPE: string[] = ["Customer Complaint", "Store Complaint"]
export const YES_NO: string[] = ["Yes", "No"]
// export const ISSUE: string[] =;
// export const 



export const convertToOption = (values: string[]) : FormInputOption_Type[] => {
  return values.map((value: string) => {
    return {value: value, label: value}; 
  })
}

export const getFlavour = (products: ProductObjectType[]) : string[] => {
  return [... new Set(products.map(productObject => {
    return productObject.productFlavour;
  }))];
}

export const getSize = (products: ProductObjectType[]) : string[] => {
  var size: string[] = [];
  for (var i = 0; i < products.length; ++i) {
    size = size.concat(products[i].productSize);
  }
  return [... new Set(size)];
}

export const filterFlavour = (flavour: string, size: string) : boolean => {
  if (size == "") {
    return true;
  }
  for (const product of PRODUCT) {
    if (product.productFlavour != flavour) continue;
    if (product.productSize.includes(size)) {
      return true;
    }
  }
  return false;
}

export const filterSize = (flavour: string, size: string) : boolean => {
  if (flavour == "") {
    return true;
  }
  for (const product of PRODUCT) {
    if (product.productFlavour != flavour) continue;
    if (product.productSize.includes(size)) {
      return true;
    }
  }
  console.log("false");
  return false;
}