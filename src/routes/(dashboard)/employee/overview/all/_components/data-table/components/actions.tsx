"use client";

import { IconDotsVertical, IconEdit, IconSettings, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/db";
import { useDeleteEmployee } from "@/hooks/employee/mutation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ConfirmDialog } from "@/components/shared/delete-text-confirmation";

interface CellActionProps {
  data:User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteEmployee();


  const handleNavigate = (path: string) => {
    setTimeout(() => {
      navigate({ to: path });
    }, 150);
  };

  const onConfirm = () => {
    mutate(
      {
        id: data.id,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Employee deleted successfully.");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to delete employee.");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog
        actionLabel="Delete"
        actionLabelLoading="Deleting"
        confirmText="delete employee"
        description={`This action cannot be undone. This will permanently delete the employee and all associated data.`}
        inputLabel="delete employee"
        loading={isPending}
        onConfirm={onConfirm}
        onOpenChange={setOpen}
        open={open}
        title="Delete Employee"
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <IconDotsVertical className="size-4 stroke-[1.5px] text-secondary-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={5} className="w-[150px]">
          <DropdownMenuItem
            onSelect={() => handleNavigate(`/attendance/action/new?employeeId=${data.id}`)}
          >
            <IconSettings className="size-4 stroke-[1.5px]" /> Add Attendance 
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleNavigate(`/employee/action/${data.id}`)}
          >
            <IconEdit className="size-4 stroke-[1.5px]" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            <IconTrash className="size-4 stroke-[1.5px]" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
