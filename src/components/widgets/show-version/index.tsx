import VERSION from '@/lib/version'
import { useIntlayer } from 'next-intlayer/server'
import { VersionBadge } from './version-badge'
import './show-version.css'

export function ShowVersion() {
  const content = useIntlayer('show-version')

  return <VersionBadge label={content.label} version={VERSION} />
}
