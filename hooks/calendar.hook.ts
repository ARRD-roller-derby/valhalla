/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from 'dayjs'
import { useCallback, useEffect, useReducer } from 'react'

export interface ICallDay {
  date: dayjs.Dayjs
  day: number
  month: number
  isCurrentMonth: boolean
}

export interface IEventCal {
  start: Date
  end: Date
  title: string
  description: string
  id: string
}

interface IState {
  cal: ICallDay[]
  year: number
  month: number
  currentMonth: string
  startOfMonth: string
  endOfMonth: string
}

interface IAction {
  type: 'NEXT_MONTH' | 'PREVIOUS_MONTH' | 'SET_CALENDAR'
  cal?: ICallDay[]
  currentMonth?: string
  startOfMonth?: string
  endOfMonth?: string
}

// Actions
const NEXT_MONTH = 'NEXT_MONTH'
const PREVIOUS_MONTH = 'PREVIOUS_MONTH'
const SET_CALENDAR = 'SET_CALENDAR'

const initialState: IState = {
  cal: [],
  year: dayjs().year(),
  month: dayjs().month(),
  currentMonth: '',
  startOfMonth: '',
  endOfMonth: '',
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case NEXT_MONTH:
      const nextMonth = state.month + 1
      return {
        ...state,
        month: nextMonth >= 12 ? 0 : nextMonth,
        year: nextMonth >= 12 ? state.year + 1 : state.year,
      }
    case PREVIOUS_MONTH:
      const previousMonth = state.month - 1
      return {
        ...state,
        month: previousMonth < 0 ? 11 : previousMonth,
        year: previousMonth < 0 ? state.year - 1 : state.year,
      }
    case SET_CALENDAR:
      return {
        ...state,
        cal: action.cal || [],
        currentMonth: action.currentMonth || '',
        startOfMonth: action.startOfMonth || '',
        endOfMonth: action.endOfMonth || '',
      }
    default:
      return state
  }
}

export function useCalendar() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const generateCalendarDays = useCallback((year: number, month: number) => {
    const thisMonth = dayjs().set('year', year).set('month', month),
      firstDay = dayjs(thisMonth).startOf('month'),
      lastDay = dayjs(thisMonth).endOf('month'),
      firstCalDay = firstDay.subtract(firstDay.day() - 1, 'day'),
      lastCalDay = lastDay.add(lastDay.day() === 0 ? 0 : 7 - lastDay.day(), 'day'),
      numOfDay = lastCalDay.diff(firstCalDay, 'day'),
      generateCal = []

    for (let i = 0; i < numOfDay + 1; i++) {
      const day = firstCalDay.add(i, 'day')
      generateCal.push({
        date: day,
        month: day.month(),
        day: day.day(),
        isCurrentMonth: day.month() === month,
      })
    }

    return generateCal.slice(0, 35)
  }, [])

  const createCalendar = useCallback(
    (year: number, month: number) => {
      const thisMonth = dayjs().set('year', year).set('month', month)
      const firstDay = dayjs(thisMonth).startOf('month')
      const lastDay = dayjs(thisMonth).endOf('month')

      dispatch({
        type: SET_CALENDAR,
        cal: generateCalendarDays(year, month),
        currentMonth: thisMonth.format('MMMM YYYY'),
        startOfMonth: firstDay.toISOString(),
        endOfMonth: lastDay.toISOString(),
      })
    },
    [generateCalendarDays]
  )

  const nextMonth = () => {
    dispatch({ type: NEXT_MONTH })
  }

  const previousMonth = () => {
    dispatch({ type: PREVIOUS_MONTH })
  }

  useEffect(() => {
    createCalendar(state.year, state.month)
  }, [state.year, state.month])

  return {
    cal: state.cal,
    currentMonthNum: state.month,
    nextMonth,
    previousMonth,
    currentMonth: state.currentMonth,
  }
}
