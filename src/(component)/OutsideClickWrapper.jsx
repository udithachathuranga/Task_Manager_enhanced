// import React, { useEffect, useRef } from 'react';

// export default function OutsideClickWrapper({ children, onOutsideClick }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         onOutsideClick(); // Call your handler to hide the component
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [onOutsideClick]);

//   return (
//     <div ref={ref}>
//       {children}
//     </div>
//   );
// }
