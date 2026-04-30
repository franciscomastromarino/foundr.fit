'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Container,
  Field,
  Heading,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { INTENTS, INTERESTS } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { saveStep3 } from '../actions'
import { trackEvent } from '@/lib/analytics'
import { ProgressBar } from '../progress-bar'
import Link from 'next/link'

const schema = z.object({
  lookingFor: z
    .array(z.string())
    .min(1, 'Elegí al menos una')
    .max(2, 'Máximo 2'),
  interests: z
    .array(z.string())
    .min(1, 'Elegí al menos uno')
    .max(3, 'Máximo 3'),
  bio: z.string().max(140, 'Máximo 140 caracteres').optional(),
})

type FormData = z.infer<typeof schema>

export default function Step3Page() {
  const [submitting, setSubmitting] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { lookingFor: [], interests: [], bio: '' },
  })

  const bioLength = watch('bio')?.length || 0

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      trackEvent('onboarding_step_completed', { step: 3 })
      trackEvent('onboarding_finished')
      await saveStep3(data)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ProgressBar step={3} />
      <Container maxW="sm" py="6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="5">
            <Heading size="lg">Tu intención</Heading>

            <Field.Root invalid={!!errors.lookingFor}>
              <Field.Label>¿Qué buscás? (máx. 2)</Field.Label>
              <Controller
                name="lookingFor"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    options={INTENTS}
                    value={field.value}
                    onChange={field.onChange}
                    max={2}
                  />
                )}
              />
              {errors.lookingFor && (
                <Field.ErrorText>{errors.lookingFor.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.interests}>
              <Field.Label>Intereses (máx. 3)</Field.Label>
              <Controller
                name="interests"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    options={INTERESTS}
                    value={field.value}
                    onChange={field.onChange}
                    max={3}
                  />
                )}
              />
              {errors.interests && (
                <Field.ErrorText>{errors.interests.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.bio}>
              <Field.Label>
                Una línea sobre vos ({bioLength}/140)
              </Field.Label>
              <Textarea
                {...register('bio')}
                maxLength={140}
                placeholder="Ej: 3ra startup, salí de YC W23, busco co-founder técnico para healthtech B2B"
                rows={2}
              />
              {errors.bio && (
                <Field.ErrorText>{errors.bio.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Stack direction="row" gap="3">
              <Button asChild variant="outline" flex="1">
                <Link href="/onboarding/step-2">Atrás</Link>
              </Button>
              <Button type="submit" flex="1" loading={submitting}>
                Completar
              </Button>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  )
}
