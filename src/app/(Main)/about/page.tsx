import type { Metadata } from "next";
import React from 'react'
import PageTitle from '@/Shared/PageTitle/PageTitle'

export const metadata: Metadata = {
  title: "About",
  description: "Discover Decorva's story, our commitment to quality and our passion for interior design.",
};

const About = () => {
    return (
        <div>
            <PageTitle title="About" subTitle="Home / About" />
        </div>
    )
}

export default About