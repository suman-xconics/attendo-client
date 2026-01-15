import FormContainer from "@/components/form/container";
import { FormControllerWrapper } from "@/components/form/controller-wrapper";
import Loader from "@/components/shared/loader";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  useCreateAttendanceRecord,
  useUpdateAttendanceRecord,
} from "@/hooks/attendance/mutation";
import { useAttendanceDetails } from "@/hooks/attendance/query";
import { InsertAttendenceSchema, UpdateAttendenceSchema } from "@/types/db";
import { createTypedFormIdGenerator } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface AttendanceFormProps {
  id?: string;
  editMode: boolean;
}

const AttendanceForm = ({ id, editMode }: AttendanceFormProps) => {
  const { employeeId } = useSearch({ strict: false });
  const navigate = useNavigate();
  
  const { data: attendanceDetails, isLoading: isLoadingAttendance } =
    useAttendanceDetails({ 
      id: id!,
      enabled: editMode && !!id 
    });
  
  const { mutate: createAttendance, isPending: isCreatingAttendance } =
    useCreateAttendanceRecord();
  const { mutate: updateAttendance, isPending: isUpdatingAttendance } =
    useUpdateAttendanceRecord();

  const BASE_FORM_ID = editMode
    ? `attendance-edit-form-${id}`
    : "attendance-creation-form";
  const getFieldId = createTypedFormIdGenerator<
    z.infer<typeof InsertAttendenceSchema> &
      z.infer<typeof UpdateAttendenceSchema>
  >(BASE_FORM_ID);

  const schema = useMemo(
    () => (editMode ? UpdateAttendenceSchema : InsertAttendenceSchema),
    [editMode]
  );

  const form = useForm<
    z.infer<typeof InsertAttendenceSchema> | z.infer<typeof UpdateAttendenceSchema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: "",
      entryTime: new Date(),
      exitTime: null,
    },
  });

  // Reset form with attendance details when in edit mode
  useEffect(() => {
    if (editMode && attendanceDetails) {
      form.reset({
        ...attendanceDetails,
        entryTime: new Date(attendanceDetails.entryTime),
        exitTime: attendanceDetails.exitTime
          ? new Date(attendanceDetails.exitTime)
          : null,
      });
    }
  }, [editMode, attendanceDetails, form]);

  // Set employeeId for create mode
  useEffect(() => {
    if (employeeId && !editMode) {
      form.setValue("userId", employeeId as string);
    }
  }, [employeeId, editMode, form]);

  // Reset form when switching from edit to create mode
  useEffect(() => {
    if (!editMode) {
      form.reset({
        userId: employeeId || "",
        entryTime: new Date(),
        exitTime: null,
      });
    }
  }, [editMode, employeeId, form]);

  const handleSubmit = (
    data: z.infer<typeof InsertAttendenceSchema> | z.infer<typeof UpdateAttendenceSchema>
  ) => {
    if (editMode && id) {
      updateAttendance(
        { id, data: data as z.infer<typeof UpdateAttendenceSchema> },
        {
          onSuccess: () => {
            toast.success("Attendance updated successfully");
          },
          onError: (error) => {
            toast.error(
              `Error updating attendance: ${error.message || "Update failed"}`
            );
          },
        }
      );
    } else {
      createAttendance(
        { data: data as z.infer<typeof InsertAttendenceSchema> },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Attendance record created successfully");
            navigate({ to: "/attendance/logs/all" });
          },
          onError: (error) => {
            toast.error(
              `Error creating attendance record: ${error.message || "Creation failed"}`
            );
          },
        }
      );
    }
  };

  if (isLoadingAttendance) {
    return <Loader fullHeight />;
  }

  const renderDateTimePicker = (field: any) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left font-normal justify-start h-10",
            !field.value && "text-muted-foreground"
          )}
        >
          {field.value ? (
            format(field.value, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>Pick a date & time</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row gap-2 p-3">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
            className="flex-shrink-0"
          />
          <div className="flex flex-col sm:flex-row sm:h-[320px] gap-2 min-w-[280px]">
            <ScrollArea className="w-20 sm:w-24 h-64 flex-shrink-0">
              <div className="flex flex-col p-1 gap-1">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <Button
                    key={hour}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-10 w-10 flex-shrink-0",
                      field.value?.getHours() % 12 === hour % 12 && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      const currentDate = field.value || new Date();
                      let newDate = new Date(currentDate);
                      const hourValue = hour;
                      newDate.setHours(
                        newDate.getHours() >= 12 ? hourValue + 12 - 1 : hourValue - 1
                      );
                      field.onChange(newDate);
                    }}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
            
            <ScrollArea className="w-20 sm:w-24 h-64 flex-shrink-0">
              <div className="flex flex-col p-1 gap-1">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                  <Button
                    key={minute}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-10 w-10 flex-shrink-0",
                      field.value?.getMinutes() === minute && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      const currentDate = field.value || new Date();
                      const newDate = new Date(currentDate);
                      newDate.setMinutes(minute);
                      field.onChange(newDate);
                    }}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
            
            <ScrollArea className="w-20 sm:w-24 h-64 flex-shrink-0">
              <div className="flex flex-col p-1 gap-1">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-10 w-10 flex-shrink-0",
                      field.value && 
                      ((ampm === "AM" && field.value.getHours() < 12) ||
                       (ampm === "PM" && field.value.getHours() >= 12)) && 
                      "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      const currentDate = field.value || new Date();
                      let newDate = new Date(currentDate);
                      const hours = newDate.getHours();
                      if (ampm === "AM" && hours >= 12) {
                        newDate.setHours(hours - 12);
                      } else if (ampm === "PM" && hours < 12) {
                        newDate.setHours(hours + 12);
                      }
                      field.onChange(newDate);
                    }}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <FormContainer
      editMode={editMode}
      form={form}
      formId={BASE_FORM_ID}
      id={BASE_FORM_ID}
      resetButton
      onReset={() => form.reset()}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitButton
      submitButtonLoading={isCreatingAttendance || isUpdatingAttendance}
      submitButtonLoadingText={editMode ? "Updating..." : "Creating..."}
      submitButtonText={editMode ? "Update Attendance" : "Create Attendance"}
    >
      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("userId")}
        name="userId"
        placeholder="Enter employee ID"
        label="Employee ID"
        type="input"
        disabled={!!employeeId && !editMode}
      />

      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("entryTime")}
        name="entryTime"
        label="Entry Time *"
        type="custom"
        render={renderDateTimePicker}
      />
      
      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("exitTime")}
        name="exitTime"
        label="Exit Time"
        type="custom"
        render={renderDateTimePicker}
      />
    </FormContainer>
  );
};

export default AttendanceForm;
