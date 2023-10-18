import React from 'react';
import { Container } from './styles'

const Content: React.FC<any> = ({children}: any) =>  (
        <Container>
            {children}
        </Container>
    )

export default Content