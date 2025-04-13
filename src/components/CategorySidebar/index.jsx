// import React from 'react'
// import arrow from './right-arrow.svg';
// import { Link } from 'react-router-dom';

// const index = ({ setsubCategoryMenu, setCategoriesSidebar, CategoriesSidebar, openCategorySubmenu, subCategoryMenu,subCategories,activeSubmenu }) => {
//     return (
//         <div className={`categoriesDropdown ${CategoriesSidebar && "active"}`}>
//             <h2>Categories
//                 <svg onClick={() => {
//                     setsubCategoryMenu(false)
//                     setCategoriesSidebar(false)
//                     }} 
//                     width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.825 1.18656C14.7248 1.08614 14.6057 1.00646 14.4747 0.952095C14.3436 0.897732 14.2031 0.869749 14.0612 0.869749C13.9194 0.869749 13.7789 0.897732 13.6478 0.952095C13.5168 1.00646 13.3977 1.08614 13.2975 1.18656L8 6.47323L2.7025 1.17573C2.6022 1.07543 2.48313 0.995873 2.35209 0.941593C2.22104 0.887312 2.08059 0.859375 1.93875 0.859375C1.79691 0.859375 1.65645 0.887312 1.52541 0.941593C1.39436 0.995873 1.27529 1.07543 1.175 1.17573C1.0747 1.27603 0.995141 1.3951 0.94086 1.52614C0.88658 1.65719 0.858643 1.79764 0.858643 1.93948C0.858643 2.08132 0.88658 2.22177 0.94086 2.35282C0.995141 2.48386 1.0747 2.60293 1.175 2.70323L6.4725 8.00073L1.175 13.2982C1.0747 13.3985 0.995141 13.5176 0.94086 13.6486C0.88658 13.7797 0.858643 13.9201 0.858643 14.062C0.858643 14.2038 0.88658 14.3443 0.94086 14.4753C0.995141 14.6064 1.0747 14.7254 1.175 14.8257C1.27529 14.926 1.39436 15.0056 1.52541 15.0599C1.65645 15.1141 1.79691 15.1421 1.93875 15.1421C2.08059 15.1421 2.22104 15.1141 2.35209 15.0599C2.48313 15.0056 2.6022 14.926 2.7025 14.8257L8 9.52823L13.2975 14.8257C13.3978 14.926 13.5169 15.0056 13.6479 15.0599C13.779 15.1141 13.9194 15.1421 14.0612 15.1421C14.2031 15.1421 14.3435 15.1141 14.4746 15.0599C14.6056 15.0056 14.7247 14.926 14.825 14.8257C14.9253 14.7254 15.0049 14.6064 15.0591 14.4753C15.1134 14.3443 15.1414 14.2038 15.1414 14.062C15.1414 13.9201 15.1134 13.7797 15.0591 13.6486C15.0049 13.5176 14.9253 13.3985 14.825 13.2982L9.5275 8.00073L14.825 2.70323C15.2367 2.29156 15.2367 1.59823 14.825 1.18656Z" fill="#717171" /></svg>
//             </h2>
//             {/* <p onClick={()=>openCategorySubmenu("category 1")}>Category 1 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 2")}>Category 2 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 3")}>Category 3 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 4")}>Category 4 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 5")}>Category 5 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 6")}>Category 6 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 7")}>Category 7 <img src={arrow} alt="" /></p>
//     <p onClick={()=>openCategorySubmenu("category 8")}>Category 8 <img src={arrow} alt="" /></p> */}
//             {/* {subCategories.map((x , index)=>{
//       return(
//         <p onClick={()=>{openCategorySubmenu(x.name)}}>{x.name} <img src={arrow} /></p>
//       )
//     })}
//     <div className={`SubMenu ${subCategoryMenu && "active"}`}>
//       <h2>Sub Category Name</h2>
//       <div>
//       {subCategories.map((x, index)=>(
//         <Link key={index} to={`/shop/${x.route}`} onClick={()=>openCategorySubmenu()}> <img src={x.img} alt="" />{x.name}</Link>
//       ))}
//       </div>
//     </div> */}
//             {subCategories.map((x, index) => {
//                 return (
//                     <p key={index} onClick={() => { openCategorySubmenu(x.name) }}>{x.name} <img src={arrow} /></p>
//                 )
//             })}
//             <div>
//                 {/* <p key={index} onClick={()=>{openCategorySubmenu(x.name)}}>{x.name} <img src={arrow} className={`${x.name}`}/></p> */}
//                 <div className={`SubMenu ${subCategoryMenu && "active"}`}>
//                     <h2>Sub Category Name</h2>
//                     <div>
//                         {subCategories.map((cat, index) => (
//                             cat.subCategory.map((category, subindex) => (
//                                 activeSubmenu == cat.name &&
//                                 <Link
//                                     key={subindex}
//                                     to={`/shop/${category.route}`}
//                                     onClick={() => openCategorySubmenu()}
//                                 >
//                                     <img src={category.img} alt="" />
//                                     {category.cat_name}
//                                 </Link>
//                             ))
//                         ))}

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default index