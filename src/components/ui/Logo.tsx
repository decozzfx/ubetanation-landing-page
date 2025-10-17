import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  variant?: 'default' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export function Logo({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  showText = true 
}: LogoProps) {
  const sizeMap = {
    sm: { width: 120, height: 36 },
    md: { width: 160, height: 48 },
    lg: { width: 200, height: 60 }
  }

  const logoSrc = variant === 'light' ? '/logo-light.svg' : '/logo.svg'
  const dimensions = sizeMap[size]

  if (!showText) {
    // Icon only version
    const iconSize = {
      sm: 32,
      md: 44,
      lg: 60
    }

    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        <div 
          className="rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold"
          style={{
            width: iconSize[size],
            height: iconSize[size],
            fontSize: size === 'sm' ? '14px' : size === 'md' ? '18px' : '24px'
          }}
        >
          U
        </div>
      </Link>
    )
  }

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="Ubetanation"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="h-auto"
      />
    </Link>
  )
}