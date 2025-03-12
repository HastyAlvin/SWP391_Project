import React from 'react'
import ERRORIMAGE from '../../assets/404.png'    
import { Link } from 'react-router-dom'
export default function UnAuthorized() {
  return (
    <div>
        <img src={ERRORIMAGE} alt="404" />
        <Link to="/" style={{position:'relative', }}>Back to Login</Link>
    </div>
  )
}
