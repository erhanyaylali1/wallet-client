import React from 'react'
import { Menu } from 'antd';
import { MenuOutlined, WalletOutlined, FlagOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getIsUserLogged, logout } from '../features/userSlice';
import { useNavigate, useLocation } from "react-router-dom";
import { getLanguage, setLanguage } from '../features/generalSlice';
import text from '../constants/language'

const { SubMenu } = Menu;

const Navbar = () => {

    const language = useSelector(getLanguage);
    const isLogged = useSelector(getIsUserLogged);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const url = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        localStorage.removeItem("token");
    }

    return (
        <Menu mode="horizontal" className="nav-bar-for-shadow">
            <Menu.Item key="home" icon={<WalletOutlined />}>
                <Link to="/home">
                    eWallet
                </Link>
            </Menu.Item>
            <SubMenu key="dil" icon={<FlagOutlined />} popupClassName="language-selector">
                <Menu.Item key="tr" onClick={() => dispatch(setLanguage("tr"))}>
                    Türkçe
                </Menu.Item>
                <Menu.Item key="eng" onClick={() => dispatch(setLanguage("en"))}>
                    English
                </Menu.Item>
            </SubMenu>
            <SubMenu icon={<MenuOutlined />}>
                {isLogged ? (
                    <React.Fragment>
                        {url.pathname === "/profile" ? (
                            <Menu.Item>
                                <Link to="/home">
                                    {text[language].wallet}
                                </Link>
                            </Menu.Item>
                        ):(
                            <Menu.Item>
                                <Link to="/profile">
                                    {text[language].profile}
                                </Link>
                            </Menu.Item>
                        )}
                        <Menu.Item>
                            <p onClick={handleLogout}>
                                {text[language].logout}
                            </p>
                        </Menu.Item>
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        <Menu.Item>
                            <Link to="/login">
                                {text[language].login}
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link to="/register">
                                {text[language].register}
                            </Link>
                        </Menu.Item>
                    </React.Fragment>
                )}
            </SubMenu>
        </Menu>
    )
}

export default Navbar
