import { Outlet } from 'react-router-dom'
import Aside from '../Aside'
import Content from '../Content'
import MainHeader from '../MainHeader'
import { Grid } from './styles'


const Layout: React.FC = () => (
    <Grid>
        <MainHeader />
        <Aside />
        <Content>
            <Outlet />
        </Content>
    </Grid>
)


export default Layout