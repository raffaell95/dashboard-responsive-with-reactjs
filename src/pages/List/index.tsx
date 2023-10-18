import { useMemo, useState, useEffect } from "react"
import ContentHeader from "../../components/ContentHeader"
import HistoryFinanceCard from "../../components/HistoryFinanceCard"
import { Container, Content, Filters } from "./styles"

import { useParams } from 'react-router-dom'

import gains from '../../repositories/gains'
import expenses from '../../repositories/expenses'
import formatCurrency from "../../utils/formatCurrency"
import formatDate from "../../utils/formatDate"
import listOfMonths from '../../utils/months'
import { v4 as uuid } from 'uuid'
import SelectInput from "../../components/SelectInput"

interface IData {
    id: string
    description: string
    amountFormated: string
    frequency: string
    dateFormated: string
    tagColor: string
}

const List: React.FC = () => {
    const [data, setData] = useState<IData[]>([])
    // const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1)
    // const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear())
    const [monthSelected, setMonthSelected] = useState<number>(1)
    const [yearSelected, setYearSelected] = useState<number>(2020)
    const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente', 'eventual'])

    const { moviment_type } = useParams()

    const pageData = useMemo(() => {
        return moviment_type === 'entry-balance' ? {
            title: 'Entradas',
            lineColor: '#4E41F0',
            data: gains
        } : {
            title: 'Saidas',
            lineColor: '#E44C4E',
            data: expenses
        }
    }, [moviment_type])

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
        pageData.data.forEach(item => {
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
    }, [pageData.data])

    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency)
        if (alreadySelected >= 0) {
            const filtered = frequencyFilterSelected.filter(item => item !== frequency)
            setFrequencyFilterSelected(filtered)
        } else {
            setFrequencyFilterSelected((prev) => [...prev, frequency])
        }
    }

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
        const filteredData = pageData.data.filter(item => {
            const date = new Date(item.date)
            const month = date.getMonth() + 1
            const year = date.getFullYear()

            return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency)
        })

        const formattedData = filteredData.map(item => {
            return {
                id: uuid(),
                description: item.description,
                amountFormated: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormated: formatDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
            }
        })
        setData(formattedData)
    }, [pageData.data, monthSelected, yearSelected, data.length, frequencyFilterSelected])

    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
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

            <Filters>

                <button
                    onClick={() => handleFrequencyClick('recorrente')}
                    className={`tag-filter tag-filter-recurrent 
                        ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}`}
                    type="button">Recorrentes
                </button>

                <button
                    onClick={() => handleFrequencyClick('eventual')}
                    className={`tag-filter tag-filter-eventual
                        ${frequencyFilterSelected.includes('eventual') && 'tag-actived'}`}
                    type="button">Eventuais
                </button>

            </Filters>

            <Content>
                {
                    data.map(item => (
                        <HistoryFinanceCard
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormated}
                            amount={item.amountFormated}
                        />
                    ))
                }
            </Content>
        </Container>
    )
}

export default List