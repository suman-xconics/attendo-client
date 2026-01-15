import type { UserRoles } from "@/types/db";
import type { SidebarItem } from "@/types/sidebar";


export const getRoleBasedSidebarItems = (role?: UserRoles): SidebarItem[] => {
  const baseMenu: SidebarItem[] = [
    {
      id: "home",
      label: "Home",
      icon: "IconHome",
      hasSubItems: true,
      subItems: [
        {
          id: "dashboard",
          groupLabel: "overview",
          label: "Dashboard",
          route: "/",
        },
        // {
        //   id: "reports",
        //   groupLabel: "overview",
        //   label: "Reports",
        //   route: "/report",
        // },
      ],
    },
    {
      id: "Employee",
      label: "Employee",
      icon: "IconUsers",
      hasSubItems: true,
      subItems: [
        {
          id: "all",
          groupLabel: "Records",
          label: "All Employees",
          route: "/employee/overview/all",
        },
        {
          id: "create",
          groupLabel: "action",
          label: "Create",
          route: "/employee/action/new",
        },
        {
          id: "create_hr",
          groupLabel: "action",
          label: "Create HR",
          route: "/employee/action/hr/new",
        },
      ],
    },
    {
      id: "Attendance",
      label: "Attendance",
      icon: "IconCalendarEvent",
      hasSubItems: true,
      subItems: [
        {
          id: "logs",
          groupLabel: "Logs",
          label: "All Logs",
          route: "/attendance/action/logs",
        },
        {
          id: "enter_attendance",
          groupLabel: "action",
          label: "Add Record",
          route: "/attendance/action/add-record",
        },
      ],
    },
  ];

  // Role-based filtering
  const filteredMenu = baseMenu.filter((item) => {
    if (item.id === "Employee" && role === "EMPLOYEE") {
      return false; // Hide Employee menu for EMPLOYEE role
    }
    return true; // Show all other menus for other roles
  });

  return filteredMenu;
};

// Backward compatibility
export const myPanelSidebarItems: SidebarItem[] = getRoleBasedSidebarItems();
