/** biome-ignore-all lint/performance/noNamespaceImport:forced*/
import * as TablerIcons from "@tabler/icons-react";
import * as LucideIcons from "lucide-react";

type Icon = React.ComponentType<any>;

export const getIcon = (iconName: string): Icon => {
  const tablerIcon = (TablerIcons as any)[iconName];
  if (tablerIcon) {
    return tablerIcon;
  }

  const lucideIcon = (LucideIcons as any)[iconName];
  if (lucideIcon) {
    return lucideIcon;
  }

  return TablerIcons.IconCommand;
};
