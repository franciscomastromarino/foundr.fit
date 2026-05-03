'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  HStack,
  Input,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { ROLES, INDUSTRIES, INTENTS, INTERESTS, TEAM_SIZES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { updateProfile, deleteAccount } from './actions'
import type { Profile } from '@prisma/client'
import { LogOut, Trash2 } from 'lucide-react'

const schema = z.object({
  fullName: z.string().min(2).max(80),
  whatsappE164: z.string().refine(isValidPhoneNumber, 'Número inválido'),
  avatarUrl: z.string().optional(),
  role: z.enum(ROLES as unknown as [string, ...string[]]),
  startup: z.string().min(1).max(80),
  startupUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  teamSize: z.string().optional(),
  industries: z.array(z.string()).min(1).max(3),
  lookingFor: z.array(z.string()).min(1).max(2),
  interests: z.array(z.string()).min(1).max(3),
  bio: z.string().max(280).optional(),
  city: z.string().max(80).optional(),
  linkedinUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  visible: z.boolean(),
})

type FormData = z.infer<typeof schema>

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  fontSize: '16px',
  backgroundColor: '#1A1D35',
  color: 'white',
  appearance: 'none' as const,
}

export function SettingsForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [phone, setPhone] = useState(profile.whatsappE164)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      whatsappE164: profile.whatsappE164,
      avatarUrl: profile.avatarUrl ?? '',
      role: profile.role as FormData['role'],
      startup: profile.startup,
      startupUrl: profile.startupUrl ?? '',
      teamSize: profile.teamSize ?? '',
      industries: profile.industries,
      lookingFor: profile.lookingFor,
      interests: profile.interests,
      bio: profile.bio ?? '',
      city: profile.city ?? '',
      linkedinUrl: profile.linkedinUrl ?? '',
      visible: profile.visible,
    },
  })

  const bioLength = watch('bio')?.length || 0

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setSaved(false)
    await updateProfile(data)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = async () => {
    await deleteAccount()
  }

  return (
    <Container maxW="sm" py="6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="5">
          <Heading size="xl">Ajustes</Heading>

          <Box bg="surface.card" borderRadius="xl" p="5" borderWidth="1px" borderColor="surface.border">
            <Stack gap="4">
              <Field.Root invalid={!!errors.fullName}>
                <Field.Label color="fg.muted" fontSize="sm">Nombre y apellido</Field.Label>
                <Input {...register('fullName')} bg="surface.input" borderColor="surface.border" />
                {errors.fullName && <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.whatsappE164}>
                <Field.Label color="fg.muted" fontSize="sm">WhatsApp</Field.Label>
                <PhoneInput
                  defaultCountry="AR"
                  value={phone}
                  onChange={(val) => {
                    setPhone(val || '')
                    setValue('whatsappE164', val || '', { shouldValidate: true })
                  }}
                  international
                  countryCallingCodeEditable={false}
                  className="phone-input"
                />
                {errors.whatsappE164 && <Field.ErrorText>{errors.whatsappE164.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.role}>
                <Field.Label color="fg.muted" fontSize="sm">Rol</Field.Label>
                <select {...register('role')} style={selectStyle}>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </Field.Root>

              <Field.Root invalid={!!errors.startup}>
                <Field.Label color="fg.muted" fontSize="sm">Startup / Empresa</Field.Label>
                <Input {...register('startup')} maxLength={80} bg="surface.input" borderColor="surface.border" />
              </Field.Root>

              <Field.Root invalid={!!errors.startupUrl}>
                <Field.Label color="fg.muted" fontSize="sm">Sitio web (opcional)</Field.Label>
                <Input {...register('startupUrl')} placeholder="https://miempresa.com" type="url" bg="surface.input" borderColor="surface.border" _placeholder={{ color: 'fg.subtle' }} />
                {errors.startupUrl && <Field.ErrorText>{errors.startupUrl.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root>
                <Field.Label color="fg.muted" fontSize="sm">Tamaño del equipo</Field.Label>
                <select {...register('teamSize')} style={selectStyle}>
                  <option value="">Seleccionar...</option>
                  {TEAM_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} {size === 'Solo founder' ? '' : 'personas'}
                    </option>
                  ))}
                </select>
              </Field.Root>
            </Stack>
          </Box>

          <Box bg="surface.card" borderRadius="xl" p="5" borderWidth="1px" borderColor="surface.border">
            <Stack gap="4">
              <Field.Root>
                <Field.Label color="fg.muted" fontSize="sm">Industria (máx. 3)</Field.Label>
                <Controller
                  name="industries"
                  control={control}
                  render={({ field }) => (
                    <ChipSelect options={INDUSTRIES} value={field.value} onChange={field.onChange} max={3} />
                  )}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label color="fg.muted" fontSize="sm">¿Qué buscás? (máx. 2)</Field.Label>
                <Controller
                  name="lookingFor"
                  control={control}
                  render={({ field }) => (
                    <ChipSelect options={INTENTS} value={field.value} onChange={field.onChange} max={2} />
                  )}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label color="fg.muted" fontSize="sm">Intereses (máx. 3)</Field.Label>
                <Controller
                  name="interests"
                  control={control}
                  render={({ field }) => (
                    <ChipSelect options={INTERESTS} value={field.value} onChange={field.onChange} max={3} />
                  )}
                />
              </Field.Root>
            </Stack>
          </Box>

          <Box bg="surface.card" borderRadius="xl" p="5" borderWidth="1px" borderColor="surface.border">
            <Stack gap="4">
              <Field.Root>
                <Field.Label color="fg.muted" fontSize="sm">Bio ({bioLength}/280)</Field.Label>
                <Textarea {...register('bio')} maxLength={280} rows={3} bg="surface.input" borderColor="surface.border" />
              </Field.Root>

              <Field.Root>
                <Field.Label color="fg.muted" fontSize="sm">Ciudad</Field.Label>
                <Input {...register('city')} maxLength={80} bg="surface.input" borderColor="surface.border" />
              </Field.Root>

              <Field.Root invalid={!!errors.linkedinUrl}>
                <Field.Label color="fg.muted" fontSize="sm">LinkedIn URL</Field.Label>
                <Input {...register('linkedinUrl')} placeholder="https://linkedin.com/in/..." type="url" bg="surface.input" borderColor="surface.border" _placeholder={{ color: 'fg.subtle' }} />
                {errors.linkedinUrl && <Field.ErrorText>{errors.linkedinUrl.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root>
                <HStack justify="space-between">
                  <Field.Label mb="0" color="fg.muted" fontSize="sm">Visible para otros miembros</Field.Label>
                  <Controller
                    name="visible"
                    control={control}
                    render={({ field }) => (
                      <Switch.Root
                        checked={field.value}
                        onCheckedChange={({ checked }) => field.onChange(checked)}
                        colorPalette="brand"
                      >
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Root>
                    )}
                  />
                </HStack>
              </Field.Root>
            </Stack>
          </Box>

          <Button type="submit" size="lg" colorPalette="brand" loading={saving}>
            {saved ? 'Guardado' : 'Guardar cambios'}
          </Button>

          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut size={16} />
            Cerrar sesión
          </Button>

          {!showDelete ? (
            <Button
              variant="ghost"
              colorPalette="red"
              size="sm"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 size={14} />
              Eliminar mi cuenta
            </Button>
          ) : (
            <Box p="4" bg="surface.card" borderWidth="1px" borderColor="red.800" borderRadius="xl">
              <Text fontSize="sm" color="red.400" mb="3">
                Esta acción es irreversible. Se eliminará tu cuenta y todos tus datos.
              </Text>
              <Stack direction="row" gap="2">
                <Button
                  colorPalette="red"
                  size="sm"
                  flex="1"
                  onClick={handleDelete}
                >
                  Confirmar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  flex="1"
                  onClick={() => setShowDelete(false)}
                >
                  Cancelar
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </form>
    </Container>
  )
}
