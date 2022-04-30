import type { Ref } from 'vue'
import { reactive, ref, unref } from 'vue'

import type { FormState, UseFormProps, UseFormReturn } from '../types/form'
import type { FieldValues } from '../types/filed'

import type { Field, FieldErrors } from '../types/errors'
import type { RegisterOptions } from '../types/validator'
import { deleteProperty, isHTMLElement, isString } from '../utils'
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

  const _transformRef = (ref: Ref<HTMLElement | any>) => {
    const unwrap = unref(ref)

    if (isHTMLElement(unwrap))
      return unwrap

    if (isHTMLElement(unwrap.$el))
      return unwrap.$el

    if (isHTMLElement(unwrap?.ref.value))
      return unwrap.ref.value
  }

  const validateFields = () => {
    Object.keys(fields).forEach((key) => {
      const filed = fields[key]
      ;(Object.keys(filed.rule) as (keyof RegisterOptions)[]).forEach((ruleKey) => {
        const validateRes = validateField(filed.rule[ruleKey])
      })
    })
  }

  const onChange = (evt?: Event) => {
    formState.isDirty = true
  }

  const register = (name: keyof TFieldValues, options: RegisterOptions) => {
    if (options.defaultValue) {
      fields[name].value = options.defaultValue
      deleteProperty(options, 'defaultValue')
    }

    const modelVal = ref(fields[name]?.value || '')
    const elRef = ref<HTMLElement | null>(null)

    function assignBindAttrs(el: HTMLElement, value: any) {
      elRef.value = el
      modelVal.value = value
    }

    return {
      ref: elRef,
      modelValue: modelVal.value,
      onBlur: onChange,
      [onModelValueUpdate]: (newValue: TFieldValues[keyof TFieldValues]) => {
        fields[name] = {
          value: newValue,
          rule: { ...options },
        }
        assignBindAttrs(_transformRef(elRef), modelVal)
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
