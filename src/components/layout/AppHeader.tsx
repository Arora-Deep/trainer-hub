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
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-border/40 px-6"
      style={{
        background: "hsl(var(--background) / 0.7)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          type="search"
          placeholder="Search anything..."
          className="pl-9 pr-14 h-9 bg-muted/40 border-border/50 rounded-xl text-sm placeholder:text-muted-foreground/50 focus:bg-card focus:border-primary/30 transition-all duration-200"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50">
          <Command className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[10px] text-muted-foreground/60 font-medium">K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground/70 hover:text-foreground rounded-xl"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 text-muted-foreground/70 hover:text-foreground rounded-xl"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl">
            <DropdownMenuLabel className="flex items-center justify-between text-sm">
              <span className="font-semibold">Notifications</span>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-5 rounded-full font-semibold">
                3 new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-3 cursor-pointer rounded-lg">
              <span className="text-sm font-medium">Lab Error Alert</span>
              <span className="text-xs text-muted-foreground">Lab VM offline for student Carol Davis</span>
              <span className="text-[10px] text-muted-foreground/60">5 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-3 cursor-pointer rounded-lg">
              <span className="text-sm font-medium">High Resource Usage</span>
              <span className="text-xs text-muted-foreground">AWS batch exceeding CPU threshold</span>
              <span className="text-[10px] text-muted-foreground/60">12 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer font-medium rounded-lg">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border/50 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="gap-2.5 pl-2 pr-3 h-9 ml-1 rounded-xl"
            >
              <Avatar className="h-7 w-7 ring-2 ring-border/50">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback className="bg-coral/10 text-coral text-xs font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">John Doe</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm rounded-lg">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm rounded-lg">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer text-sm rounded-lg">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
