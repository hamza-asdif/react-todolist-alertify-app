
import { FaClipboardList } from "react-icons/fa";

// **** import style
import './HeaderTitle.css'

const HeaderTitle = () => {
  return (
    <header className="header-title">
        <h1>To-Do List App</h1>
        <FaClipboardList  className="todolist-icon"/>
      </header>
  )
}

export default HeaderTitle
