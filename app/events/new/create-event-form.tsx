'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Field,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { INDUSTRIES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { createEvent } from '../actions'
import { trackEvent } from '@/lib/analytics'

const normalizeUrl = (val: string) => {
  if (!val) return val
  if (!/^https?:\/\//i.test(val)) return `https://${val}`
  return val
}

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(120),
  description: z.string().max(500).optional(),
  date: z.string().min(1, 'Elegí una fecha'),
  location: z.string().max(120).optional(),
  url: z.string().optional(),
  industries: z.array(z.string()).min(1, 'Elegí al menos una industria').max(3),
})

type FormData = z.infer<typeof schema>

export function CreateEventForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      url: '',
      industries: [],
    },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const result = await createEvent({
        title: data.title,
        description: data.description || undefined,
        date: new Date(data.date),
        location: data.location || undefined,
        url: data.url ? normalizeUrl(data.url) : undefined,
        industries: data.industries,
      })
      trackEvent('event_created', { event_id: result.id })
      router.push(`/events/${result.id}`)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="5">
        <Field.Root invalid={!!errors.title}>
          <Field.Label>Nombre del evento</Field.Label>
          <Input
            {...register('title')}
            placeholder="ej: Demo Day Fintech BA"
            bg="surface.elevated"
            borderColor="transparent"
            borderRadius="xl"
            _focus={{ borderColor: 'brand.400', bg: 'white' }}
          />
          {errors.title && <Field.ErrorText>{errors.title.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.description}>
          <Field.Label>Descripción (opcional)</Field.Label>
          <Textarea
            {...register('description')}
            placeholder="De qué se trata el evento..."
            rows={3}
            bg="surface.elevated"
            borderColor="transparent"
            borderRadius="xl"
            _focus={{ borderColor: 'brand.400', bg: 'white' }}
          />
          {errors.description && <Field.ErrorText>{errors.description.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.date}>
          <Field.Label>Fecha y hora</Field.Label>
          <Input
            type="datetime-local"
            {...register('date')}
            bg="surface.elevated"
            borderColor="transparent"
            borderRadius="xl"
            _focus={{ borderColor: 'brand.400', bg: 'white' }}
          />
          {errors.date && <Field.ErrorText>{errors.date.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Ubicación (opcional)</Field.Label>
          <Input
            {...register('location')}
            placeholder="ej: Buenos Aires, Argentina / Virtual"
            bg="surface.elevated"
            borderColor="transparent"
            borderRadius="xl"
            _focus={{ borderColor: 'brand.400', bg: 'white' }}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Link del evento (opcional)</Field.Label>
          <Input
            {...register('url')}
            placeholder="ej: meetup.com/..."
            bg="surface.elevated"
            borderColor="transparent"
            borderRadius="xl"
            _focus={{ borderColor: 'brand.400', bg: 'white' }}
          />
        </Field.Root>

        <Field.Root invalid={!!errors.industries}>
          <Field.Label>Industrias relacionadas (hasta 3)</Field.Label>
          <Controller
            name="industries"
            control={control}
            render={({ field }) => (
              <ChipSelect
                options={INDUSTRIES}
                value={field.value}
                onChange={field.onChange}
                max={3}
                colorScheme="green"
              />
            )}
          />
          {errors.industries && <Field.ErrorText>{errors.industries.message}</Field.ErrorText>}
        </Field.Root>

        <Button
          type="submit"
          colorPalette="brand"
          size="lg"
          borderRadius="full"
          loading={submitting}
          w="full"
        >
          Crear evento
        </Button>
      </Stack>
    </form>
  )
}
