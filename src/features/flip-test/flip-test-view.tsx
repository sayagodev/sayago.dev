'use client'

import { themes } from '@/lib/constants'
import { FlipPicker } from './flip-picker'
import './flip-test-view.css'

export function FlipTestView() {
  return (
    <div className="flip-test">
      <div className="flip-test__block">
        <p className="flip-test__label">Vertical (desktop)</p>
        <FlipPicker themes={themes} orientation="vertical" />
      </div>
      <div className="flip-test__block">
        <p className="flip-test__label">Horizontal (mobile)</p>
        <FlipPicker themes={themes} orientation="horizontal" />
      </div>
    </div>
  )
}
