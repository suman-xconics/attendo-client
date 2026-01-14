import type { SidebarItem } from "@/types/sidebar";


export const myPanelSidebarItems: SidebarItem[] = [
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
      {
        id: "reports",
        groupLabel: "overview",
        label: "Reports",
        route: "/report",
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
        route: "/employee/action/create",
      },
      {
        id: "create_hr",
        groupLabel: "action",
        label: "Create HR",
        route: "/employee/action/create-hr",
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
