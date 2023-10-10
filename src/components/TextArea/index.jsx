import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import './TextArea.css'

export function TextArea({ formProps, fieldProps, row, cols , maxlength, className, parentClassName, mandatory }) {
  const { control, name, label } = formProps;

  return (
    <Form.Group className={`maindiv ${parentClassName ?? ""}`}>
      <Form.Label>{label} {mandatory && <span className="red">*</span>}</Form.Label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <Form.Control className={className ?? ""} as="textarea" rows={row} cols={cols} maxlength={maxlength} {...field} {...fieldProps} isInvalid={!!error} />
            <Form.Text className="error">{error ? error.message : ""}</Form.Text>
          </>
        )}
      />
    </Form.Group>
  );
}
