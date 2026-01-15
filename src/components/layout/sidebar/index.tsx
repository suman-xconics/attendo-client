"use client";

import { getRoleBasedSidebarItems } from "@/constants/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { IconSquareRoundedChevronRight, IconX } from "@tabler/icons-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "@/types/sidebar";
import { getIcon } from "@/utils/get-icon";
import { useAuth } from "@/provider/auth";

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const { role } = useAuth()
  const router = useRouter();

   const sidebarItems = getRoleBasedSidebarItems(role ? role : undefined);


  // FIXED: Proper active state detection with exact matching
  const activeState = useMemo(() => {
    for (const item of  sidebarItems) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.route === pathname) {
            return { mainItem: item.id, expandedSubs: new Set([subItem.id]) };
          }
          if (subItem.subItems?.some(nested => nested.route === pathname)) {
            return { mainItem: item.id, expandedSubs: new Set([subItem.id]) };
          }
        }
      }
    }
    return { mainItem: null, expandedSubs: new Set<string>() };
  }, [pathname]);

  const [activeItem, setActiveItem] = useState<string | null>(activeState.mainItem);
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(activeState.expandedSubs);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setActiveItem(activeState.mainItem);
    setExpandedSubItems(activeState.expandedSubs);
  }, [activeState]);

  const activeItemData = useMemo(
    () => sidebarItems.find((item) => item.id === activeItem),
    [activeItem]
  );

  const handleNavigation = useCallback((route: string) => {
    router.navigate({ to: route });
  }, [router]);

  const handleItemClick = useCallback((item: SidebarItem) => {
    if (item.hasSubItems) {
      setActiveItem((prev) => (prev === item.id ? null : item.id));
      setExpandedSubItems((prev) => (prev.size > 0 ? new Set() : prev));
    } else if (item.route) {
      setActiveItem(null);
      setExpandedSubItems(new Set());
      handleNavigation(item.route);
    }
  }, [handleNavigation]);

  const handleSubItemClick = useCallback((subItem: SidebarItem) => {
    if (subItem.hasSubItems) {
      setExpandedSubItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(subItem.id)) {
          newSet.delete(subItem.id);
        } else {
          newSet.add(subItem.id);
        }
        return newSet;
      });
    } else if (subItem.route) {
      handleNavigation(subItem.route);
    }
  }, [handleNavigation]);

  const handleNestedItemClick = useCallback((route: string) => {
    handleNavigation(route);
  }, [handleNavigation]);

  const groupedSubItems = useMemo(() => {
    if (!activeItemData?.subItems) {
      return {};
    }
    const grouped: Record<string, SidebarItem[]> = {};
    for (const item of activeItemData.subItems) {
      const group = item.groupLabel || "";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(item);
    }
    return grouped;
  }, [activeItemData?.subItems]);

  return (
    <div className="mt-15 flex h-[calc(100vh-4rem)] font-satoshi-medium" suppressHydrationWarning>
      {/* Main Sidebar */}
      <div
        className={cn(
          "relative ml-1 shrink-0 overflow-hidden border-r bg-sidebar-primary-foreground pt-1 transition-all duration-300 ease-in-out",
          isHovered ? "w-50" : "w-14"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="navigation"
      >
        <Sidebar
          className="h-full w-full border-0 bg-sidebar-primary-foreground"
          collapsible="none"
          side="left"
          variant="sidebar"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => {
                    const Icon = item.icon ? getIcon(item.icon) : getIcon("IconCommand");
                    const isActive = activeItem === item.id;
                    const hasActiveChild = item.subItems?.some(subItem =>
                      subItem.route === pathname || 
                      subItem.subItems?.some(nested => nested.route === pathname)
                    );

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          className={cn(
                            "relative h-auto w-full cursor-pointer justify-start gap-3 px-2.5 py-2 text-sidebar-foreground transition-all hover:ease-in-out",
                            (isActive || hasActiveChild) &&
                            "bg-linear-to-b! from-[#465fff]! to-[#4355CB]! text-sidebar!"
                          )}
                          isActive={isActive || !!hasActiveChild}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex w-full min-w-0 items-center gap-3">
                            <div
                              className={cn(
                                "shrink-0 transition-transform duration-200",
                                (isActive || hasActiveChild) && "scale-110"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "size-5 shrink-0 stroke-[1.5px]",
                                  (isActive || hasActiveChild) ? "" : "text-sidebar-foreground"
                                )}
                              />
                            </div>
                            <div
                              className={cn(
                                "flex min-w-0 flex-1 items-center justify-between gap-2 transition-all duration-200",
                                isHovered
                                  ? "translate-x-0 opacity-100"
                                  : "-translate-x-2.5 opacity-0"
                              )}
                            >
                              <span className="truncate whitespace-nowrap text-sm">
                                {item.label}
                              </span>
                              <div className="flex shrink-0 items-center gap-1">
                                {item.hasSubItems && (
                                  <div
                                    className={cn(
                                      "transition-transform duration-300 ease-in-out",
                                      isActive && "rotate-90"
                                    )}
                                  >
                                    <IconSquareRoundedChevronRight className="size-4 shrink-0" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Secondary Sidebar */}
      <div
        className={cn(
          "shrink-0 overflow-hidden bg-sidebar shadow-sm transition-all duration-300 ease-in-out",
          activeItem && activeItemData?.subItems
            ? "w-50 opacity-100"
            : "w-0 opacity-0"
        )}
      >
        {activeItem && activeItemData?.subItems && (
          <Sidebar
            className="h-full w-full border-0 bg-sidebar pt-1"
            collapsible="none"
            side="left"
            variant="sidebar"
          >
            <SidebarHeader className="mb-2 flex flex-row items-center justify-between border-b px-3 py-1.5 text-sidebar-foreground">
              <h3 className="font-medium text-sm capitalize transition-opacity delay-100 duration-100">
                {activeItemData.label}
              </h3>
              <button
                className="flex size-6 cursor-pointer items-center justify-center rounded-none p-0 transition-all duration-200 hover:bg-sidebar-accent"
                onClick={() => {
                  setActiveItem(null);
                  setExpandedSubItems(new Set());
                }}
                type="button"
              >
                <IconX className="size-4 shrink-0 stroke-[1.5px]" />
              </button>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto -mr-4">
              {Object.entries(groupedSubItems).map(([groupLabel, items], groupIndex) => (
                <Fragment key={groupLabel}>
                  {groupIndex > 0 && (
                    <SidebarSeparator className="mt-2 w-[30%] bg-sidebar-border" />
                  )}
                  <div
                    className="transition-all duration-300 ease-out"
                    style={{
                      opacity: 1,
                      transform: "translateY(0)",
                      transitionDelay: `${groupIndex * 50}ms`,
                    }}
                  >
                    <SidebarGroup className="p-0!">
                      {groupLabel && (
                        <SidebarGroupLabel className="-mb-1 px-3">
                          {groupLabel.replace(/_/g, " ")}
                        </SidebarGroupLabel>
                      )}
                      <SidebarGroupContent className="pr-4">
                        <SidebarMenu>
                          {items.map((subItem, itemIndex) => {
                            const isExpanded = expandedSubItems.has(subItem.id);
                            const isActiveRoute = subItem.route === pathname;
                            const hasActiveNestedRoute = subItem.hasSubItems &&
                              subItem.subItems?.some((nestedItem: SidebarItem) => nestedItem.route === pathname);
                            const isSubItemActive = isActiveRoute || hasActiveNestedRoute;

                            return (
                              <div
                                className="transition-all duration-200 ease-out"
                                key={subItem.id}
                                style={{
                                  opacity: 1,
                                  transform: "translateX(0)",
                                  transitionDelay: `${groupIndex * 50 + itemIndex * 30}ms`,
                                }}
                              >
                                <SidebarMenuItem>
                                  <div className="transition-transform duration-200">
                                    <SidebarMenuButton
                                      className={cn(
                                        "h-auto w-full cursor-pointer justify-start gap-3 px-3 py-2 text-sidebar-foreground transition-colors",
                                        isSubItemActive &&
                                        "bg-sidebar-accent! border-primary border-l-4 text-primary hover:text-primary"
                                      )}
                                      onClick={() => handleSubItemClick(subItem)}
                                    >
                                      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left">
                                        <span className="truncate font-medium text-sm">
                                          {subItem.label}
                                        </span>
                                        <div className="flex shrink-0 items-center gap-1.5">
                                          {subItem.hasSubItems && (
                                            <div
                                              className={cn(
                                                "transition-transform duration-300 ease-in-out",
                                                isExpanded && "rotate-90"
                                              )}
                                            >
                                              <IconSquareRoundedChevronRight className="h-4 w-4 shrink-0" />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </SidebarMenuButton>
                                  </div>

                                  <div
                                    className={cn(
                                      "overflow-hidden transition-all duration-300 ease-in-out",
                                      isExpanded ? "max-h-250 opacity-100" : "max-h-0 opacity-0"
                                    )}
                                  >
                                    {subItem.hasSubItems && subItem.subItems && (
                                      <SidebarMenuSub>
                                        {subItem.subItems.map((nestedItem: SidebarItem, nestedIndex: number) => {
                                          const isNestedActive = nestedItem.route === pathname;

                                          return (
                                            <div
                                              className="transition-all duration-200 ease-out"
                                              key={nestedItem.id}
                                              style={{
                                                opacity: isExpanded ? 1 : 0,
                                                transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                                                transitionDelay: `${nestedIndex * 50}ms`,
                                              }}
                                            >
                                              <SidebarMenuSubItem>
                                                <div className="transition-transform duration-200">
                                                  <SidebarMenuSubButton
                                                    className={cn(
                                                      "h-auto w-full cursor-pointer justify-start gap-3 px-2 py-2 text-sidebar-foreground transition-colors hover:bg-primary-100",
                                                      isNestedActive &&
                                                      "bg-primary-100! border-primary border-l-4 px-2 text-primary"
                                                    )}
                                                    onClick={() => {
                                                      if (nestedItem.route) {
                                                        handleNestedItemClick(nestedItem.route);
                                                      }
                                                    }}
                                                  >
                                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                                                      <span className="truncate text-sm">
                                                        {nestedItem.label}
                                                      </span>
                                                    </div>
                                                  </SidebarMenuSubButton>
                                                </div>
                                              </SidebarMenuSubItem>
                                            </div>
                                          );
                                        })}
                                      </SidebarMenuSub>
                                    )}
                                  </div>
                                </SidebarMenuItem>
                              </div>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </div>
                </Fragment>
              ))}
            </SidebarContent>
          </Sidebar>
        )}
      </div>
    </div>
  );
}
