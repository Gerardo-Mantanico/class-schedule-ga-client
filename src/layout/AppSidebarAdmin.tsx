"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  ListIcon,
  BoxCubeIcon,
  FileIcon,
  TaskIcon,
  TimeIcon,
  PieChartIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

type SidebarNavItemProps = {
  nav: NavItem;
  index: number;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  openSubmenu: number | null;
  subMenuHeight: Record<number, number>;
  subMenuRefs: { current: Record<number, HTMLDivElement | null> };
  isActive: (path: string) => boolean;
  handleSubmenuToggle: (index: number) => void;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  nav,
  index,
  isExpanded,
  isHovered,
  isMobileOpen,
  openSubmenu,
  subMenuHeight,
  subMenuRefs,
  isActive,
  handleSubmenuToggle,
}) => {
  const shouldShowLabels = isExpanded || isHovered || isMobileOpen;
  const isSubmenuOpen = openSubmenu === index;
  const menuAlignmentClass = !isExpanded && !isHovered
    ? "lg:justify-center"
    : "lg:justify-start";

  if (!nav.subItems && nav.path) {
    return (
      <li>
        <Link
          href={nav.path}
          className={`menu-item group ${
            isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
          }`}
        >
          <span
            className={`${
              isActive(nav.path)
                ? "menu-item-icon-active"
                : "menu-item-icon-inactive"
            }`}
          >
            {nav.icon}
          </span>
          {shouldShowLabels && <span className="menu-item-text">{nav.name}</span>}
        </Link>
      </li>
    );
  }

  if (!nav.subItems) {
    return <li />;
  }

  return (
    <li>
      <button
        onClick={() => handleSubmenuToggle(index)}
        className={`menu-item group ${
          isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
        } cursor-pointer ${menuAlignmentClass}`}
      >
        <span
          className={` ${
            isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
          }`}
        >
          {nav.icon}
        </span>
        {shouldShowLabels && <span className="menu-item-text">{nav.name}</span>}
        {shouldShowLabels && (
          <ChevronDownIcon
            className={`ml-auto h-5 w-5 transition-transform duration-200 ${
              isSubmenuOpen ? "rotate-180 text-brand-500" : ""
            }`}
          />
        )}
      </button>
      {shouldShowLabels && (
        <div
          ref={(el) => {
            subMenuRefs.current[index] = el;
          }}
          className="overflow-hidden transition-all duration-300"
          style={{
            height: isSubmenuOpen ? `${subMenuHeight[index]}px` : "0px",
          }}
        >
          <ul className="ml-9 mt-2 space-y-1">
            {nav.subItems.map((subItem) => {
              const isSubItemActive = isActive(subItem.path);
              const badgeClass = isSubItemActive
                ? "menu-dropdown-badge-active"
                : "menu-dropdown-badge-inactive";

              return (
                <li key={subItem.name}>
                  <Link
                    href={subItem.path}
                    className={`menu-dropdown-item ${
                      isSubItemActive
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                    <span className="ml-auto flex items-center gap-1">
                      {subItem.new && (
                        <span className={`menu-dropdown-badge ml-auto ${badgeClass}`}>
                          new
                        </span>
                      )}
                      {subItem.pro && (
                        <span className={`menu-dropdown-badge ml-auto ${badgeClass}`}>
                          pro
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
  },
  {
    icon: <ListIcon />,
    name: "Cursos",
    path: "/admin/cursos",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Salones",
    path: "/admin/salones",
  },
  {
    icon: <UserCircleIcon />,
    name: "Docentes",
    path: "/admin/docentes",
  },
  {
    icon: <FileIcon />,
    name: "Carga CSV",
    path: "/admin/carga-csv",
  },
  {
    icon: <TaskIcon />,
    name: "Config. Horarios",
    path: "/admin/configuracion-horarios",
  },
  {
    icon: <TimeIcon />,
    name: "Horarios",
    path: "/admin/horarios",
  },
  {
    icon: <PieChartIcon />,
    name: "Reportes",
    path: "/admin/reporte",
  },
];

const AppSidebarAdmin: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const sidebarWidthClass = isExpanded || isMobileOpen || isHovered ? "w-72.5" : "w-22.5";

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
            submenuMatched = true;
          }
        });
      }
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      if (subMenuRefs.current[openSubmenu]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu === index) {
        return null;
      }
      return index;
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${sidebarWidthClass}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Administrador"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) => (
                  <SidebarNavItem
                    key={nav.name}
                    nav={nav}
                    index={index}
                    isExpanded={isExpanded}
                    isHovered={isHovered}
                    isMobileOpen={isMobileOpen}
                    openSubmenu={openSubmenu}
                    subMenuHeight={subMenuHeight}
                    subMenuRefs={subMenuRefs}
                    isActive={isActive}
                    handleSubmenuToggle={handleSubmenuToggle}
                  />
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebarAdmin;
