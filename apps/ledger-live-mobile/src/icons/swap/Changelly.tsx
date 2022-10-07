import React from "react";
import Svg, { Path } from "react-native-svg";

const Changelly = ({ size }: { size: number }) => (
  <Svg viewBox="0 0 32 32" height={size} width={size}>
    <Path
      d="M15.7233 24.9599C15.5198 25.1662 15.2979 25.3537 15.0575 25.5225C14.5951 25.8788 14.1143 26.1788 13.5964 26.4601C12.5793 26.9852 11.5066 27.379 10.3785 27.6041C10.1011 27.6603 9.82365 27.7166 9.54624 27.7541L9.12087 27.8103L8.91744 27.8291L8.714 27.8479L8.28864 27.8854L7.86328 27.9041C7.58587 27.9229 7.28996 27.9229 7.01255 27.9416C6.18032 27.9416 5.34808 27.9041 4.51585 27.8291C4.60832 27.6978 4.70079 27.5478 4.79326 27.3978C5.05218 26.9852 5.2926 26.5351 5.51453 26.0851C5.9214 25.1849 6.2358 24.2473 6.49472 23.3096C6.73514 22.3907 7.03104 21.5093 7.36394 20.6092C7.69683 19.709 8.0852 18.8464 8.52906 18.0025C8.21466 18.3588 7.93725 18.7526 7.67834 19.1652C7.41942 19.559 7.1605 19.9903 6.93857 20.4029C6.47622 21.2468 6.06935 22.1469 5.75495 23.0471C5.42206 23.9285 5.07067 24.8099 4.64531 25.6162C4.21995 26.4226 3.70211 27.1727 3.1103 27.8854L2.5 28.6355L3.46169 28.7668C4.64531 28.9355 5.84742 29.0293 7.04954 28.9918C7.34544 28.973 7.65984 28.973 7.95575 28.9355L8.3996 28.898L8.84346 28.8418C9.13937 28.8043 9.43527 28.7292 9.73118 28.6917C10.0271 28.6167 10.323 28.5605 10.6189 28.4667C10.9148 28.3917 11.1922 28.2792 11.4881 28.1854C11.7655 28.0729 12.0614 27.9604 12.3388 27.8291C12.8937 27.5853 13.43 27.2665 13.9293 26.929C14.4287 26.5914 14.891 26.1976 15.3164 25.7475C15.7233 25.2974 16.0931 24.8286 16.352 24.2848C16.1486 24.5473 15.9452 24.7723 15.7233 24.9599ZM22.3441 8.77595C22.677 8.4384 23.1209 8.25087 23.6017 8.25087C24.0641 8.25087 24.5079 8.41964 24.8593 8.77595C25.5436 9.48857 25.5436 10.6138 24.8593 11.3264C24.175 12.0202 23.0469 12.0202 22.3441 11.3264C22.0112 10.9888 21.8263 10.5387 21.8263 10.0512C21.8263 9.56358 22.0112 9.11351 22.3441 8.77595ZM23.6017 12.9391C24.3415 12.9391 25.0627 12.6578 25.6176 12.0953C26.7272 10.9513 26.7272 9.13226 25.6176 7.98832C24.5079 6.86314 22.6955 6.86314 21.5859 7.98832C21.0495 8.53216 20.7536 9.26353 20.7536 10.0324C20.7536 10.8013 21.0495 11.5327 21.5859 12.0765C22.1222 12.6391 22.8435 12.9391 23.6017 12.9391ZM24.434 17.1023C20.3468 20.7592 18.6453 21.0967 16.9439 20.3091L18.7933 17.9462C19.0707 17.6087 19.2556 17.1961 19.3666 16.7648L20.1063 13.5955L16.9993 14.3456C16.574 14.4581 16.1671 14.6457 15.8342 14.927L13.504 16.8023C12.7087 15.077 13.0601 13.3517 16.648 9.20728C20.0509 5.28788 27.2266 4.38773 29.3534 4.2002C29.1869 6.3568 28.2992 13.6518 24.434 17.1023ZM21.7153 22.7658C21.6783 22.9345 21.5859 23.1033 21.4379 23.1971C21.0126 23.4971 20.3468 23.9097 19.755 24.2848L19.7919 24.1722C20.0694 23.0283 20.0694 22.1469 19.7919 21.5468C20.5687 21.303 21.4009 20.8717 22.3441 20.2153C22.1037 21.0967 21.8448 22.1469 21.7153 22.7658ZM15.2609 20.7217C15.0205 21.0405 14.6321 21.2093 14.2437 21.1905H14.2252H13.3005L16.5185 17.2524L12.6347 20.5154V19.5965V19.559C12.6163 19.1652 12.7827 18.7714 13.0971 18.5276L16.5 15.7896C16.7219 15.6208 16.9808 15.4896 17.2398 15.4145L18.6268 15.077L18.2939 16.4835C18.2199 16.7648 18.109 17.0273 17.924 17.2524L15.2609 20.7217ZM9.71268 13.9331L9.60172 13.9706C9.95311 13.3705 10.36 12.6953 10.6559 12.264C10.7483 12.114 10.9148 12.0202 11.0812 11.9827C11.6915 11.8515 12.7272 11.5889 13.5964 11.3639C12.9491 12.3203 12.5238 13.1829 12.2834 13.9706C11.71 13.633 10.8408 13.633 9.71268 13.9331ZM29.9267 3.05626C29.5383 3.07501 20.1433 3.50633 15.8342 8.4759C15.4273 8.94473 15.039 9.43231 14.6506 9.91989C14.0218 10.0887 11.8395 10.6888 10.8778 10.8951C10.434 10.9888 10.0271 11.2514 9.76816 11.6452C9.10238 12.6203 7.95575 14.6269 7.91876 14.7019L7.08653 16.1459L8.60304 15.4708C9.60172 15.0395 11.2662 14.5894 11.858 14.9457C11.9505 15.002 12.0614 15.1145 12.0799 15.3958C12.0984 16.1084 12.2834 16.8023 12.6347 17.4961L12.4313 17.6649C11.858 18.1337 11.5251 18.8464 11.5621 19.5965V22.2782H14.2067C14.9465 22.3157 15.6493 21.9781 16.1116 21.3968L16.2781 21.1905C16.9624 21.5468 17.6466 21.7531 18.3494 21.7531C18.6268 21.7718 18.7193 21.8656 18.7933 21.9781C19.1631 22.5782 18.7193 24.2848 18.2754 25.2974L17.6096 26.8352L19.0337 25.9913C19.1262 25.935 21.0865 24.7723 22.0482 24.0972C22.4181 23.8347 22.677 23.4409 22.7695 22.972C22.9729 21.9969 23.5647 19.7653 23.7312 19.1277C24.175 18.7714 24.6374 18.3588 25.1367 17.9087C30.0192 13.5392 30.463 3.99391 30.4815 3.6001L30.5 3L29.9267 3.05626Z"
      fill="#54CA94"
    />
  </Svg>
);

export default Changelly;
