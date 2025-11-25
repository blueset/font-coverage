// import { getAglfn } from "./aglfn";
// import { getAdobeGlyphSets } from "./adobe";
import {
  getAdobeCNS17,
  getAdobeGB16,
  getAdobeJapan17,
  getAdobeKR9,
  getAdobeManga10,
} from "./adobeCmap";
// import { getGfSets } from "./gf";
// import { getJfSets } from "./jf";
// import { getNightFurySL2001Sets } from "./nightFurySL2001";
// import { getUnicodeData } from "./unicode";

(async () => {
  console.log("Generating glyph sets...");
  // await getAdobeGlyphSets();
  await getAdobeJapan17();
  await getAdobeGB16();
  await getAdobeCNS17();
  await getAdobeKR9();
  await getAdobeManga10();
  // await getAglfn();
  // await getGfSets();
  // await getJfSets();
  // await getNightFurySL2001Sets();
  // await getUnicodeData();
  console.log("Done.");
})();
