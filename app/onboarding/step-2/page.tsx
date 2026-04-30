'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ROLES, INDUSTRIES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { saveStep2 } from '../actions'
import { ProgressBar } from '../progress-bar'
import Link from 'next/link'

const schema = z.object({
  role: z.enum(ROLES as unknown as [string, ...string[]], 'Elegí un rol'),
  startup: z.string().min(1, 'Requerido').max(80),
  startupUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  industries: z
    .array(z.string())
    .min(1, 'Elegí al menos una')
    .max(3, 'Máximo 3'),
})

type FormData = z.infer<typeof schema>

export default function Step2Page() {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { industries: [] },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      await saveStep2(data)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ProgressBar step={2} />
      <Container maxW="sm" py="6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="5">
            <Heading size="lg">Tu contexto profesional</Heading>

            <Field.Root invalid={!!errors.role}>
              <Field.Label>Rol</Field.Label>
              <select
                {...register('role')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--chakra-colors-border)',
                  fontSize: '16px',
                }}
              >
                <option value="">Seleccionar...</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <Field.ErrorText>{errors.role.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.startup}>
              <Field.Label>Startup / Empresa</Field.Label>
              <Input {...register('startup')} maxLength={80} />
              {errors.startup && (
                <Field.ErrorText>{errors.startup.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.startupUrl}>
              <Field.Label>Sitio web (opcional)</Field.Label>
              <Input
                {...register('startupUrl')}
                placeholder="https://miempresa.com"
                type="url"
              />
              {errors.startupUrl && (
                <Field.ErrorText>{errors.startupUrl.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.industries}>
              <Field.Label>Industria (máx. 3)</Field.Label>
              <Controller
                name="industries"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    options={INDUSTRIES}
                    value={field.value}
                    onChange={field.onChange}
                    max={3}
                  />
                )}
              />
              {errors.industries && (
                <Field.ErrorText>{errors.industries.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Stack direction="row" gap="3">
              <Button asChild variant="outline" flex="1">
                <Link href="/onboarding/step-1">Atrás</Link>
              </Button>
              <Button type="submit" flex="1" loading={submitting}>
                Siguiente
              </Button>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  )
}
