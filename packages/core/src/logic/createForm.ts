import type { Ref } from 'vue'
import { reactive, ref, unref } from 'vue'
import type { FormState, UseFormProps, UseFormReturn } from '../types/form'
import type { FieldElement, FieldValues } from '../types/filed'

import type { Field, FieldErrors } from '../types/errors'
import type { RegisterOptions } from '../types/validator'
import { deleteProperty, isHTMLElement, isString } from '../utils/index'
import { validateField } from './validate'

const onModelValueUpdate = 'onUpdate:modelValue'

export function createForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  >(
  props: UseFormProps<TFieldValues, TContext> = {},
) {
  const fields = {} as Record<keyof TFieldValues, Field>

  const formState = reactive<FormState<TFieldValues>>({
    isDirty: false,
    isValidating: false,
    // dirtyFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
    isSubmitted: false,
    submitCount: 0,
    // touchedFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    errors: {} as FieldErrors<TFieldValues>,
  })

  const _transformRef = (ref: Ref<FieldElement | any>) => {
    const unwrap = unref(ref)
    let el
    if (isHTMLElement(unwrap))
      el = unwrap

    else if (isHTMLElement(unwrap.$el))
      el = unwrap.$el

    else if (isHTMLElement(unwrap.ref.value))
      el = unwrap.ref.value

    if ((el as FieldElement).tagName === 'input' || (el as FieldElement).tagName === 'select' || (el as FieldElement).tagName === 'textarea')
      return el

    return el.querySelectorAll('input, select, textarea')[0]
  }

  const validateFields = () => {
    Object.keys(fields).forEach((key) => {
      const validateRes = validateField(fields[key])
    })
  }

  const onChange = (evt?: Event) => {
    formState.isDirty = true

    if (props.mode === 'onChange')
      validateFields()
  }

  const register = (name: keyof TFieldValues, options: RegisterOptions) => {
    if (options.defaultValue) {
      fields[name].inputValue = options.defaultValue
      deleteProperty(options, 'defaultValue')
    }

    const modelVal = ref(fields[name]?.inputValue || '')
    const elRef = ref<FieldElement | null>(null)

    function assignBindAttrs(el: FieldElement, value: any, newValue?: any) {
      elRef.value = el
      modelVal.value = value
      fields[name] = {
        inputValue: newValue,
        rule: { ...options },
        ref: elRef.value!,
      }
    }

    return {
      ref: elRef,
      modelValue: modelVal.value,
      onBlur: onChange,
      [onModelValueUpdate]: (newValue: TFieldValues[keyof TFieldValues]) => {
        assignBindAttrs(_transformRef(elRef), modelVal, newValue)
        onChange()
      },
      onInput(evt: InputEvent) {
        if (isString(evt))
          return
        assignBindAttrs(_transformRef(elRef), (evt.target as HTMLInputElement).value)
      },
    }
  }
  return {
    register,
    formState,
  }
}
