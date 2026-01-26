import { Search, Bell, Sun, Moon, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function AppHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-border/50 px-6 glass-strong">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          type="search"
          placeholder="Search batches, courses, labs..."
          className="pl-11 pr-16 h-11 bg-muted/40 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background placeholder:text-muted-foreground/50 text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 border border-border/50">
          <Command className="h-3 w-3 text-muted-foreground/70" />
          <span className="text-[11px] text-muted-foreground/70 font-medium">K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass-card-static p-0 border-border/50">
            <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <span className="font-semibold">Notifications</span>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full">
                3 new
              </Badge>
            </DropdownMenuLabel>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="font-medium text-sm">Lab Error Alert</span>
                </div>
                <span className="text-xs text-muted-foreground pl-4">
                  Lab VM offline for student Carol Davis
                </span>
                <span className="text-[10px] text-muted-foreground/70 pl-4">5 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <span className="font-medium text-sm">High Resource Usage</span>
                </div>
                <span className="text-xs text-muted-foreground pl-4">
                  AWS batch exceeding CPU threshold
                </span>
                <span className="text-[10px] text-muted-foreground/70 pl-4">12 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-info" />
                  <span className="font-medium text-sm">New Support Ticket</span>
                </div>
                <span className="text-xs text-muted-foreground pl-4">
                  Mike Chen submitted a ticket
                </span>
                <span className="text-[10px] text-muted-foreground/70 pl-4">25 min ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <Button variant="ghost" className="w-full h-9 text-sm text-primary font-medium hover:bg-primary/5">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="gap-3 pl-2 pr-3 h-11 ml-1 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border/50"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <span className="text-sm font-semibold block leading-tight">John Doe</span>
                <span className="text-[11px] text-muted-foreground">Senior Trainer</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card-static border-border/50">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Keyboard Shortcuts</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Help & Documentation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
