import React from 'react'
import styles from '../sobre/styles.module.scss'
import { UserHeader } from '../../components/UserHeader'
import Footer from '../../components/Footer'


export default function About() {
  return (
    <>
    <UserHeader/>
        <div className={styles.page}>
            <h1>NossaBiblioteca</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                Eos facere enim veritatis asperiores, sed, consectetur recusandae ad assumenda id facilis aliquam minima vero provident fuga quos? 
                Labore numquam blanditiis eos.</p>
        </div>
        <Footer/>
    </>
  )
}

