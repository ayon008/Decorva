import type { Metadata } from "next";
import PageTitle from '@/Shared/PageTitle/PageTitle'
import React from 'react'

export const metadata: Metadata = {
  title: "Blog",
  description: "Decorva news, trends and interior design tips. Inspiration and ideas to beautify your home.",
};

const Blog = () => {
    return (
        <div>
            <PageTitle title="Blog" subTitle="Home / Blog" />
        </div>
    )
}

export default Blog