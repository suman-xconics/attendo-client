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
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
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
  id: string;
  editMode: boolean;
}

const AttendanceForm = ({ id, editMode }: AttendanceFormProps) => {
  const navigate = useNavigate();
  const { data: attendanceDetails, isLoading: isLoadingAttendance } =
    useAttendanceDetails({ id });
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

  const schema = editMode ? UpdateAttendenceSchema : InsertAttendenceSchema;

  const form = useForm<
    | z.infer<typeof InsertAttendenceSchema>
    | z.infer<typeof UpdateAttendenceSchema>
  >({
    resolver: zodResolver(schema as any),
    defaultValues: {
      userId: "",
      entryTime: new Date(),
      exitTime: null,
    },
  });

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

  useEffect(() => {
    if (!editMode) {
      form.reset();
    }
  }, [editMode, form]);

  const handleReset = useRef(() => {
    form.reset();
  });

  const handleSubmit = (
    data:
      | z.infer<typeof InsertAttendenceSchema>
      | z.infer<typeof UpdateAttendenceSchema>
  ) => {
    if (editMode && id) {
      updateAttendance(
        { id, data: data as z.infer<typeof UpdateAttendenceSchema> },
        {
          onSuccess: () => {
            form.reset(undefined, { keepValues: true });
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
            handleReset.current();
            toast.success("Attendance record created successfully");
            navigate({ to: `/attendance/logs/all` });
          },
          onError: (error) => {
            toast.error(
              `Error creating attendance record: ${
                error.message || "Creation failed"
              }`
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
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal justify-start",
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
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        field.value && field.value.getHours() % 12 === hour % 12
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => {
                        const currentDate = field.value || new Date();
                        let newDate = new Date(currentDate);
                        const hourValue = parseInt(hour.toString(), 10);
                        newDate.setHours(
                          newDate.getHours() >= 12 ? hourValue + 12 : hourValue
                        );
                        field.onChange(newDate);
                      }}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      field.value && field.value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => {
                      const currentDate = field.value || new Date();
                      const newDate = new Date(currentDate);
                      newDate.setMinutes(parseInt(minute.toString(), 10));
                      field.onChange(newDate);
                    }}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      field.value &&
                      ((ampm === "AM" && field.value.getHours() < 12) ||
                        (ampm === "PM" && field.value.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
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
      onReset={() => handleReset.current()}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitButton
      submitButtonLoading={isCreatingAttendance || isUpdatingAttendance}
      submitButtonLoadingText={editMode ? "Updating" : "Adding"}
      submitButtonText={editMode ? "Update" : "Add"}
    >
      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("userId")}
        name="userId"
        placeholder="Employee ID"
        label="Employee ID"
        type="input"
      />

      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("entryTime")}
        name="entryTime"
        type="custom"
        render={renderDateTimePicker}
      />
      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("exitTime")}
        name="exitTime"
        type="custom"
        render={renderDateTimePicker}
      />
    </FormContainer>
  );
};

export default AttendanceForm;
