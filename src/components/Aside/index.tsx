import { useState } from 'react'
import { Container, Header, LogImg, Title, 
    MenuContainer, MenuItemLink, MenuItemButton, ToggleMenu, ThemeToggleFooter } from './styles'
import { MdDashboard, MdArrowDownward, 
    MdArrowUpward, MdExitToApp, MdClose, MdMenu } from 'react-icons/md'
import logoImg from '../../assets/logo.svg'
import {useAuth} from '../../hooks/auth'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/theme'
import Toggle from '../Toggle'

const Aside: React.FC = () =>{
    const navegate = useNavigate()

    const { signOut } = useAuth()
    const { toggleTheme, theme } = useTheme()

    const [toggleMenuIsOpened, setToggleMenuIsOpened] = useState(false)
    const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false)  

    const handleToggleMenu = () =>{
        setToggleMenuIsOpened(!toggleMenuIsOpened)
    }

    const handleChangeTheme = () =>{
        setDarkTheme(!darkTheme)
        toggleTheme()
    }


    const handleSignOut = () =>{
        signOut()
        navegate('/',  {replace: true})
    }

    return (
        <Container menuIsOpen={toggleMenuIsOpened}>
            <Header>
                <ToggleMenu onClick={handleToggleMenu}>
                    { toggleMenuIsOpened ? <MdClose /> : <MdMenu />}
                </ToggleMenu>

                <LogImg src={logoImg} alt="Logo Minha Carteira" />
                <Title>Minha Carteira</Title>
            </Header>
            <MenuContainer>

                <MenuItemLink href="/dashboard">
                    <MdDashboard />
                    Dashboard
                </MenuItemLink>

                <MenuItemLink href="/list/entry-balance">
                    <MdArrowUpward />
                    Entradas
                </MenuItemLink>

                <MenuItemLink href="/list/exit-balance">
                    <MdArrowDownward />
                    Saidas
                </MenuItemLink>

                <MenuItemButton onClick={() => handleSignOut()}>
                    <MdExitToApp />
                    Sair
                </MenuItemButton>

            </MenuContainer>

            <ThemeToggleFooter menuIsOpen={toggleMenuIsOpened}>
                <Toggle
                    labelLeft="Light"
                    labelRight="Dark"
                    checked={darkTheme}
                    onChange={handleChangeTheme}
                />
            </ThemeToggleFooter>
        </Container>
    )
}

export default Aside