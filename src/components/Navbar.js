import React from 'react'
import { Menu } from 'antd';
import { MenuOutlined, WalletOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getIsUserLogged, logout } from '../features/userSlice';
import { useNavigate, useLocation } from "react-router-dom";

const { SubMenu } = Menu;

const Navbar = () => {

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
             <Menu.Item key="mail" icon={<WalletOutlined />}>
                 <Link to="/home">
                    eWallet
                </Link>
            </Menu.Item>
            <SubMenu icon={<MenuOutlined />}>
                {isLogged ? (
                    <React.Fragment>
                        {url.pathname === "/profile" ? (
                            <Menu.Item>
                                <Link to="/home">
                                    Wallet
                                </Link>
                            </Menu.Item>
                        ):(
                            <Menu.Item>
                                <Link to="/profile">
                                    Your Assets
                                </Link>
                            </Menu.Item>
                        )}
                        <Menu.Item>
                            <p onClick={handleLogout}>
                                Logout
                            </p>
                        </Menu.Item>
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        <Menu.Item>
                            <Link to="/login">
                                Login
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link to="/register">
                                Register
                            </Link>
                        </Menu.Item>
                    </React.Fragment>
                )}
            </SubMenu>
        </Menu>
    )
}

export default Navbar
