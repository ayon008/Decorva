import React from 'react'
import { lora } from '../font/Rubik';
import Link from 'next/link';

const PageTitle = ({ title, subTitle }: { title: string, subTitle: string }) => {
    const links = subTitle.split(' / ');
    console.log(links);

    return (
        <section className='bg-[#F0F0F0] py-10 border-b border-b-[#E1E1E1]'>
            <h1 className={`global-h1 font-normal! text-center ${lora.className}`}>{title}</h1>
            <p className={`text-base leading-[24px] ${lora.className} text-center mt-4`}>
                {links.map((link, index) => (
                    <Link className='capitalize' href={`/${link}`} key={index}>{link}</Link>
                ))}
            </p>
        </section>
    )
}

export default PageTitle;