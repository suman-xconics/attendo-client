import FormContainer from "@/components/form/container";
import { FormControllerWrapper } from "@/components/form/controller-wrapper";
import Loader from "@/components/shared/loader";
import { PhoneInput } from "@/components/ui/phone-input";
import { useCreateEmployee, useCreateEmployeeHR, useUpdateEmployee } from "@/hooks/employee/mutation";
import { useEmployeeDetails } from "@/hooks/employee/query";
import { InsertUserSchema, UpdateUserSchema } from "@/types/db";
import { createTypedFormIdGenerator } from "@/utils/form";
import { generateStrongPassword } from "@/utils/generator/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface EmployeeFormProps {
  id: string;
  editMode: boolean;
}

const EmployeeForm = ({ id, editMode }: EmployeeFormProps) => {
  const navigate = useNavigate();

  const { data: employeeDetails, isLoading: isLoadingEmployee
  } = useEmployeeDetails({ id }, { enabled: editMode && id !== "new" });
  const {
    mutate: createEmployee,
    isPending: isCreatingEmployee,
  } = useCreateEmployeeHR();

  const {
    mutate: updateEmployee,
    isPending: isUpdatingEmployee,
  } = useUpdateEmployee();
  const BASE_FORM_ID = editMode
    ? `employee-edit-form-${id}`
    : "employee-creation-form";


  const getFieldId = createTypedFormIdGenerator<
    z.infer<typeof InsertUserSchema> & z.infer<typeof UpdateUserSchema>
  >(BASE_FORM_ID);

  const schema = editMode ? UpdateUserSchema : InsertUserSchema;


  const form = useForm<z.infer<typeof InsertUserSchema> | z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      macAddress: "",
    },
  });

  useEffect(() => {
    if (editMode && employeeDetails) {
      form.reset({
        name: employeeDetails.name,
        email: employeeDetails.email,
        phoneNumber: employeeDetails.phoneNumber,
        macAddress: employeeDetails.macAddress,
      });
    }
  }, [editMode, employeeDetails, form]);

  useEffect(() => {
    form.reset();
  }, [editMode, form]);

  const handleReset = useRef(() => {
    form.reset();
  });

  const handleSubmit = (data: z.infer<typeof InsertUserSchema> | z.infer<typeof UpdateUserSchema>) => {
    if (editMode && id) {
      updateEmployee({ id, data: data as z.infer<typeof UpdateUserSchema> }, {
        onSuccess: () => {
          form.reset(undefined, { keepValues: true });
          toast.success("Employee updated successfully");
        },
        onError: (error) => {
          toast.error(`Error updating employee: ${error.message || 'Update failed'}`);
        }
      });
    } else {
      createEmployee({ data: data as z.infer<typeof InsertUserSchema> }, {
        onSuccess: () => {
          handleReset.current();
          toast.success("Employee created successfully");
          navigate({ to: `/employee/overview/all` });
        },
        onError: (error) => {
          toast.error(`Error creating employee: ${error.message || 'Creation failed'}`);
        }
      });
    }
  };

  if (isLoadingEmployee) {
    return (
      <Loader fullHeight />
    )
  }

  return (
    <FormContainer
      editMode={editMode}
      form={form}
      formId={BASE_FORM_ID}
      id={BASE_FORM_ID}
      resetButton
      onReset={() => handleReset.current()}
      onSubmit={form.handleSubmit(handleSubmit)} // Fixed: Use proper handler
      submitButton
      submitButtonLoading={isCreatingEmployee || isUpdatingEmployee}
      submitButtonLoadingText={editMode ? "Updating" : "Creating"}
      submitButtonText={editMode ? "Update" : "Create"}
    >
      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("name")}
        name="name"
        placeholder="John Doe"
        type="input"
      />

      <FormControllerWrapper
        control={form.control}
        disabled={editMode}
        fieldId={getFieldId("email")}
        inputType="email"
        name="email"
        placeholder="john.doe@example.com"
        type="input"
      />

      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("phoneNumber")}
        name="phoneNumber"
        label="Phone Number"
        type="custom"
        render={({ value, onChange, onBlur }) => (
          <PhoneInput
            value={value as string}
            onChange={onChange}
            onBlur={onBlur}
            fixedCountry="IN"
            placeholder="Phone Number"
          />
        )}
      />

      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("password")}
        hideField={editMode}
        isGroupButton
        name="password"
        onButtonClick={() => {
          const password = generateStrongPassword(8);
          form.setValue("password", password);
        }}
        placeholder="Enter a secure password"
        type="input"
      />

      <FormControllerWrapper
        control={form.control}
        fieldId={getFieldId("macAddress")}
        name="macAddress"
        placeholder="00:1B:44:11:3A:B7"
        type="input"
      />
    </FormContainer>
  );
};

export default EmployeeForm;
