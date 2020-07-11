import React from 'react'
import {parseISO, format} from 'date-fns'
import styled from 'styled-components'

const Time = styled.time`
  font-size: small;
  color: #333;
  text-align: right;
`

export function DateElement({dateString, ...rest}) {
  const date = parseISO(dateString)
  return (
    <Time dateTime={dateString} {...rest}>
      {format(date, 'LLLL	d, yyyy')}
    </Time>
  )
}
