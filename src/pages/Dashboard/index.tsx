import { useMemo, useState, useEffect } from "react"
import ContentHeader from "../../components/ContentHeader"
import { Container, Content } from "./styles"

import gains from '../../repositories/gains'
import expenses from '../../repositories/expenses'
import listOfMonths from '../../utils/months'
import WalletBox from "../../components/WalletBox"
import MessageBox from "../../components/MessageBox"
import happyImg from "../../assets/happy.svg"
import sadImg from "../../assets/sad.svg"
import grinning from '../../assets/grinning.svg'
import PieChartBox from "../../components/PieChartBox"
import HistoryBox from "../../components/HistoryBox"
import BarChartBox from "../../components/BarChartBox"
import SelectInput from "../../components/SelectInput"

const Dashboard: React.FC = () => {
    // const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1)
    // const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear())
    const [monthSelected, setMonthSelected] = useState<number>(1)
    const [yearSelected, setYearSelected] = useState<number>(2020)

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month
            }
        })
    }, [])

    const years = useMemo(() => {
        let uniqueYears: number[] = []
        const mergeData = [...expenses, ...gains]
        mergeData.forEach(item => {
            const date = new Date(item.date)
            const year = date.getFullYear()
            if (!uniqueYears.includes(year)) {
                uniqueYears.push(year)
            }
        })
        return uniqueYears.map(year => {
            return {
                value: year,
                label: year
            }
        })
    }, [])

    const totalExpenses = useMemo(() => {
        let total: number = 0
        expenses.forEach(item => {
            const date = new Date(item.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount)
                } catch (error) {
                    console.log(error)
                    throw new Error('INvalid amount! Amount must be number')
                }
            }
        })
        return total
    }, [monthSelected, yearSelected])

    const totalGains = useMemo(() => {
        let total: number = 0
        gains.forEach(item => {
            const date = new Date(item.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount)
                } catch (error) {
                    console.log(error)
                    throw new Error('INvalid amount! Amount must be number')
                }
            }
        })
        return total
    }, [monthSelected, yearSelected])

    const totalBalance = useMemo(() => {
        return totalGains - totalExpenses
    }, [totalGains, totalExpenses])

    const message = useMemo(() => {
        if (totalBalance < 0) {
            return {
                title: "Que triste!",
                description: "Neste mês, você gastou mais do que deveria.",
                footerText: "Verifique seus gastos e tente cortar algumas coisas desnecessárias.",
                icon: sadImg
            }
        } else if (totalGains === 0 && totalExpenses === 0) {
            return {
                title: "Ops!",
                description: "Neste mês, não há registros de entradas ou saidas!",
                footerText: "Parece que você não fez nenhum registro no mês e ano selecionados.",
                icon: grinning
            }
        } else if (totalBalance === 0) {
            return {
                title: "Ufaa!",
                description: "Neste mês, você gastou exatamente o que ganhou!",
                footerText: "Tenha cuidado. No proximo mês tente poupar o seu dinheiro.",
                icon: grinning
            }
        } else {
            return {
                title: "Muito bem!",
                description: "Sua carteira está positiva!",
                footerText: "Continue assim. Considere investir o seu saldo.",
                icon: happyImg
            }
        }
    }, [totalBalance, totalGains, totalExpenses])

    const relationExpensesVersusGains = useMemo(() => {
        const total = totalGains + totalExpenses
        const percentGains = Number(((totalGains / total) * 100).toFixed(1))
        const percentExpenses = Number(((totalExpenses / total) * 100).toFixed(1))

        const data = [
            {
                name: 'Entradas',
                value: totalGains,
                percent: percentGains ? percentGains : 0,
                color: '#E44C4E'
            },
            {
                name: 'Saídas',
                value: totalExpenses,
                percent: percentExpenses ? percentExpenses : 0,
                color: '#F7931B'
            }
        ]

        return data

    }, [totalGains, totalExpenses])

    const historyData = useMemo(() => {
        return listOfMonths.map((_, month) => {
            let amountEntry = 0
            gains.forEach(gain => {
                const date = new Date(gain.date)
                const gainMonth = date.getMonth()
                const gainYear = date.getFullYear()

                if (gainMonth === month && gainYear === yearSelected) {
                    try {
                        amountEntry += Number(gain.amount)
                    } catch (error) {
                        console.log(error)
                        throw new Error('amountEntry is invalid. amountEntry must be number')
                    }
                }
            })

            let amountOutput = 0
            expenses.forEach(expense => {
                const date = new Date(expense.date)
                const expenseMonth = date.getMonth()
                const expenseYear = date.getFullYear()

                if (expenseMonth === month && expenseYear === yearSelected) {
                    try {
                        amountOutput += Number(expense.amount)
                    } catch (error) {
                        console.log(error)
                        throw new Error('amountOutput is invalid. amountOutput must be number')
                    }
                }
            })

            return {
                monthNumber: month,
                month: listOfMonths[month].substring(0, 3),
                amountEntry,
                amountOutput
            }

        }).filter(item => {
            const currentMonth = new Date().getMonth()
            const currentYear = new Date().getFullYear()

            return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)
        })
    }, [yearSelected])

    const relationExpensesRecurrentVesusEventual = useMemo(() => {
        let amountRecurrent = 0
        let amountEventual = 0

        expenses.filter((expense) => {
            const date = new Date(expense.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1

            return month === monthSelected && year === yearSelected
        }).forEach((expense) => {
            if (expense.frequency === 'recorrente') {
                return amountRecurrent += Number(expense.amount)
            }

            if (expense.frequency === 'eventual') {
                return amountEventual += Number(expense.amount)
            }
        })

        const total = amountRecurrent + amountEventual

        const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1))
        const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1))

        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: recurrentPercent ? recurrentPercent : 0,
                color: '#F7931B'
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: eventualPercent ? eventualPercent : 0,
                color: '#E44C4E'
            }
        ]

    }, [monthSelected, yearSelected])

    const relationGainsRecurrentVesusEventual = useMemo(() => {
        let amountRecurrent = 0
        let amountEventual = 0

        gains.filter((gain) => {
            const date = new Date(gain.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1

            return month === monthSelected && year === yearSelected
        }).forEach((gain) => {
            if (gain.frequency === 'recorrente') {
                return amountRecurrent += Number(gain.amount)
            }

            if (gain.frequency === 'eventual') {
                return amountEventual += Number(gain.amount)
            }
        })

        const total = amountRecurrent + amountEventual

        const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1))
        const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1))

        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: recurrentPercent ? recurrentPercent : 0,
                color: '#F7931B'
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: eventualPercent ? recurrentPercent : 0,
                color: '#E44C4E'
            }
        ]

    }, [monthSelected, yearSelected])

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month)
            setMonthSelected(parseMonth)
        } catch (error) {
            console.log(error)
            throw new Error('invalid month value. Is accept 0 - 24.')
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year)
            setYearSelected(parseYear)
        } catch (error) {
            console.log(error)
            throw new Error('invalid year value. Is accept integer number.')
        }
    }

    useEffect(() => {
        console.log('teste')
    }, [])

    return (
        <Container>
            <ContentHeader title="Dashboard" lineColor="#F7931B">
                <SelectInput
                    defaultValue={monthSelected}
                    onChange={(e) => handleMonthSelected(e.target.value)}
                    options={months}
                />

                <SelectInput
                    defaultValue={yearSelected}
                    onChange={(e) => handleYearSelected(e.target.value)}
                    options={years}
                />
            </ContentHeader>
            <Content>
                <WalletBox
                    title="saldo"
                    amount={totalBalance}
                    footerLabel="atualizado com base nas entradas e saidas"
                    icon="dolar"
                    color="#4E41F0"
                />

                <WalletBox
                    title="entradas"
                    amount={totalGains}
                    footerLabel="atualizado com base nas entradas e saidas"
                    icon="arrowUp"
                    color="#F7931B"
                />

                <WalletBox
                    title="saídas"
                    amount={totalExpenses}
                    footerLabel="atualizado com base nas entradas e saidas"
                    icon="arrowDown"
                    color="#E44C4E"
                />

                <MessageBox
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />

                <PieChartBox data={relationExpensesVersusGains} />

                <HistoryBox
                    data={historyData}
                    lineColorAmountEntry="#F7931B"
                    lineColorAmountOutput="#E44C4E"
                />

                <BarChartBox
                    title="Entradas"
                    data={relationGainsRecurrentVesusEventual}
                />

                <BarChartBox
                    title="Saídas"
                    data={relationExpensesRecurrentVesusEventual}
                />


            </Content>
        </Container>
    )
}

export default Dashboard