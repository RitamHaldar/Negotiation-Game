import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import Loading from './Loading'

const Protected = ({ children }) => {
    const { loading, user } = useSelector((state) => state.auth)
    if (loading) {
        return <Loading />
    }
    if (!user) {
        return <Navigate to="/login" />
    }
    return children
}

export default Protected