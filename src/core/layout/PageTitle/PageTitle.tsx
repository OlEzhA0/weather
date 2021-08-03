import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

interface Props {
  title: string
}

const PageTitle: FC<Props> = ({ title, children }) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </>
)

export default PageTitle
