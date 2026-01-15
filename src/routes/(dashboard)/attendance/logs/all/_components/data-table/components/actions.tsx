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
import type { Attendence, User } from "@/types/db";
import { useDeleteEmployee } from "@/hooks/employee/mutation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ConfirmDialog } from "@/components/shared/delete-text-confirmation";
import { useDeleteAttendance } from "@/hooks/attendance/mutation";
import { AlertModal } from "@/components/shared/alert-modal";

interface CellActionProps {
  data:Attendence;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteAttendance();


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
          toast.success("Attendance record deleted successfully.");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to delete attendance record.");
        },
      }
    );
  };

  return (
    <>
      <AlertModal
        customText="Are you sure you want to delete this attendance record? This action cannot be undone."
        customTitle="Delete Attendance Record"
        disabled={isPending}
        isOpen={open}
        loading={isPending}
        loadingText="Deleting"
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        submitButtonText="Delete"
        submitButtonIcon="IconTrash"
      />
      <DropdownMenu modal={false} >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <IconDotsVertical className="size-4 stroke-[1.5px] text-secondary-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" sideOffset={5}>
          {/* <DropdownMenuItem
            onSelect={() => handleNavigate(`${currentPath}/control/${data.id}`)}
          >
            <IconSettings className="size-4 stroke-[1.5px]" /> Manage
          </DropdownMenuItem> */}
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
