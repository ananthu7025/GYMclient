import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Roles } from "../../utils/enum";

interface SubItem {
  label: string;
  link: string;
}

interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  subItems?: SubItem[];
}
const Sidebar: React.FC = () => {
  const userDetails = useSelector((state: any) => state.auth.userDetails);
  const [activeItem, setActiveItem] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Define separate menu items for each role
  const superAdminMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "ri-home-6-line",
      link: "/super-admin/dashboard",
    },
    { label: "Franchises", icon: "ri-store-line", link: "/franchises" },
    { label: "Gyms", icon: "ri-building-line", link: "/gyms" },
    { label: "Settings", icon: "ri-settings-3-line", link: "/settings" },
  ];

  const franchiseAdminMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "ri-home-6-line",
      link: "/franchise-admin/dashboard",
    },
    { label: "Memberships", icon: "ri-vip-crown-line", link: "/memberships" },
    { label: "Gyms", icon: "ri-building-line", link: "/gyms" },
    { label: "Reports", icon: "ri-file-list-line", link: "/franchise-reports" },
    { label: "Trainers", icon: "ri-run-line", link: "/trainers" }

    
  ];

  const gymAdminMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "ri-home-6-line",
      link: "/gym-admin/dashboard",
    },
    { label: "Memberships", icon: "ri-vip-crown-line", link: "/memberships" },
    {
      label: "Members",
      icon: "ri-group-line",
      subItems: [
        { label: "View Members", link: "/members" },
        { label: "Add Member", link: "/add-members" },
      ],
    },
    { label: "Trainers", icon: "ri-run-line", link: "/trainers" },
    { label: "Workouts", icon: "ri-dumbbell-line", link: "/workouts" },
  ];

  const trainerMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: "ri-home-6-line", link: "/trainer/dashboard" },
    { label: "My Classes", icon: "ri-calendar-line", link: "/my-classes" },
    { label: "Members", icon: "ri-group-line", link: "/my-members" },
  ];

  const memberMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: "ri-home-6-line", link: "/member/dashboard" },
    { label: "My Workouts", icon: "ri-dumbbell-line", link: "/my-workouts" },
    { label: "Diet Plans", icon: "ri-bowl-line", link: "/my-diet-plan" },
  ];

  const getMenuItems = () => {
    switch (userDetails?.user?.role) {
      case Roles.SUPER_ADMIN:
        return superAdminMenuItems;
      case Roles.FRANCHISE_ADMIN:
        return franchiseAdminMenuItems;
      case Roles.GYM_ADMIN:
        return gymAdminMenuItems;
      case Roles.TRAINER:
        return trainerMenuItems;
      case Roles.MEMBER:
        return memberMenuItems;
      default:
        return [];
    }
  };

  const handleClick = (itemLabel: string) => {
    setActiveItem(itemLabel);
  };

  const handleToggle = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = getMenuItems();

  return (
    <nav id="sidebar" className="sidebar-wrapper">
      <div className="sidebar-profile d-flex align-items-center flex-column">
        <div className="position-relative">
          <img
            src={
              userDetails?.additionalDetails?.logo || "../assets/images/user4.png"
            }
            className="img-shadow img-5x mb-3 rounded-circle"
            alt="Gym Admin Templates"
          />
          <span className="count-dot" />
        </div>
        <div className="text-center">
          <h6 className="profile-name text-nowrap text-truncate">
            {userDetails ? userDetails?.user?.name : ""}
          </h6>
        </div>
      </div>
      <div className="sidebarMenuScroll">
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`treeview ${
                activeItem === item.label ? "active" : ""
              }`}
            >
              <Link
                to={item.link || "#"}
                onClick={() => {
                  handleClick(item.label);
                  handleToggle(item.label);
                }}
              >
                <i className={item.icon} />
                <span className="menu-text">{item.label}</span>
              </Link>
              {item.subItems && expandedItems[item.label] && (
                <ul className="treeview-menu">
                  {item.subItems.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className={`${
                        activeItem === subItem.label ? "active" : ""
                      }`}
                    >
                      <Link
                        to={subItem.link}
                        onClick={() => handleClick(subItem.label)}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
