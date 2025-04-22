import { FaClipboardCheck } from "react-icons/fa";

// **** import style
import './HeaderTitle.css'

const HeaderTitle = () => {
  return (
    <div className="header-container">
      <div className="logo-container">
        <FaClipboardCheck className="logo-icon" />
      </div>
      <div className="title-container">
        <h1 className="app-title">TaskMaster Pro</h1>
        <p className="app-subtitle">Organize your tasks efficiently</p>
      </div>
    </div>
  );
};

export default HeaderTitle
