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
        ...(role === "ADMIN"
          ? [{
            id: "create_hr",
            groupLabel: "action",
            label: "Create HR",
            route: "/employee/action/hr/new",
          }]
          : []
        ),
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
          groupLabel: "logs",
          label: "All Logs",
          route: "/attendance/logs/all",
        },
        ...(role !== "EMPLOYEE"
          ? [
            {
              id: "action",
              groupLabel: "action",
              label: "Add Manual Entry",
              route: "/attendance/action/new",
            },
          ]
          : []
        ),
      ],
    },
  ];

  // Role-based filtering for entire menu items
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
