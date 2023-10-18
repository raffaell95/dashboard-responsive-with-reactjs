import { useState } from 'react'
import { Container, Logo, Form, FormTitle } from "./styles"
import logoImg from '../../assets/logo.svg'
import Input from "../../components/Input"
import Button from "../../components/Button"
import { useAuth } from '../../hooks/auth'
import { useNavigate } from 'react-router-dom'

const SignIn: React.FC = () =>{
    const navegate = useNavigate()

    const { signIn, logged } = useAuth()
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')

    
    const handleSubmit = () =>{
        signIn(email, password)
        if(logged){
            navegate('/dashboard', {replace: true})
        }
    }
    return (
        <Container>
            <Logo>
                <img src={logoImg} alt="Minha Carteira" />
                <h2>Minha Carteira</h2>
            </Logo>
            <Form onSubmit={() => handleSubmit()}>
                <FormTitle>Entrar</FormTitle>
                <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e-mail"
                    type="email" 
                    required 
                />
                <Input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="senha"
                    type="password" 
                    required 
                />
            
                <Button type="submit">Acessar</Button>
            </Form>
        </Container>
    )
}

export default SignIn