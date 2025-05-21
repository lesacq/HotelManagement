import { NavLink } from "react-router-dom"
import { FaHome } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
const navItems =[
  {icon:<FaHome />,title:"Home",path:"/home"},
  {icon:<FaBook  />,title:"Bookings",path:"/bookings"},
  {icon:<FaBuildingCircleArrowRight />,title:"Room",path:"/rooms"},
  {icon:<MdOutlineLocalLaundryService />,title:"Services",path:"/services"},
  {icon:<GrUserWorker />,title:"Staff",path:"/staff"},
  {icon:<MdPayments />,title:"Payments",path:"/payments"},
  {icon:<FaPeopleGroup />,title:"Guests",path:"/guests"}
]

export default function SidePanel() {
  return (
    <div className='w-full h-full flex flex-col items-center p-2'>
     <nav className="flex-1 mt-4 overflow-y-auto">
        <ul className="space-y-2 ">
          {navItems.map(({ path, icon, title }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center p-2 px-6 space-x-3 rounded-md ${isActive ? "bg-[#079b31] text-white" : "hover:bg-[#5dbe79]"}`
                }
              >
                <span className="text-xl">{icon}</span>
                {<span className="text-sm">{title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
