'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

type SafeImageProps = ImageProps & {
  fallbackSrc?: string
}

export function SafeImage({ src, alt, fallbackSrc = '/images/hero-bg.png', ...rest }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  )
}
