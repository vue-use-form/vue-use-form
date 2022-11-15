import type { FieldPathValue } from './path'
import type { FieldValues } from './filed'

export type Message = string

export interface ValidationMode {
  onBlur: 'onBlur'
  onChange: 'onChange'
  onSubmit: 'onSubmit'
  onTouched: 'onTouched'
  all: 'all'
}

export type ValidationValue = boolean | number | string | RegExp

export type ValidationRule<
  TValidationValue extends ValidationValue = ValidationValue
> = TValidationValue | ValidationValueMessage<TValidationValue>

export interface ValidationValueMessage<
  TValidationValue extends ValidationValue = ValidationValue
> {
  value: TValidationValue
  message: Message
}

export type ValidateResult = Message | Message[] | boolean | undefined

export type Validate<TFieldValue> = (
  value: TFieldValue
) => ValidateResult | Promise<ValidateResult>

export type RegisterOptions<TFieldValues extends FieldValues> = Partial<{
  required: Message | ValidationRule<boolean>
  min: ValidationRule<number | string>
  max: ValidationRule<number | string>
  maxLength: ValidationRule<number>
  minLength: ValidationRule<number>
  pattern: ValidationRule<RegExp>
  validate:
    | Validate<FieldPathValue<TFieldValues>>
    | Record<string, Validate<FieldPathValue<TFieldValues>>>
  valueAsNumber: boolean
  valueAsDate: boolean
  value: FieldPathValue<TFieldValues>
  setValueAs: (value: any) => any
  vModelBinding?: string
  disabled?: boolean
  shouldUnregister?: boolean
  onChange?: (event: any) => void
  onBlur?: (event: any) => void
}>
