"use client";

import { Logo } from "@/components/shared/logo";
import { UserNavDropdown } from "./header-components/user-nav-dropdown";


const HeaderFeaturesComponents = () => [
//   { name: "QuickActionDropdown", component: <QuickActionDropdown /> },
//   { name: "PingIndicator", component: <PingIndicator /> },
  { name: "UserNavDropdown", component: <UserNavDropdown /> },
];

const AppHeader = () => (
  <header className="absolute top-0 left-0 z-50 flex h-15 w-full items-center justify-between border-b bg-white pl-2">
    <Logo />

    <div className="flex h-full items-center justify-between">
      {HeaderFeaturesComponents().map(({ name, component }, index) => (
        <div
          className={`flex h-full w-auto items-center justify-center border-border border-r-[1.5px] px-3.5 transition-all ease-in hover:bg-white-600 ${index === 0 ? "border-l-[1.5px]" : ""}`}
          key={name}
        >
          {component}
        </div>
      ))}
    </div>
  </header>
);

export default AppHeader;