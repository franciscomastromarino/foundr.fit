'use client'

import { Wrap, Tag } from '@chakra-ui/react'

interface Props {
  options: readonly string[]
  value: string[]
  onChange: (next: string[]) => void
  max: number
}

export function ChipSelect({ options, value, onChange, max }: Props) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt))
    } else if (value.length < max) {
      onChange([...value, opt])
    }
  }

  return (
    <Wrap gap="2">
      {options.map((opt) => {
        const selected = value.includes(opt)
        return (
          <Tag.Root
            key={opt}
            size="lg"
            variant={selected ? 'solid' : 'outline'}
            colorPalette="blue"
            cursor="pointer"
            onClick={() => toggle(opt)}
          >
            <Tag.Label>{opt}</Tag.Label>
          </Tag.Root>
        )
      })}
    </Wrap>
  )
}
