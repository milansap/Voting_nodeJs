import * as React from "react"
import { Controller, FieldPath, FieldValues, FormProvider as RHFProvider, useFormContext } from "react-hook-form"

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={className} {...props} />
))
Form.displayName = "Form"

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    name: fieldContext.name,
    formItemId: itemContext?.formItemId,
    formDescriptionId: itemContext?.formDescriptionId,
    formMessageId: itemContext?.formMessageId,
    fieldState,
  }
}

type FormItemContextValue = {
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  render,
}: {
  control: any
  name: TName
  render: (props: {
    field: any
    fieldState: any
  }) => React.ReactElement
}) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          render({ field, fieldState })
        }
      />
    </FormFieldContext.Provider>
  )
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = React.forwardRef<
  HTMLDivElement,
  FormItemProps
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider
      value={{
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
      }}
    >
      <div ref={ref} className="space-y-2" {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { formItemId } = useFormField()

    return (
      <label
        ref={ref}
        htmlFor={formItemId}
        className={`text-sm font-medium text-[#111827] dark:text-[#F3F4F6] ${className || ""}`}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ ...props }, ref) => {
    const { formItemId } = useFormField()

    return (
      <div ref={ref} data-form-item-id={formItemId} {...props} />
    )
  }
)
FormControl.displayName = "FormControl"

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { fieldState, formMessageId } = useFormField()
    const body = fieldState?.error ? String(fieldState.error?.message) : children

    if (!body) {
      return null
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={`text-sm font-medium text-[#DC2626] dark:text-[#FCA5A5] ${className || ""}`}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export {
  Form,
  RHFProvider as FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
}
