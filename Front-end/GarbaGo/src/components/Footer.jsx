import React, { useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { Link } from 'react-router-dom';

const Footer = () => {
    const [openSection, setOpenSection] = useState(null);

    const sections = [
        {
            id: 'about',
            title: 'About GarbaGo',
            items: [
                'Our Story',
                'Team',
                'Careers',
                'Contact Us'
            ]
        },
        {
            id: 'events',
            title: 'Events',
            items: [
                'Upcoming Garba Nights',
                'Past Events',
                'Host an Event',
            ]
        },
        {
            id: 'support',
            title: 'Support',
            items: [
                'FAQs',
                'Help Center',
                'Privacy Policy',
                'Terms & Conditions'
            ]
        }
    ];

    const toggleSection = (id) => {
        setOpenSection(prev => (prev === id ? null : id));
    };

    return (
        <footer className='bg-gray-800 text-white w-full mt-10 relative bottom-0'>
            {/* Top section */}
            <div className='flex flex-col md:flex-row justify-between items-center py-4 px-6 border-b border-gray-600'>
                <h1 className='text-xl md:text-2xl font-bold'>
                    <span className='text-purple-600'>Garba</span>
                    <span className='text-black ml-1'>Go</span> 🎉
                </h1>
                <p className='mt-2 md:mt-0'>Connecting you to the best Garba events!</p>
            </div>

            {/* Sections */}
            <div className='p-6 md:grid grid-cols-3 gap-6'>
                {sections.map(section => (
                    <div key={section.id} className='mb-6 md:mb-0'>
                        <div className='flex justify-between items-center cursor-pointer md:cursor-auto' onClick={() => toggleSection(section.id)}>
                            <h2 className='font-bold text-lg mb-2'>{section.title}</h2>
                            {openSection === section.id ? 
                                <IoIosArrowDropup className='md:hidden block' size={24} /> : 
                                <IoIosArrowDropdown className='md:hidden block' size={24} />}
                        </div>
                        <ul className={`transition-all duration-300 ${openSection === section.id ? 'block' : 'hidden'} md:block`}>
                            {section.items.map((item, idx) => (
                                <Link key={idx} to={''} className='hover:underline block mb-1'>
                                    <li>{item}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom */}
            <div className='bg-gray-900 text-gray-400 flex flex-col md:flex-row justify-between items-center p-4 text-sm mt-auto'>
                <p>&copy; 2025 <span className='text-purple-600'>Garba</span><span className='text-black ml-1'>Go</span>, Inc. All rights reserved.</p>
                <Link to={''} className='hover:underline mt-2 md:mt-0'>Cookie Settings</Link>
            </div>
        </footer>
    );
};

export default Footer;
