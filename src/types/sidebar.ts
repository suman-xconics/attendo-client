export const MenuState = {
  NEW: "NEW",
  BETA: "BETA",
  DEPRECATED: "DEPRECATED",
  COMING_SOON: "COMING_SOON",
  UPDATED: "UPDATED",
} as const;

export type MenuState = (typeof MenuState)[keyof typeof MenuState];

export type SidebarItem = {
  id: string;
  label: string;
  groupLabel?: string;
  icon?: string;
  external?: boolean;
  badge?: string;
  hasSubItems?: boolean;
  state?: MenuState;
  route?: string;
  subItems?: SidebarItem[];
};
