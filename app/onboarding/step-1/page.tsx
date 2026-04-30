'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { saveStep1 } from '../actions'
import { trackEvent } from '@/lib/analytics'
import { ProgressBar } from '../progress-bar'

const schema = z.object({
  fullName: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  whatsappE164: z.string().refine(isValidPhoneNumber, 'Número inválido'),
  avatarUrl: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function Step1Page() {
  const { data: session } = useSession()
  const [phone, setPhone] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setValue('fullName', session.user.name)
      if (session.user.image) setValue('avatarUrl', session.user.image)
    }
  }, [session, setValue])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      trackEvent('onboarding_step_completed', { step: 1 })
      await saveStep1({
        fullName: data.fullName,
        whatsappE164: phone,
        avatarUrl: data.avatarUrl || '',
      })
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ProgressBar step={1} />
      <Container maxW="sm" py="6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="5">
            <Heading size="lg">Tu identidad</Heading>

            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Avatar"
                boxSize="80px"
                borderRadius="full"
                alignSelf="center"
              />
            )}

            <Field.Root invalid={!!errors.fullName}>
              <Field.Label>Nombre y apellido</Field.Label>
              <Input {...register('fullName')} />
              {errors.fullName && (
                <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.whatsappE164}>
              <Field.Label>WhatsApp</Field.Label>
              <PhoneInput
                defaultCountry="AR"
                value={phone}
                onChange={(val) => {
                  setPhone(val || '')
                  setValue('whatsappE164', val || '', {
                    shouldValidate: true,
                  })
                }}
                international
                countryCallingCodeEditable={false}
                className="phone-input"
              />
              {errors.whatsappE164 && (
                <Field.ErrorText>{errors.whatsappE164.message}</Field.ErrorText>
              )}
              <Text fontSize="xs" color="fg.muted">
                Solo visible cuando alguien te quiera contactar
              </Text>
            </Field.Root>

            <Button type="submit" size="lg" loading={submitting}>
              Siguiente
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  )
}
