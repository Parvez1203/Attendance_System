
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, DollarSign, BarChart3 } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "workers", label: "Workers", icon: Users },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "salary", label: "Salary", icon: DollarSign },
  ];

  return (
    <Card className="p-2">
      <div className="flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              onClick={() => onTabChange(item.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default Navigation;
