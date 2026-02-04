import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { lora } from '../font/Rubik';

const Footer = () => {
    return (
        <footer className='bg-[#F2F5F1]'>
            <div className='global-padding layout grid lg:grid-cols-[1fr_1fr_2fr_1fr_1fr] gap-10 py-10 lg:py-20'>
                <div>
                    <h3 className='footer-title'>Opening Time</h3>
                    <ul className='space-y-2'>
                        <li className='text-sm leading-[30px]'>Mon - Fri: 8AM - 10PM</li>
                        <li className='text-sm leading-[30px]'>Sat: 9AM-8PM</li>
                        <li className='text-sm leading-[30px]'>Suns: 14hPM-18hPM</li>
                    </ul>
                    <p className='text-sm leading-[30px] mt-6'>
                        <strong>We Work All The Holidays</strong>
                    </p>
                </div>
                <div>
                    <h3 className='footer-title'>Information</h3>
                    <ul className='space-y-2'>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/about"}>About Us</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/shop"}>Shop</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/contact"}>Contact</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/frequently-questions"}>Frequently Questions</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/wishlist"}>Wishlist</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className='global-h2 text-center'>Decorva</h2>
                    <div>
                        <ul className='flex items-center justify-center gap-4 mt-6'>
                            <li>
                                <Link href={"/"} className='inline-block text-sm leading-[30px]'>
                                    Payment
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"} className='inline-block text-sm leading-[30px]'>
                                    Delivery
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"} className='inline-block text-sm leading-[30px]'>
                                    Return
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='flex items-center gap-4 mt-6 justify-center'>
                        <div className='p-3 bg-[#E1E1E1] rounded-full'>
                            <Facebook fill='black' />
                        </div>
                        <div className='p-3 bg-[#E1E1E1] rounded-full'>
                            <Instagram />
                        </div>
                        <div className='p-3 bg-[#E1E1E1] rounded-full'>
                            <Twitter fill='black' />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className='footer-title'>My Account</h3>
                    <ul className='space-y-2'>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/my-account"}>My Account</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/cart"}>Shopping cart</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/checkout"}>Checkout</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/my-account?order=true"}>Order History</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='footer-title'>Customer Service</h3>
                    <ul className='space-y-2'>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/contact-us"}>Contact Us</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/terms-and-conditions"}>Terms & Conditions</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/privacy-policy"}>Privacy Policy</Link>
                        </li>
                        <li className='text-sm leading-[30px] hover:text-primary transition-colors duration-300 text-black'>
                            <Link href={"/refund-policy"}>Refund Policy</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='global-padding layout flex items-center justify-between border-t border-t-[#E1E1E1] py-6'>
                <p className='text-sm leading-[30px]'>© 2026 Decorva. All rights reserved.</p>
                <span className={`text-[8px] leading-[10px] ${lora.className}`}> mady by <a href="https://wa.me/+8801726108060" target="_blank" rel="noopener noreferrer" className='text-primary cursor-pointer hover:underline transition-all duration-300'>Shariar Ayon</a></span>
            </div>
        </footer>
    )
}

export default Footer;