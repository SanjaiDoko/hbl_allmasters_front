import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import './Input.css'

export function FormInput({ formProps, fieldProps, className, type, maxLength, size, divClassName, autofocus, mandatory, disabled , placeholder }) {
  const { control, name, label } = formProps;

  return (
    <Form.Group className={divClassName ?? ""}>
      {label && <Form.Label>{label} {mandatory && <span className="red">*</span>}</Form.Label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <Form.Control placeholder={placeholder ?? ""} data-date-format="dd-mm-yyyy" disabled={disabled} autoFocus={autofocus ?? ""} maxLength={maxLength ?? ""} size={size ?? ""} type={type ?? "text"} className={className} {...field} {...fieldProps} isInvalid={!!error} />
            <Form.Text className="error">{error ? error.message : ""}</Form.Text>
          </>
        )}
      />
    </Form.Group>
  );
}
