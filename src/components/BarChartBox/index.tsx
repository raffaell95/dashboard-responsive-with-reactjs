import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Container, SideLeft, SideRight, LegendContainer, Legend } from "./styles"
import formatCurrency from "../../utils/formatCurrency"

interface IBarChartProps{
    title: string
    data: {
        name: string
        amount: number
        percent: number
        color: string
    }[]
}

const BarChartBox: React.FC<IBarChartProps> = ({title, data}) => (
        <Container>
            <SideLeft>
                <h2>{title}</h2>
                <LegendContainer>
                {
                    data.map(indicator => (
                        <Legend key={indicator.name} color={indicator.color}>
                            <div>{indicator.percent}%</div>
                            <span>{indicator.name}</span>
                        </Legend>
                    ))
                }
            </LegendContainer>
            </SideLeft>
            <SideRight>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <Bar dataKey="amount" name="Valor">
                            {data.map((indicator) =>(
                                <Cell 
                                    key={indicator.name}
                                    cursor="pointer"
                                    fill={indicator.color}
                                />
                            ))}
                        </Bar>
                        <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            cursor={{fill: 'none'}}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </SideRight>
        </Container>
    )

export default BarChartBox

